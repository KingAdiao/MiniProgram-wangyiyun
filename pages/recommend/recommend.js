// pages/recommend/recommend.js
import request from '../../utils/request.js'
import Pubsub from 'pubsub-js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommonedList:[],
    day:'',
    month:'',
    currentIndex:null
  },

  //跳转到歌曲播放页面
  toSong(e){
    console.log(e)
    let {id} = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/song/song?songId='+id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      day:new Date().getDate(),
      month:new Date().getMonth()
    })


    if(wx.getStorageSync('cookies')){
      let result = await request('/recommend/songs')
      console.log(result)
      this.setData({
        recommonedList:result.recommend.slice(0,24)
      })
    }else{
      wx.showModal({
        title: '请先登录',
        content: '该功能需要登录',
        cancelText:'回到首页',
        confirmText:'去登陆',
        success(res){
          if(res.confirm){
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }else{
            wx.navigateBack({})
          }
        }
      })
    }

    //订阅消息，越早越好，所以在onload
    Pubsub.subscribe('switchType', (msg, data) => {
      //第一个实参是消息名称，第二个实参是真正发布的数据
      console.log('msg:',msg)
      console.log('data:',data)
      let currentIndex = this.data.currentIndex
      let recommonedList = this.data.recommonedList
      let id;
      if(data ==='next'){
        //点击的是下一首按钮
        if(currentIndex ===recommonedList.length -1){
          currentIndex = 0
        }else{
          currentIndex++
        }
      }else if(data === 'pre'){
        if(currentIndex === 0){
          currentIndex = recommonedList.length -1
        }else{
          currentIndex--
        }
      }
      this.setData({
        currentIndex
      })
      id = this.data.recommonedList[currentIndex].id

      //歌曲id筛选成功，传递给song页面
      Pubsub.publish('getMusicId',id)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})