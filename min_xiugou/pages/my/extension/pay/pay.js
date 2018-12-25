let { Tool, Storage, Event } = global
Page({
  data: {
    select:true,
    isShow:false,
    result:false,
    hasStock:true,
  },
  onLoad: function (options) {
    this.setData({
      num: options.num,
      price: options.price,
      total: options.total,
      id: options.id,
      hasStock: options.hasStock=='true'?  true:false
    })
    Tool.isIPhoneX(this)
  },
  selectIcon(){
    this.setData({
      select: !this.data.select
    })
  },
  showResult(bool){
    this.setData({
      result: bool,
      isShow:true,
    })
  },
  pay(){
    if (this.data.hasStock){
      Tool.navigateTo(`/pages/order-confirm/pay/pay?door=2&packageId=${this.data.id}&packagePrice=${this.data.total}&door=2`)
    } else{
      Tool.navigationPop()
    }
  },
  onHide: function () {

  },
  onUnload: function () {

  },
})