let { Tool, RequestFactory, Storage, Event, Operation } = global

import WxParse from '../../../libs/wxParse/wxParse.js';
import ProductFactorys from '../temp/product.js'
Page({
  data: {
    door:2,
    didLogin: false,
    imgUrls: [],
    msgShow: false,
    selectType: {}, // 是否选择了商品类型
    floorstatus: false, // 是否显示置顶的按钮
    productId: '', // 商品id
    productInfo: '', // 商品信息
    productTypeList: [],
    productBuyCount: 1, //商品购买数量
    priceList: [],
    proNavData: {},
    promotionDesc: {
      commingDesc: '',
      countdownDesc: '',
      typeDesc: '起拍价'
    },
    promotionFootbar: {
      className: 'footbar-primary',
      text: '设置提醒',
      textSmall: '',
      disabled: false,
    },
    showRegular: false,
    jumpCommonProductTimer: null, // 定时跳转普通商品倒计时
    screenShow: false, // 用于判断是否锁屏
  },
  onLoad: function (options) {
    this.setData({
      prodCode: options.code,
    })
    this.ProductFactory = new ProductFactorys(this)
    this.didLogin()
    this.getTopicActivityData(this.data.prodCode);
    Tool.isIPhoneX(this)
    Event.on('didLogin', this.didLogin, this);
    
  },
  onShow: function () {
    if (!this.data.screenShow) return;
    this.onLoad({ code: this.data.prodCode, inviteId: this.data.inviteId})
    // this.selectComponent('#promotion') && this.selectComponent('#promotion').clearInterval();
    // clearTimeout(this.data.jumpCommonProductTimer);
    // this.toggleScreenShowStatus();
    // this.getTopicActivityData(this.data.prodCode); 
  },
  onHide() {
    this.toggleScreenShowStatus();
  },
  toggleScreenShowStatus(){
    this.setData({
      screenShow: !this.data.screenShow
    })
  },
  //获取专题活动数据  JJP201810100001
  getTopicActivityData(code) {
    let params = {
      code: code,
      reqName: '获取降价拍详情',
      url: Operation.getActivityDepreciateById,
      requestMethod: 'GET'
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let data = req.responseObject.data || {}; 
      let jumpTimer = null; 
      if (data.status >= 4 && data.type == 1) {//type是否为隐藏类目，非隐藏要跳转  1：显示 2：隐藏
        jumpTimer = setTimeout(() => {
          //跳转到普通详情页
          Tool.navigateTo('/pages/product-detail/product-detail?productId=' + data.productId)
        }, 5000)
      }
      let specIds = []
      data.productSpecValue.forEach((item) => {
        specIds.push(item.id)
      })
      specIds = Tool.bubbleSort(specIds)
      let productSpec = this.refactorProductsData(data.productSpecValue);
      this.setData({
        proNavData: data,
        specIds: specIds,
        jumpCommonProductTimer: jumpTimer,
        productId: data.productId
      })
      if (data.productStatus == 0){ // 商品走丢了 删除了
        this.ProductFactory.productDefect()
      }
      let callBack = ()=>{
        this.setData({
          productSpec: productSpec, // 规格描述
        })
        this.selectComponent('#promotionFootbar').checkPromotionFootbarInfo(this.data.promotionFootbar, this.data.proNavData);
        data.id && this.selectComponent('#promotion').init();
      }
      this.ProductFactory.requestFindProductByIdApp(callBack)
      
      
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  // 根据降价拍返回的sku数据生成sku选择组件所需数据
  refactorProductsData(originData = []) {
    let newData = {};
    originData.forEach(function (item) {
      newData[item.specName] = [];
      newData[item.specName].push({
        id: item.id,
        specName :item.specName,
        specValue : item.specValue,
      })
    })
    return newData;
  },
  setTip: function () {
    let userInfo = Storage.getUserAccountInfo();
    // console.log(userInfo);
    // return;
    let prop = this.data.proNavData;
    let params = {
      reqName: '订阅提醒',
      url: Operation.addActivitySubscribe,
      activityId: prop.id,
      activityType: 2, //activityType  '活动类型 1.秒杀 2.降价拍 3.优惠套餐 4.助力免费领 5.支付有礼 6满减送 7刮刮乐',
      type: 1, // 1订阅 0 取消订阅
      userId: userInfo.id
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let title = `已关注本商品,\r\n活动开始前3分钟会有消息通知您`;
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 3000
      })
      this.setData({
        promotionFootbar: {
          className: 'footbar-disabled',
          text: '活动开始前3分钟提醒',
          textSmall: '',
          disabled: true
        },
        "proNavData.notifyFlag": 1
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  //根据不同状态有不同的事情处理
  footbarReady(e) {
    const data = this.data;
    if (data.promotionFootbar.disabled || !data.proNavData.id) return;
    if (data.proNavData.status === 1) {
      this.setTip();
    } else {
      // console.log(this.data.productSpec)
      this.btnClicked(e);
    }
  },
  didLogin() {
    this.ProductFactory.didLogin()
  },
  makeSureOrder() {
    // 立即购买
    if (!this.data.didLogin) {
      Tool.navigateTo('/pages/login-wx/login-wx?isBack=' + true)
      return
    }
    let params = {
      code: this.data.prodCode,
      num:this.data.productBuyCount,
      orderType: 2
    }
    Tool.navigateTo('/pages/order-confirm/order-confirm?params=' + JSON.stringify(params) + '&type=' + this.data.door)
  },
  typeSubClicked(e) {
    this.setData({
      selectType: e.detail
    })
    this.makeSureOrder()
  },
  btnClicked(e) {
    let n = parseInt(e.currentTarget.dataset.key)
    this.selectComponent("#prd-info-type").isVisiableClicked(n)
  },
  goTop() {
    this.ProductFactory.goTop()
  },
  onPageScroll(e) {
    this.ProductFactory.onPageScroll(e)
  },
  hiddenTips() {
    this.ProductFactory.hiddenTips()
  },
  onShareAppMessage: function (res) {
    return this.ProductFactory.onShareAppMessage(2, this.data.prodCode)
  },
  onUnload: function () {
    Event.off('didLogin', this.didLogin);
    this.selectComponent('#promotion').clearInterval();
    clearTimeout(this.data.jumpCommonProductTimer);
  },
  //倒计时结束 执行下一步操作 
  timeout() {
    console.log('countdown complete');
    this.getTopicActivityData(this.data.prodCode);
  },
  toggleShowRegular() {
    this.setData({
      showRegular: !this.data.showRegular
    })
  },
  regularTouch() {
    return;
  }
})