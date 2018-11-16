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
    }
  },
  onLoad: function (options) {
    this.setData({
      webUrl: Config.h5webUrl
    })
    if (options.webUrl){
      this.setData({
        url: this.data.webUrl + options.webUrl + '?_=' + new Date().getTime()
      })
    }
    if (options.webType){
      this.setData({
        url: this.data.webUrl + this.data.arr[options.webType]+ '?_=' + new Date().getTime()
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