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
      //Tool.showAlert("红包id"+options.id+"openid:"+Storage.getWxOpenid())
      this.setData({
        url: url
      })
    }
    if (!app.globalData.systemInfo) {
      app.getSystemInfo()
    }
    app.wxLogin(callBack)
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})