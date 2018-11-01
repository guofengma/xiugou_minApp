let { Tool, RequestFactory, Storage, Event, Operation } = global
Page({
  data: {
    page: 1,
    pagesize: 10,
  },
  onLoad: function (options) {
    this.queryPromotionReceiveRecordPageList()
  },
  queryPromotionReceiveRecordPageList() {
    let params = {
      page: this.data.page,
      pageSize: this.data.pageSize,
      reqName: '推广红包列表',
      url: Operation.queryPromotionPackagePageList
    };
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {

    }
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  itemClicked(e){
    let num = e.currentTarget.dataset.num
    Tool.navigateTo('/pages/my/extension/pay/pay?num='+num)
  },

  onHide: function () {

  },
  onUnload: function () {

  },
})