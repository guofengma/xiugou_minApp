let { Tool, RequestFactory, Storage, Event, Operation } = global

Page({
  data: {
    width:'50%'
  },
  onLoad: function (options) {
    Tool.isIPhoneX(this)
  },
  onShow: function () {
  
  },
})