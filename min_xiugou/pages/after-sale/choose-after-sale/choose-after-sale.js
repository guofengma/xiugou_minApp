let { Tool, Storage} = global

Page({
  data: {
    ysf: { title: '售后服务' },
    list:{},
    afterSaleTypeArr: [4, 16, 8],// 不支持退款 不支持退货 不支持换货
    afterSaleType: [false, false, false], // 支持退款 支持换货 支持退货
  },
  onLoad: function (options) {
    this.setData({
      list: Storage.getInnerOrderList() || ''
    })
    // this.initData()
  },
  initData(){
    let afterSaleType = []
    this.data.afterSaleTypeArr.forEach((item,index)=>{
      if(this.data.list.afterSaleType.includes(item)){
        afterSaleType.push(true)
      }else{
        afterSaleType.push(false)
      }
    })
    this.setData({
      afterSaleType: afterSaleType
    })
  },
  goPage(e){
    let index = parseInt(e.currentTarget.dataset.index) 
    let page = ''
    Tool.redirectTo('/pages/after-sale/apply-sale-after/apply-sale-after?refundType=' + index + '&orderProductNo=' + this.data.list.orderProductNo)
  }
})