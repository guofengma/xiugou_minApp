let { Tool, RequestFactory, Storage, Event, Operation } = global
Page({
  data: {
    page: 1,
    pagesize: 10,
    list:[]
  },
  onLoad: function (options) {
    this.queryPromotionReceiveRecordPageList()
  },
  queryPromotionReceiveRecordPageList() {
    let params = {
      page: this.data.page,
      pageSize: this.data.pagesize,
      reqName: '推广红包列表',
      url: Operation.queryPromotionPackagePageList
    };
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let datas = req.responseObject.data || {}
      this.setData({
        list: this.data.list.concat(datas.data),
        totalPage: datas.totalPage
      })
    }
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  itemClicked(e){
    let index = e.currentTarget.dataset.index
    let num = this.data.list[index].count
    let total = this.data.list[index].total
    let price = this.data.list[index].price
    if (this.data.list[index].userBuy)
    Tool.navigateTo('/pages/my/extension/pay/pay?num=' + num + "&total=" + total + '&price=' + price)
  },
  onReachBottom() {
    this.data.page++;
    if (this.data.page > this.data.totalPage) {
      return
    }
    this.setData({
      page: this.data.page,
    })
    this.queryPromotionReceiveRecordPageList()
  },
  onHide: function () {

  },
  onUnload: function () {

  },
})