// pages/my/account.js
let { Tool, API, Event, Storage} = global;
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
      API.exitLogin({}).then((res) => {
        Tool.showSuccessToast('成功退出');
        app.globalData.flag = true;
        Storage.getToken(null)
        Storage.setUserAccountInfo(null)
        Event.emit('didLogin');
        Event.emit('refreshMemberInfoNotice');
        this.cancel()
        Tool.switchTab("/pages/index/index")
      }).catch((res) => {
        console.log(res)
      });
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
