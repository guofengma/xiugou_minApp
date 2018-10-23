// pages/my/account.js
let { Tool, RequestFactory, Event, Storage, Operation } = global;
Page({
    data: {
        unBinded:false,
        userInfos:''
    },
    onLoad: function (options) {
      this.setData({
        wxUserInfo:Storage.wxUserInfo() || '',
      })
      this.refreshMemberInfoNotice()
      Event.on('refreshMemberInfoNotice', this.refreshMemberInfoNotice, this);
    },
    refreshMemberInfoNotice() {
      Tool.getUserInfos(this)
    },
    onUnload: function () {
      Event.off('refreshMemberInfoNotice', this.refreshMemberInfoNotice);
    },
    //修改手机
    phone(){
      Tool.navigateTo('/pages/my/phone/step1/step1')
    },
    //修改密码
    password(){
        Tool.navigateTo('/pages/my/password/password')
    },
    //微信解绑
    account(){
        this.setData({
            unBinded:true
        })
    },
    //确定
    sure(){
      let params = {
        reqName: '解绑微信号',
        url: Operation.updateDealerOpenid
      };
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let infos = Storage.getUserAccountInfo()
        infos.openid = null
        Storage.setUserAccountInfo(infos)
        Event.emit('refreshMemberInfoNotice');//发出通知
      }
      r.completeBlock = (req) => {
        this.setData({
          unBinded: false
        })
      }
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    //取消
    cancel(){
        this.setData({
            unBinded:false
        })
    }
})