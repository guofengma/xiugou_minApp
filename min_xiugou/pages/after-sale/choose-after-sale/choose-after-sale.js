let { Tool, Storage} = global

Page({
  data: {
    list:{},
    afterSaleTypeArr: [4, 16, 8],// 不支持退款 不支持退货 不支持换货
    afterSaleType: [false, false, false], // 支持退款 支持换货 支持退货
  },
  onLoad: function (options) {
    this.setData({
      list: Storage.getInnerOrderList() || '',
      orderSubType:options.orderSubType || '',
    })
    this.initData()
  },
  initData(){
    // 升级礼包和经验值专区的商品只能换货，其余发货商品都有换货、退款和退货
    let afterSaleType = []
    if([3,5].includes(this.data.orderSubType)){
      afterSaleType = [false,false,true]
    } else {
      afterSaleType = [true,true,true]
    }
    // let afterSaleType = []
    // this.data.afterSaleTypeArr.forEach((item,index)=>{
    //   if(this.data.list.afterSaleType.includes(item)){
    //     afterSaleType.push(true)
    //   }else{
    //     afterSaleType.push(false)
    //   }
    // })
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