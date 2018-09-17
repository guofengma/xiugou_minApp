// pages/my/account.js
let { Tool, RequestFactory, Storage, Event, Operation } = global
Page({
    data: {
      userInfos:'',
      tabClicked:1,
      num:0,
      imgUrl:'https://dnlcrm.oss-cn-beijing.aliyuncs.com/xcx/',
      pageArr:[
        "/pages/my/my-account/cash/cash",// 现金账户
        "/pages/my/my-account/integral/integral",// 秀豆账户
        "/pages/my/my-account/deposit/deposit",// 待提现账户
        "/pages/my/my-order/my-order",//我的订单
        "/pages/after-sale/my-after-sale/my-after-sale", //我的售后
        "/pages/my/invite/invite",//邀请好友
        "",// 活动日历
        '/pages/my/coupon/my-coupon/my-coupon',//优惠卷
        '', //我的数据
        "",//收藏店铺
        '/pages/my/help-customer/help-customer',//帮助
        '/pages/address/select-express-address/select-express-address',//地址
        '',//足迹
      ]
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
    itemClicked(e){
      if (!this.didLogin(true)) return;
      let pageIndex = e.currentTarget.dataset.page
      let query = e.currentTarget.dataset.query
      let page = this.data.pageArr[pageIndex]
      if (page==''){
        Tool.showAlert("小程序暂未开放此功能")
        return
      }
      if (query){
        page = page + "?query=" + query
      }
      Tool.navigateTo(page)
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