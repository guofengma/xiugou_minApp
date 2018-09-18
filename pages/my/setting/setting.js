// pages/my/account.js
let { Tool, RequestFactory, Event, Storage, Operation} = global;
const app=getApp();
Page({
    data: {
      ysf: { title: '设置' },
      isLoginOut:false
    },
    //账号与安全
    account(){
        Tool.navigateTo('/pages/my/account/account')
    },
    //收货地址
    address(){
        Tool.navigateTo('/pages/address/select-express-address/select-express-address')
    },
    //关于我们
    aboutUs(){
        Tool.navigateTo('/pages/my/aboutUs/aboutUs')
    },
    //退出登录
    loginOut(){
      this.setData({
          isLoginOut:true
      })
    },
    //确定
    outSure(){
      let params = {
        reqName: '退出登录',
        requestMethod: 'GET',
        url: Operation.exitLogin
      };
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
          let data=req.responseObject;
          Tool.showSuccessToast(data.data);
          app.globalData.flag=true;
          Storage.setUserCookie(null)
          Storage.setUserAccountInfo(null)
          Event.emit('didLogin');
          this.cancel()
          wx.reLaunch({
            url:'../../index/index'
          })
      };
      r.addToQueue();
    },
    //取消
    cancel(){
      this.setData({
          isLoginOut:false
      })
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
    }
})