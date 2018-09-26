// pages/my/account.js
let { Tool, RequestFactory, Storage, Event, Operation, Config } = global
Page({
    data: {
      userInfos:'',
      tabClicked:1,
      num:0,
      imgUrl:'https://dnlcrm.oss-cn-beijing.aliyuncs.com/xcx/',
      pageArr:[
        "/pages/my/setting/setting", // 设置
        "/pages/my/information/information",//我的消息
        "/pages/my/my-personalData/my-personalData",//个人信息
        "/pages/my/my-account/cash/cash",// 现金账户
        "/pages/my/my-account/integral/integral",// 秀豆账户
        "/pages/my/my-account/deposit/deposit",// 待提现账户
        "/pages/my/my-order/my-order",//我的订单
        "/pages/after-sale/my-after-sale/my-after-sale", //我的售后
        "/pages/my/invite/invite",//邀请好友
        "",// 活动日历
        '/pages/my/coupon/my-coupon/my-coupon',//优惠卷
        '/pages/my/my-promotion/my-promotion', //我的数据
        "",//收藏店铺
        '/pages/my/help-customer/help-customer',//帮助
        '/pages/address/select-express-address/select-express-address',//地址
        '',//足迹
      ]
    },
    onLoad: function (options) {
      this.setData({
        imgUrl: Config.imgBaseUrl
      })
      this.didLogin()
      this.refreshMemberInfoNotice()
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
    refreshMemberInfoNotice() {
      Tool.getUserInfos(this)
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
    onUnload: function () {
      Event.off('refreshMemberInfoNotice', this.refreshMemberInfoNotice);
      Event.off('didLogin', this.didLogin);
    },
})