let { Tool, RequestFactory, Storage, Event, Operation } = global
Page({
  data: {

  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  itemClicked(e){
    let num = e.currentTarget.dataset.num
    Tool.navigateTo('/pages/my/extension/pay/pay?num='+num)
  },
  goPage(){
    Tool.navigateTo('/pages/my/extension/extension-explain/extension-explain')
  },
  onHide: function () {

  },
  onUnload: function () {

  },
})