// pages/personal/personal.js
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moveDistance:0,
    moveTransition:'none',
    userInfo:{},
    playList:null
  },

  handleStart(event){
    this.startY = event.touches[0].clientY
    this.setData({
      moveTransition:'none'
    })
  },
  handleMove(event){
    let moveY = event.touches[0].clientY
    let moveDistance = Math.floor(moveY - this.startY)
    if(moveDistance < 0) return
    if(moveDistance > 80) moveDistance = 80
    this.setData({
      moveDistance
    })
  },
  handleEnd(){
    this.setData({
      moveDistance:0,
      moveTransition:'transform 1s'
    })
  },

  toLogin(){
    if(this.data.userInfo.nickname) return;
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //读取Storage中的数据,更新到data中,进行动态渲染
    // let userInfoStr = wx.getStorageSync("userInfo");
    // // console.log(userInfoStr)
    // if (!this.data.userInfo.nickname && userInfoStr) {
    //   //如果Storage中有存储用户的数据,就更新到data中
    //   this.setData({
    //     userInfo: JSON.parse(userInfoStr)
    //   })
    // }
    // let playListData = await request('/user/record', { uid: this.data.userInfo.userId, type: 1 })
    // this.setData({
    //   playList: playListData.weekData
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    let userInfoStr = wx.getStorageSync('userInfo')
    if(userInfoStr){
      this.setData({
        userInfo:JSON.parse(userInfoStr)
      })
    }
    let result = await request('/user/record', { uid: this.data.userInfo.userId, type: 1 })
    console.log(result)
    this.setData({
      playList: result.weekData
    })
    
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