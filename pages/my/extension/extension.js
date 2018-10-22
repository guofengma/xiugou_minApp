let { Tool, RequestFactory, Storage, Event, Operation } = global

Page({
  data: {

  },
  onLoad: function (options) {
    Tool.isIPhoneX(this)
  },
  bottomBtnClicked(){
    Tool.navigateTo('/pages/my/extension/extension-type/extension-type')
  },
  onShow: function () {

  },

  onUnload: function () {

  },
  
})