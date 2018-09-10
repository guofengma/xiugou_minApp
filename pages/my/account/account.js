// pages/my/account.js
let { Tool, RequestFactory, Event, Storage, Operation } = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        unBinded:false,
        userInfos:''
    },
    onLoad: function (options) {
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
      // let r = RequestFactory.updateDealerOpenid();
      r.finishBlock = (req) => {
        this.setData({
          unBinded:false
        })
        Storage.setUserAccountInfo(req.responseObject.data)
        Event.emit('refreshMemberInfoNotice');//发出通知
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