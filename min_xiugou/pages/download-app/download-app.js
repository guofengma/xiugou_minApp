let { Config } = global
Page({
  data: {
    page:'/download'
  },
  onLoad: function (options) {
    this.setData({
      webUrl: Config.h5webUrl + this.data.page+'?_='+new Date().getTime()
    })
  },
})