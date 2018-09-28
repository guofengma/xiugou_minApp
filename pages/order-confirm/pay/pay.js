let { Tool, RequestFactory, Event, Storage, Operation } = global

Page({
    data: {
      ysf: { title: '支付方式' },
      payList:'',
      isShow:false, // 显示支付结果
      result:1, //支付结果
      payWayActive:[false,true,false],
      useAmount:[false,false],
      useBalance:0,
      isContinuePay:false, //是否是继续支付
      outTrandNo:'',
      payType:'',//上次支付时选择的支付方式
    },
    onLoad: function (options) {
      Tool.isIPhoneX(this) 
      // 提交订单时返回的数据
      let payList = Storage.getPayOrderList() || {}
      this.setData({
        payList: payList,
        isContinuePay: options.isContinuePay || false
      })
      // 如果有值 去继续支付
      if (this.data.payList.outTradeNo){
        this.continueToPay()
      } else if (!this.data.payList.outTradeNo && options.isContinuePay ){
        this.againToPrePay()
      }
    },
    formatNum(num){ // 保留两位小数不四舍五入
      num = num<0? 0:num
      let index = String(num).lastIndexOf('.')
      if(index != -1){
        let num2 = num.toFixed(3);
        num2 = num2.substring(0, num2.lastIndexOf('.') + 3) 
        return num2
      }
      return num
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
      if (this.data.payList.outTradeNo){
        this.continuePay(payType)
      } else{
        this.payOrder(payType)
      }
      
    },
    payOrder(payType){
      if (this.data.payList.showTotalAmounts==0){
        payType=1
      }
      let params ={
        amounts: this.data.payList.showTotalAmounts,
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
        this.test(payType, req)
        // this.wxPay(payType, req.responseObject.data.outTradeNo)
        // if (payType==1){
        //   this.showResult(true)
        // } else {
        //   let datas = req.responseObject.data
        //   this.wxPay(payType, datas.outTradeNo, datas.prePayStr)
        // }
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
      // let r = RequestFactory.paySuccess(params);
      r.successBlock = (req) => {
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
        isShow:true,
        result:bool,
      })
    },
    goPage(e){
      let index = e.currentTarget.dataset.index
      if(index == 1){
        Tool.switchTab('/pages/index/index')
      } else {
        Tool.redirectTo('/pages/my/my-order/my-order')
      }
      
    },
    continuePay(payType) {
      if (this.data.payList.showTotalAmounts == 0) {
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

      // let r = RequestFactory.continuePay(params);
      r.successBlock = (req) => {
        // this.test(payType, req)
        // this.wxPay(payType, req.responseObject.data.outTradeNo)
        if (payType == 1) {
          this.showResult(true)
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
      }
      let r = RequestFactory.wxRequest(params);
      // let r = RequestFactory.continueToPay(params);
      r.successBlock = (req) => {
        let datas = req.responseObject.data
        let payList = this.data.payList
        payList.showTotalAmounts = datas.amounts
        this.setData({
          payType: datas.type,
          payList:payList
        })
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
      // let r = RequestFactory.againToPrePay(params);
      r.successBlock = (req) => {
        let datas = req.responseObject.data
        let payList = this.data.payList
        payList.showTotalAmounts = datas.needPay
        payList.scorePrice = datas.scorePrice
        this.setData( {
          payList: payList
        })
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    wxPay(payType, outTradeNo, payList){ //微信支付
      let that = this
      wx.requestPayment({
        'timeStamp': payList.timeStamp,
        'nonceStr': payList.nonceStr,
        'package': payList.package,
        'signType': 'MD5',
        'paySign': payList.paySign,
        'success': function (res) {
          that.orderQuery(outTradeNo)
          // that.showResult(true)
        },
        'fail': function (res) {
          that.showResult(false)
        }
      })
      // let params = {
      //   productsDescription: outTradeNo,
      //   openid: Storage.getWxOpenid(),
      //   orderNum: outTradeNo,
      //   totalFee: this.data.payList.showTotalAmounts
      // }
      // let r = RequestFactory.wxPay(params);
      // r.successBlock = (req) => {
      //   let that = this
      //   let payList = req.responseObject.data
       
      // };
      // Tool.showErrMsg(r)
      // r.addToQueue();
    },
    orderQuery(outTradeNo){
      let params = {
        outTradeNo: outTradeNo,
        url: Operation.orderQuery,
        reqName: '主动查询订单状态',
      }
      let r = RequestFactory.wxRequest(params);
      // let r = RequestFactory.orderQuery(params);
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