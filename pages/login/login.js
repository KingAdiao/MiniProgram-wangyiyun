import request from '../../utils/request.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:'',
    userInfo:{}
  },

  //收集手机号码和密码
  handleChange(event){
    // console.log(event)
    let type = event.currentTarget.id
    this.setData({
      [type]:event.detail.value
    })
  },

  //登录，表单验证，发请求
  async handleLogin(){
    //1.收集数据
    let {phone,password} = this.data
    //2.前台表单验证
    let phoneReg = new RegExp(/^1[0-9]{10}/);
    let pwdReg = new RegExp(/[a-zA-Z0-9]{6}/);
    if(!phoneReg.test(phone)){
      wx.showToast({
        title: '手机号不正确！',
        icon:'none'
      })
      return
    }
    if (!pwdReg.test(password)) {
      wx.showToast({
        title: '密码格式不正确',
        icon: "none"
      })
      return;
    }
    //3.发请求,后端验证
    /*
      发送请求
      手机号错误:提示400,
      密码错误:提示502
      成功:提示200
    */
    let result = await request('/login/cellphone', { phone, password,isLogin:true});
    console.log(result)
    if(result.code ===200){
      //存储数据
      wx.setStorage({
        key: 'userInfo',
        data: JSON.stringify(result.profile),
      })

      wx.showToast({
        title: '登陆成功',
        icon: 'success',
        duration: 1500
      })
      wx.switchTab({
        url: '/pages/personal/personal',
      })
    }else{
      wx.showToast({
        title: '密码错误',
        icon:'none'
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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