let { Config } = global
Page({
  data: {
    
  },
  onLoad: function (options) {
    this.setData({
      imgUrl: Config.imgBaseUrl
    })
  },
})