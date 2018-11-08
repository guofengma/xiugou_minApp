const app = getApp()

let { Tool, Config, Storage, Event} = global

Page({
  data: {
    webUrl: '',
    url:""
  },
  onLoad: function (options) {
    this.setData({
      webUrl: Config.h5webUrl
    })
    let callBack = ()=>{
      let url = this.data.webUrl + '/promote?id=' + options.id + '&openid=' + Storage.getWxOpenid()
      this.setData({
        url: url
      })
    }
    if (!app.globalData.systemInfo) {
      app.getSystemInfo()
    }
    app.wxLogin(callBack)
  }
})