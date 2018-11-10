let { Tool, RequestFactory, Storage, Event, Operation } = global
Page({
  data: {
    select:true,
    isShow:false,
    result:false,
  },
  onLoad: function (options) {
    this.setData({
      num: options.num,
      price: options.price,
      total: options.total,
      id: options.id
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
    Tool.navigateTo(`/pages/order-confirm/pay/pay?door=2&packageId=${this.data.id}&packagePrice=${this.data.total}&door=2`)
  },
  onHide: function () {

  },
  onUnload: function () {

  },
})