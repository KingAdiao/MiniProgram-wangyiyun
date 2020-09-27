// pages/song/song.js
import request from '../../utils/request.js'
import Pubsub from 'pubsub-js'
import moment from 'moment'
let appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlaying:false,
    songs:{},
    songId:null,
    songUrl:'',
    currentTime:0,
    durationTime:0,
    currentWidth:0
  },

  //监听歌曲播放状态
  addAudioListener(){
    //播放状态
    this.backgroundAudioManager.onPlay(()=>{
      this.setData({
        isPlaying:true
      })
      appInstance.globalData.playState = true
    })
    //暂停状态
    this.backgroundAudioManager.onPause(()=>{
      this.setData({
        isPlaying:false
      })
      appInstance.globalData.playState = false
    })
    //停止状态
    this.backgroundAudioManager.onStop(()=>{
      this.setData({
        isPlaying:false
      })
      appInstance.globalData.playState = false
    })
    //监听背景音频播放器的进度是否处于更新状态
    this.backgroundAudioManager.onTimeUpdate(()=>{
      let currentTime = this.backgroundAudioManager.currentTime;
      let durationTime = this.backgroundAudioManager.duration;
      this.setData({
        currentTime,
        currentWidth:currentTime/durationTime *100
      })
    })

    //监听背景音频播当前歌曲是否播放结束
    this.backgroundAudioManager.onEnded(()=>{
      Pubsub.publish('switchType','next')
    })
  },

  //点击切换歌曲
  switchSong(e){
    //发布消息，传上一首还是下一首对应的pre next 的id
    Pubsub.publish('switchType',e.currentTarget.id)
  },

  //获取歌曲链接
  async getSongUrl(){
    let songData = await request('/song/url', { id: this.data.songId })
    // console.log('songData',songData)
    this.setData({
      songUrl: songData.data[0].url
    })
  },

  //封装播放音频的函数
  playAudio(){
    //播放音频
    //获取背景音频播放器
    // let backgroundAudioManager = wx.getBackgroundAudioManager()
    if (this.data.isPlaying) {
      //给背景音频播放器实例设置src和title,就能实现音频播放
      this.backgroundAudioManager.src = this.data.songUrl,
        this.backgroundAudioManager.title = this.data.songs.name
      // 在app实例对象上, 存储当前背景音频正在播放的歌曲状态以及id
      appInstance.globalData.playState = true
      appInstance.globalData.audioId = this.data.songId

    } else {
      this.backgroundAudioManager.pause()
    }
  },

  //获取歌曲详情
  async getSongDetail(){
    let result = await request('/song/detail',{ids:this.data.songId})
    // console.log('result',result)
    let songs = result.songs[0]
    this.setData({
      songs,
      durationTime:songs.dt
    })
    wx.setNavigationBarTitle({
      title: songs.name,
    })
  },

  //点击播放
  async handlePlay(){
    this.setData({
      isPlaying:!this.data.isPlaying
    })
    if(!this.data.songUrl){
      await this.getSongUrl()
    }
    // let currentTime;
    this.playAudio()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    
    let {songId} = options

    // let songId = '1315773657'
    this.setData({
      songId
    })
    await this.getSongDetail()

    //当用户进入song页面的时候,如果背景音频正在播放的是当前的这首歌,页面C3效果自动进入播放状态
    let{playState,audioId} = appInstance.globalData
    if(playState && audioId === songId){
      this.setData({
        isPlaying:true
      })
    }

    //绑定背景音频播放器相关监听
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    //封装成一个函数addAudioListener
    this.addAudioListener()

    //接收消息
    Pubsub.subscribe('getMusicId',async (msg,songId)=>{
      //获取到对应歌曲id,
      // 1.请求详细数据,请求音频地址
      // 2.播放对应歌曲
      this.setData({
        songId
      })
      this.getSongDetail()
      await this.getSongUrl()
      //播放歌曲
      this.setData({
        isPlaying:true
      })
      this.playAudio()
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