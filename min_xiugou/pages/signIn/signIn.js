let { Tool, Event, Storage,API} = global;
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
    API.getTokenCionExchange({}).then((res) => {
      this.setData({
        needXD: res.data || {}
      })
    }).catch((res) => {
      console.log(res)
    })
  },
  getLevel() {
    let callBack = (datas)=>{
      datas.userScore0 = String(datas.userScore)
      this.setData({
        userInfos: datas
      })
    }
    app.getLevel(callBack)
  },
  querySignList(){
    API.querySignList({}).then((res) => {
      this.getLevel()
      let datas = res.data || [];
      let totalDay = datas[3].continuous ? datas[3].continuous : (datas[2].continuous || 0)
      this.setData({
        lists: datas,
        totalDay: totalDay,
        todaySgin: datas[3].reward ? true : false
      })
    }).catch((res) => {
      console.log(res)
    })
  },
  exchangeTokenCoin(){
    if (this.data.needXD > this.data.userInfos.userScore){
      Tool.showAlert("秀豆不足")
      return
    }
    API.exchangeTokenCoin({}).then((res) => {
      Tool.showSuccessToast("兑换成功")
      this.getLevel()
    }).catch((res) => {
      console.log(res)
    })
  },
  tokenCoinSign() {
    if(!this.data.canClick) return
    API.tokenCoinSign({}).then((res) => {
      this.setData({
        animate0: true,
        canClick: false
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
    }).catch((res) => {
      console.log(res)
    })
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