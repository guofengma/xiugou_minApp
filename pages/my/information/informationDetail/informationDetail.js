// pages/my/account.js
let { Tool, RequestFactory, Storage, Event, Operation  } = global;
Page({
    data: {
      refuseDetail:'',
      detail:{}
    },
    onLoad: function (options) {
      this.setData({
        list: Storage.getPayInfoList() || ''
      })
    },
    onShow: function () {

    },
    //订单疑问
    order(){
        Tool.navigateTo('../../help-customer/help-customer')
    },
    //投诉
    feedback(){
        Tool.navigateTo('../../help-customer/questionFeedback/questionFeedback')
    },

    onUnload: function () {

    },
})