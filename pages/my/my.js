// pages/my/account.js
let { Tool, RequestFactory, Storage, Event, Operation } = global
Page({
    data: {
      userInfos:'',
      tabClicked:1,
      num:0,
      imgUrl:'https://dnlcrm.oss-cn-beijing.aliyuncs.com/xcx/'
    },
    onLoad: function (options) {
      this.refreshMemberInfoNotice()
      this.didLogin()
      Event.on('refreshMemberInfoNotice', this.refreshMemberInfoNotice, this);
      Event.on('didLogin', this.didLogin, this);
    },
    onShow: function () {
      this.setData({
        num:1
      })
      if (this.data.didLogin){
        this.getLevel()
      }
      if (this.data.tabClicked!=1) return
      if (!this.data.didLogin) {
        Tool.navigateTo('/pages/login-wx/login-wx')
      }
      this.setData({
        tabClicked: 2
      })
      
    },
    onHide: function() {

    },
    getLevel(){
      if (!this.data.didLogin) return
      let params = {
        isShowLoading:false,
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
    refreshMemberInfoNotice(){
      Tool.getUserInfos(this)
    },
    onTabItemTap(item) {
      let tabClicked = this.data.tabClicked
      // 阻止多次点击跳转
      if (tabClicked>1 && this.data.num==1){
        if (!this.data.didLogin) {
          Tool.navigateTo('/pages/login-wx/login-wx')
        }
      } 
      this.setData({
        num: 2
      })
    },
    didLogin(isGoLogin){
      if (!Tool.didLogin(this)){
        if (isGoLogin){
          Tool.navigateTo('/pages/login-wx/login-wx')
        }   
        return false
      }
      return true
    },
    //跳到我的订单页面
    allOrder(e) {
      if (!this.didLogin(true)) return;
      let index = e.currentTarget.dataset.index;
      if(index==4){
        Tool.navigateTo('/pages/after-sale/my-after-sale/my-after-sale');
        return
      }
      Tool.navigateTo('my-order/my-order?index=' + index)
    },
    //跳到我的账户页面
    myAccount() {
      if (!this.didLogin(true)) return
      Tool.navigateTo('my-account/my-account')
    },
    //跳到我的优惠券页面
    coupon() {
      if (!this.didLogin(true)) return
      Tool.navigateTo('coupon/my-coupon/my-coupon')
    },
    myCollection() {
      if (!this.didLogin(true)) return
      Tool.navigateTo('/pages/my/my-collection/my-collection')
    },
    //跳到我的信息页面
    personalData() {
      // if (!this.didLogin(true)) return
      Tool.navigateTo('my-personalData/my-personalData')
    },
    //跳到设置页面
    setting() {
      if (!this.didLogin(true)) return
      Tool.navigateTo('setting/setting')
    },
    //跳到帮助与客服页面
    helpCustomer() {
      if (!this.didLogin(true)) return
      Tool.navigateTo('help-customer/help-customer')
    },
    //我的消息
    information() {
      if (!this.didLogin(true)) return
      Tool.navigateTo('information/information')
    },
    //我的通讯录
    addressList() {
      if (!this.didLogin(true)) return
      Tool.navigateTo('addressList/addressList')
    },
    //邀请
    invite() {
      if (!this.didLogin(true)) return
      Tool.navigateTo('invite/invite')
    },
    onUnload: function () {
      Event.off('refreshMemberInfoNotice', this.refreshMemberInfoNotice);
      Event.off('didLogin', this.didLogin);
    },
})