let { Tool,Storage } = global
Page({
  data: {
    hasExpress:true
  },
  onLoad: function (options) {
    this.setData({
      datas: Storage.getExpressInfo()
    })
  },
  expressClicked(e){
    let id = e.currentTarget.dataset.id
    Tool.navigateTo('/pages/logistics/logistics?id=' + id)
  }
})