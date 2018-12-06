// pages/my/account.js
let { Tool, RequestFactory, Storage, Event, Operation } = global;
const app = getApp()
Page({
    data: {
      isNew:false,
      noticeNum:'',
      messageNum:'',
      storeMessageNum:''
    },
    onLoad: function (options) {
      this.queryPushNum()
      Event.on('queryPushNum', this.queryPushNum, this)
    },
    onShow: function () {
    },
    queryPushNum(){
      let callBack = (datas) => {
        this.setData({
          datas: datas
        })
      }
      app.queryPushMsg(callBack)
    },
    didLogin(){
      if (!Tool.didLogin(this)){
        Tool.navigateTo('/pages/login-wx/login-wx');
        return false
      }
      return true
    },
    //跳到通知页面
    notice() {
      if (!this.didLogin()) return;
      Tool.navigateTo('notice/notice')
    },
    //跳到消息页面
    information() {
      if (!this.didLogin()) return;
      Tool.navigateTo('information/information')
    },
    //跳到拼店消息页面
    groupInformation() {
      if (!this.didLogin()) return;
      Tool.navigateTo('groupInformation/groupInformation')
    },
    //关闭弹出框
    dismissCancel(){
      this.setData({
          isNew:false
      })
    },
    onUnload: function () {
      Event.off('queryPushNum', this.queryPushNum)
    },
})