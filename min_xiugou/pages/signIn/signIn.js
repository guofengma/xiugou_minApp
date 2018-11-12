let { Tool, RequestFactory, Operation, Event, Storage} = global;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animate0:false,
    animate1:false,
    canClick:true,
    todaySgin:false,
    needXD:1,
  },
  onLoad: function (options) {
    this.querySignList()
    this.getTokenCionExchange()
  },
  getTokenCionExchange(){
    let params = {
      isShowLoading: false,
      reqName: '获取用户等级',
      requestMethod: 'GET',
      url: Operation.getTokenCionExchange
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      this.setData({
        needXD: req.responseObject.data
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  getLevel() {
    let callBack = (datas)=>{
      this.setData({
        userInfos: datas
      })
    }
    app.getLevel(callBack)
  },
  querySignList(){
    let params = {
      url: Operation.querySignList,
      requestMethod: 'GET',
      isShowLoading: false,
    };
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      this.getLevel()
      let datas = req.responseObject.data || [];
      let totalDay = datas[3].continuous ? datas[3].continuous : (datas[2].continuous || 0)
      this.setData({
        lists:datas,
        totalDay: totalDay,
        todaySgin: datas[3].reward? true:false
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  exchangeTokenCoin(){
    if (this.data.needXD > this.data.userInfos.userScore){
      Tool.showAlert("秀豆不足")
      return
    }
    let params = {
      url: Operation.exchangeTokenCoin,
    };
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      Tool.showSuccessToast("兑换成功")
      this.getLevel()
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  tokenCoinSign() {
    if(!this.data.canClick) return
    let params = {
      url: Operation.tokenCoinSign,
    };
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      // Event.emit('getLevel')
      this.setData({
        animate0: true,
        canClick:false
      })
      let that = this
      setTimeout(function () {
        that.querySignList()
        Tool.showSuccessToast("获得秀豆+" + (that.data.lists[3].canReward || that.data.lists[3].reward))
      }, 1200)
      setTimeout(function () {
        that.setData({
          animate1: true
        })
      }, 600)
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  ruleClicked(){
    // Tool.navigateTo('/pages/signIn/rule/rule')
    Tool.navigateTo('/pages/web-view/web-view?webType=4')
  },
  goPage(){
    Tool.navigateTo('/pages/my/coupon/my-coupon/my-coupon')
  },
  onUnload: function () {

  },
  onShareAppMessage: function () {

  }
})