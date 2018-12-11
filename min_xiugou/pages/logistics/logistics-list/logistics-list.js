let { Tool,Storage } = global
Page({
  data: {
    hasExpress:true
  },
  onLoad: function (options) {
    let datas = Storage.getExpressInfo() || {}
    let sendNum = datas.send.length
    let unSendNum = datas.unSend.length>1? 1:0
    this.setData({
      datas: Storage.getExpressInfo(),
      sendNum: sendNum,
      unSendNum: unSendNum
    })
  },
  expressClicked(e){
    let id = e.currentTarget.dataset.id
    Tool.navigateTo('/pages/logistics/logistics?id=' + id)
  }
})