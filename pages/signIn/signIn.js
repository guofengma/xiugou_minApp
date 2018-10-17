let { Tool, RequestFactory, Operation, Event, Storage} = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animate0:false,
    animate1:false,
    canClick:true,
    todaySgin:false,
    needXD:100,
  },
  onLoad: function (options) {
    this.querySignList()
  },
  getLevel() {
    let params = {
      isShowLoading: false,
      reqName: '获取用户等级',
      requestMethod: 'GET',
      url: Operation.getLevel
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      Storage.setUserAccountInfo(req.responseObject.data)
      this.setData({
        userInfos: req.responseObject.data
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
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
      this.querySignList()
      Event.emit('getLevel')
      this.setData({
        animate0: true,
        canClick:false
      })
      let that = this
      setTimeout(function () {
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

  onUnload: function () {

  },
  onShareAppMessage: function () {

  }
})