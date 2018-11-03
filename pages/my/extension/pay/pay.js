let { Tool, RequestFactory, Storage, Event, Operation } = global
Page({
  data: {
    select:true,
    isShow:false,
    tipsContent:['系统将会在明天0点进行站内推广','每成功获取一个下级讲收到站内消息推送'],
    tipsBtn:['我的推广','站内分享推广'],
    result:false,
  },
  onLoad: function (options) {
    this.setData({
      num: options.num,
      price: options.price,
      total: options.total,
    })
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
  payResultClicked(e){
    let index = e.currentTarget.dataset.index
  },
  payClicked(){

  },
  promotionPromoterPay(){
    let params = {
      packageId: this.data.code,
      reqName: '支付红包推广费用',
      url: Operation.promotionPromoterPay,
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  wxPay(payType, outTradeNo, payList) { //微信支付
    payList = JSON.parse(payList)
    let that = this
    wx.requestPayment({
      'timeStamp': payList.timeStamp,
      'nonceStr': payList.nonceStr,
      'package': payList.package,
      'signType': 'MD5',
      'paySign': payList.paySign,
      'success': function (res) {
        this.setData({
          isShow:true,
          result:true
        })
      },
      'fail': function (res) {
        Tool.showAlert("支付失败")
      }
    })
  },
  onHide: function () {

  },
  onUnload: function () {

  },
})