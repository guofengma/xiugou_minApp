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
  itemClicked(e){
    let index = e.currentTarget.dataset.index
    // Tool.navigateTo('/pages/my/extension/pay/pay?num=')
    Tool.navigateTo('/pages/my/extension/extension-detail/extension-detail')
  },
  goPage() {
    Tool.navigateTo('/pages/my/extension/extension-explain/extension-explain')
  },
  onShow: function () {

  },

  onUnload: function () {

  },
  
})