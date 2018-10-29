let { Tool, RequestFactory, Storage} = global

Page({
  data: {
    ysf: { title: '售后服务' },
    list:{},
    afterSaleTypeArr: [4, 8, 16],// 支持退款 支持换货 支持退货 
  },
  onLoad: function (options) {
    this.setData({
      list: Storage.getInnerOrderList() || ''
    })
  },
  afterSaleType(){
    Tool.bitOperation(this.data.afterSaleTypeArr, item.restrictions)
  },
  goPage(e){
    let index = parseInt(e.currentTarget.dataset.index) 
    let page = ''
    Tool.redirectTo('/pages/after-sale/apply-sale-after/apply-sale-after?refundType='+index)
  }
})