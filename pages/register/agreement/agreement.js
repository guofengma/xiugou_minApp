let { Config } = global
Page({
  data: {
    page: '/static/protocol/service.html'
  },
  onLoad: function (options) {
    this.setData({
      webUrl: Config.h5webUrl + this.data.page
    })
  },
})