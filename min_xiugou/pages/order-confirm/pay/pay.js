let { Tool, RequestFactory, Event, Storage, Operation } = global
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
          availableBalance: Tool.formatNum(datas.availableBalance || 0)
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
          isContinuePay: options.isContinuePay || false
        })
        this.formatDatas()
        // 如果有值 去继续支付
        if (this.data.payList.outTradeNo) {
          this.continueToPay()
        }
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
    payBtnCliked(){
      let payWay = this.isSelectPayWay()
      if (!payWay.isSelect){
        Tool.showAlert('请选择支付方式')
        return
      } 
      let payType = payWay.index == 0 ? 16 : 2
      if(this.data.door==1){
        this.payOrderType(payType)
      } else if (this.data.door==2){
        this.payPackage()
      }
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
    wxPayPackage(payList) { //微信支付
      // payList = JSON.parse(payList)
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
    payOrderType(payType){
      if (this.data.payList.outTradeNo) {
        this.continuePay(payType)
      } else {
        this.payOrder(payType)
      }
    },
    payOrder(payType){
      if (this.data.payList.totalAmounts==0){
        payType=1
      }
      let params ={
        amounts: this.data.payList.totalAmounts,
        balance: 0, // 先按照0 写死
        orderNum: this.data.payList.orderNum,
        openid: Storage.getWxOpenid(),
        tokenCoin: 0, // 先按照0 写死
        "type": payType,
        url: Operation.prePay,
        reqName: '预支付',
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        // this.test(payType, req)
        // this.wxPay(payType, req.responseObject.data.outTradeNo)
        if (payType==1){
          this.paySuccess(payType, req.responseObject.data.outTradeNo)
          // this.showResult(true)
        } else {
          let datas = req.responseObject.data
          this.wxPay(payType, datas.outTradeNo, datas.prePayStr)
        }
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    paySuccess(payway,outTradeNo){
      let params ={
        amounts: this.data.payList.totalAmounts,
        outTradeNo:outTradeNo,
        payTime: Tool.timeStringForDate(new Date(), "YYYY-MM-DD HH:mm:ss"),
        tradeNo:'',
        'type':payway,
        url: Operation.paySuccess,
        reqName: '第三方支付回调接口',
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        // this.paySuccess(payType, req.responseObject.data.outTradeNo)
        this.showResult(true)
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    isSelectPayWay(){
      let payway = { isSelect: false, index: null }
      this.data.payWayActive.forEach((item,index)=>{
        if(item){
          payway =  {isSelect:true,index:index}
        } 
      })
      return payway
    },
    showResult(bool){
      this.setData({
        tipsBtn: this.data.tipsBtnArr[this.data.door],
        tipsContent: this.data.tipsContentArr[this.data.door],
        isShow:true,
        result:bool,
      })
    },
    payResultClicked(e){
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
    continuePay(payType) {
      if (this.data.payList.totalAmounts == 0) {
        payType = 1
      }
      let params = {
        outTradeNo: this.data.payList.outTradeNo,
        "type": payType,
        openid: Storage.getWxOpenid(),
        url: Operation.continuePay,
        reqName: '继续支付',
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        // this.test(payType, req)
        // this.wxPay(payType, req.responseObject.data.outTradeNo)
        if (payType == 1) {
          this.paySuccess(payType, req.responseObject.data.outTradeNo)
          //this.showResult(true)
        } else {
          let datas = req.responseObject.data
          this.wxPay(payType, datas.outTradeNo, datas.prePayStr)
        }
        
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    continueToPay() {
      let params = {
        outTradeNo: this.data.payList.outTradeNo,
        url: Operation.continueToPay,
        reqName: '继续去支付',
        requestMethod: 'GET',
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let datas = req.responseObject.data
        let payList = this.data.payList
        payList.totalAmounts = datas.amounts
        this.setData({
          payType: datas.type,
          payList:payList
        })
        this.formatDatas()
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    againToPrePay(){
      let params = {
        orderNum: this.data.payList.orderNum, 
        url: Operation.againToPrePay,
        reqName: '继续去预支付',
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let datas = req.responseObject.data
        let payList = this.data.payList
        payList.totalAmounts= datas.needPay
        payList.scorePrice = datas.scorePrice
        this.setData( {
          payList: payList
        })
        this.formatDatas()
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    wxPay(payType, outTradeNo, payList){ //微信支付
      payList = JSON.parse(payList)
      let that = this
      wx.requestPayment({
        'timeStamp': payList.timeStamp,
        'nonceStr': payList.nonceStr,
        'package': payList.package,
        'signType': 'MD5',
        'paySign': payList.paySign,
        'success': function (res) {
          // that.orderQuery(outTradeNo)
          that.showResult(true)
        },
        'fail': function (res) {
          that.showResult(false)
        }
      })
    },
    formatDatas(){
      this.setData({
        totalAmounts: this.data.payList.totalAmounts || 0,
      })
    },
    orderQuery(outTradeNo){
      let params = {
        outTradeNo: outTradeNo,
        url: Operation.orderQuery,
        reqName: '主动查询订单状态',
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        this.showResult(true)
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    test(payType,req){
      let okCb = () => {
        this.paySuccess(payType, req.responseObject.data.outTradeNo)
      }
      let errCb = () => {
        this.showResult(false)
      }
      Tool.showComfirm('模拟第三方支付，点击确认为支付', okCb, errCb)
    }
})