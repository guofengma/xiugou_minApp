let { Tool, RequestFactory, Storage, Event, Operation } = global

Page({
  data: {

  },
  onLoad: function (options) {
    Tool.isIPhoneX(this)
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onShareAppMessage: function (res) {
    return {
      title: name,
      path: '/pages/my/extension/extension-detail/extension-detail',
      imageUrl: imgUrl
    }
  },
})