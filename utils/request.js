/*
  封装代码的核心思想
  保留公共部分,提取动态数据由外部传入
  1)封装函数
    保留公共部分:重复出现的代码
    提取动态数据:将每次不同的数据提取成形参
    谁调用谁传入
  2)封装组件
    保留公共部分:重复出现的代码(template和style)
    提取动态数据:将动态数据由props传入
    谁调用谁传入
*/
import config from './config.js'
export default function(url,data={},method='GET'){
  return new Promise(function(resolve,reject){
    wx.request({
      url:config.mpHost + url,
      data,
      method,
      header:{
        cookie:JSON.parse(wx.getStorageSync('cookies') || '[]').toString()
      },
      success:(res) =>{
        // console.log(res)
        if (data.isLogin) {
          //将cookies保存至Storage中
          let cookies = res.cookies;
          wx.setStorage({
            key: 'cookies',
            data: JSON.stringify(cookies)
          })
          // console.log('cookies', cookies)
        }
        resolve(res.data)
      },
    })
  })
}