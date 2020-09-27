import request from '../../utils/request.js'

// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],
    recommendList:[],
    topList:[]
  },

  toRecommend(){
    wx.navigateTo({
      url: '/pages/recommend/recommend',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    request('/banner',{type:2},'GET')
      .then((res)=>{
        // console.log(res)
        this.setData({
          bannerList:res.banners
        })
      })
    //推荐歌单请求函数
    // wx.request({
    //   url: 'http://localhost:3000/personalized',
    //   data:{
    //     limit:30
    //   },
    //   success:(res)=>{
    //     console.log(res.data.result)
    //     this.setData({
    //       recommendList:res.data.result
    //     })
    //   }
    // })
    request('/personalized',{limit:30})
      .then((res)=>{
        // console.log(res)
        this.setData({
          recommendList:res.result
        })
      })
    //排行榜请求数据
    let arr = [1,2,5,8,10,28]
    let index = 0
    let topList = []
    while(index < arr.length){
    let res = await request('/top/list',{idx:arr[index++]})
    // console.log(res)
    let data = {
      name:res.playlist.name,
      tracks:res.playlist.tracks.slice(0,3)
      }
      topList.push(data)
      this.setData({
        topList:topList
      })
    }
      
      
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