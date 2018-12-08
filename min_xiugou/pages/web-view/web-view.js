const app = getApp()

let { Tool, Config, Storage, Event} = global

Page({
  data: {
    webUrl: '',
    url:"",
    arr:{
      1:'/static/protocol/extensionExplain.html',// 推广协议
      2:'/static/protocol/service.html',// 用户协议
      3:'/download',//下载页面
      4:'/static/protocol/signInRule.html', //签到协议
      5:'/topic/first', // h5专题
    }
  },
  onLoad: function (options) {
    let miniparams = JSON.stringify({
      'device': Storage.getPlatform() || '', // 设备唯一标识
      'platform': 'mini', // 小程序标识
      'sg-token': Storage.getToken() || '', // 用户token
      'userid': Storage.getUserAccountInfo().id || '', // 设备唯一标识
    })
    this.setData({
      webUrl: Config.h5webUrl
    })
    if (options.webUrl){
      this.setData({
        url: this.data.webUrl + options.webUrl + '?time=' + new Date().getTime() 
      })
    }
    if (options.webType){
      let url = this.data.webUrl + this.data.arr[options.webType] + '?time=' + new Date().getTime()
      if (options.webType == 5) url += ('&miniparams=' + miniparams)
      this.setData({
        url: url
      })
    }else{
      let callBack = () => {
        let url = this.data.webUrl + '/promote?id=' + options.id + '&openid=' + Storage.getWxOpenid()
        this.setData({
          url: url + '?_=' + new Date().getTime()
        })
      }
      if (!app.globalData.systemInfo) {
        app.getSystemInfo()
      }
      app.wxLogin(callBack)
    }
  }
})