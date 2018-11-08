let { Tool, RequestFactory, Storage, Event, Operation } = global
Page({
  data: {
    select:true,
    isShow:false,
    tipsContent:['系统将会在明天0点进行站内推广','每成功获取一个下级讲收到站内消息推送'],
    tipsBtn:[
      { name: '我的推广',btnType:""},
      // { name: '站外分享推广', btnType: ""}
    ],
    page:[
      '',
      '/pages/my/extension/extension'
    ],
    result:false,
  },
  onLoad: function (options) {
    this.setData({
      num: options.num,
      price: options.price,
      total: options.total,
      id: options.id
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
    if(index==1){
      Tool.navigateTo(this.data.page[index])
    } else if(index==3){
      //Tool.navigationPop()
      this.setData({
        isShow:false
      })
    }
    
  },
  payClicked(){
    let payType = this.data.total == 0 ? 1 : 2
    let params = {
      packageId: this.data.id,
      reqName: '支付红包推广费用',
      requestMethod: 'GET',
      // openid: Storage.getWxOpenid(),
      url: Operation.promotionPromoterPay,
      "type": payType,
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      if (payType == 1) {
        this.setData({
          isShow: true,
          result: true
        })
      } else {
        let datas = req.responseObject.data
        this.wxPay(datas)
      }
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  wxPay(payList) { //微信支付
    // payList = JSON.parse(payList)
    let that = this
    wx.requestPayment({
      'timeStamp': payList.timeStamp,
      'nonceStr': payList.nonceStr,
      'package': payList.package,
      'signType': 'MD5',
      'paySign': payList.paySign,
      'success': function (res) {
        that.setData({
          isShow:true,
          result:true
        })
      },
      'fail': function (res) {
        that.setData({
          isShow: true,
          result: false,
        })
      }
    })
  },
  onHide: function () {

  },
  onUnload: function () {

  },
})