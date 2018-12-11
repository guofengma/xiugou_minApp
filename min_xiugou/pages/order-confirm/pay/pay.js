let { Tool, RequestFactory, Event, Storage, Operation,API } = global
const app = getApp()
Page({
  data: {
    door:1, // 1：订单页面 2：推广红包支付
    ysf: { title: '支付方式' },
    payList:'',
    isShow:false, // 显示支付结果
    tipsContentArr:{
      1: ['已通知商家，会给你尽快发货', '请耐心等待'],
      2: ['系统将会在明天0点进行站内推广', '每成功获取一个下级讲收到站内消息推送'],
    },
    tipsBtnArr: {
      1:[
        { name: '返回首页', btnType: "",index:1},
        { name: '查看订单', btnType: "",index:2 }
      ],
      2:[
        { name: '我的推广', btnType: "",index:3 },
      ]
    },// 按钮
    redirectTo:{
      1:{ page:'/pages/index/index',tab:true},
      2:{ page:'/pages/my/my-order/my-order?query='},
      3:{ page:'/pages/my/extension/extension'}
    }, // 根据按钮的index跳转
    errPage:{
      1:'/pages/my/my-order/my-order?query=1',
      2:'/pages/my/extension/extension-type/extension-type',     
    }, // 失败支付跳转的页面 根据door跳转
    result: false,
    payWayActive:[false,true,false],
    useAmount:[false,false],
    useBalance:0,
    isContinuePay:false, //是否是继续支付
    outTrandNo:'',
    payType:'',//上次支付时选择的支付方式
  },
  onLoad: function (options) {
    this.setData({
      door: options.door || 0
    })
    let callBack = (datas)=>{
      this.setData({
        availableBalance:datas.availableBalance0
      })
    }
    app.getLevel(callBack)
    if (options.door==2){
      this.setData({
        packageId: options.packageId,
        totalAmounts:options.packagePrice,
      })
    }else{
      // 提交订单时返回的数据
      let payList = Storage.getPayOrderList() || {}
      this.setData({
        payList: payList,
        totalAmounts: payList.payAmount || 0,
      })
    }
    Tool.isIPhoneX(this) 
  },
  payWay(e){
    let index = e.currentTarget.dataset.index
    let payWay = [false,false,false]
    payWay[index] = true
    this.setData({
      payWayActive: payWay
    })
  },
  payBtnCliked(){ // 支付按钮点击判断
    let payWay = this.isSelectPayWay()
    if (!payWay.isSelect){
      Tool.showAlert('请选择支付方式')
      return
    } 
    let payType = payWay.index == 0 ? 16 : 2
    if(this.data.door==1){
      this.payOrder(payType)
    } else if (this.data.door==2){
      this.payPackage()
    }
  },
  payOrder(payType) { // 普通支付流程
    let name = this.data.payList.payAmount == 0 ? 'sgpay' : 'wxPay'
    API[name]({
      orderNo: this.data.payList.orderNo
    }).then((res) => {
      let datas = res.data || {}
      if (this.data.payList.payAmount == 0) {
        this.showResult(true)
      } else {
        let payInfo = ''
        this.wxPay(datas.payInfo)
      }
    }).catch((res) => {
      console.log(res)
    })
  },
  wxPay(payList) { //微信支付
    payList = JSON.parse(payList)
    let that = this
    wx.requestPayment({
      'timeStamp': payList.timeStamp,
      'nonceStr': payList.nonceStr,
      'package': payList.packageValue,
      'signType': payList.signType,
      'paySign': payList.paySign,
      'success': function (res) {
        that.showResult(true)
      },
      'fail': function (res) {
        that.showResult(false)
      }
    })
  },
  /******红包支付******* */
  payPackage() {
    let payType = this.data.total == 0 ? 1 : 2
    let params = {
      packageId: this.data.packageId,
      reqName: '支付红包推广费用',
      requestMethod: 'GET',
      url: Operation.promotionPromoterPay,
      "type": payType,
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      if (payType == 1) {
        this.showResult(true)
      } else {
        let datas = req.responseObject.data
        this.wxPayPackage(datas)
      }
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  wxPayPackage(payList) { //微信支付--推广红包
    payList = JSON.parse(payList)
    let that = this
    wx.requestPayment({
      'timeStamp': payList.timeStamp,
      'nonceStr': payList.nonceStr,
      'package': payList.package,
      'signType': 'MD5',
      'paySign': payList.paySign,
      'success': function (res) {
        that.showResult(true)
      },
      'fail': function (res) {
        that.showResult(false)
      }
    })
  },
  showResult(bool){ // 支付结果显示
    this.setData({
      tipsBtn: this.data.tipsBtnArr[this.data.door],
      tipsContent: this.data.tipsContentArr[this.data.door],
      isShow:true,
      result:bool,
    })
  },
  payResultClicked(e){ // 支付结果点击跳转
    let index = e.currentTarget.dataset.index
    let isTab = false
    let page = ''
    if(index!=500){
      isTab = this.data.redirectTo[index].tab
      page = this.data.redirectTo[index].page
    }else{
      page = this.data.errPage[this.data.door]
    }
    if (index == isTab){
      Tool.switchTab(page)
    } else {
      Tool.redirectTo(page)
    }
  },
  isSelectPayWay() { // 选择支付的方式
    let payway = { isSelect: false, index: null }
    this.data.payWayActive.forEach((item, index) => {
      if (item) {
        payway = { isSelect: true, index: index }
      }
    })
    return payway
  },
  // payOrderType(payType) {
  //   if (this.data.payList.outTradeNo) {
  //     this.continuePay(payType)
  //   } else {
  //     this.payOrder(payType)
  //   }
  // },
  // formatDatas() {
  //   this.setData({
  //     totalAmounts: this.data.payList.payAmount || 0,
  //   })
  // },
})