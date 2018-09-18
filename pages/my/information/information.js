// pages/my/account.js
let { Tool, RequestFactory, Storage, Event, Operation } = global;
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
      let params = {
        reqName: '消息未读详情',
        url: Operation.queryPushNum
      }
      let r = RequestFactory.wxRequest(params);
        // let r = RequestFactory.queryPushNum(params);
      r.successBlock = (req) => {
        let detail=req.responseObject.data;
        this.setData({
        noticeNum:detail.noticeNum,
        messageNum:detail.messageNum,
        storeMessageNum:detail.storeMessageNum,
        })
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    didLogin(){
      if (!Tool.didLogin(this)){
        Tool.navigateTo('/pages/login/login-wx/login-wx');
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