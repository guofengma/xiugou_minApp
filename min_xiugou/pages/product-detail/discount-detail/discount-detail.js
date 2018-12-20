let { Tool, Storage, Event,API } = global

import WxParse from '../../../libs/wxParse/wxParse.js';
import ProductFactorys from '../temp/product.js'
const app = getApp();
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
  //获取专题活动数据 
  getTopicActivityData(code) {
    API.getActivityDepreciateById({
      code: code,
    }).then((res) => {
      let data = res.data || {};
      let jumpTimer = null;
      if (data.status >= 4 && data.type == 1) {//type是否为隐藏类目，非隐藏要跳转  1：显示 2：隐藏
        jumpTimer = setTimeout(() => {
          //跳转到普通详情页
          Tool.navigateTo('/pages/product-detail/product-detail?prodCode=' + data.prodCode)
        }, 5000)
      }
      // 根据降价拍返回的sku数据生成sku选择组件所需数据
      let productSpec = this.ProductFactory.refactorProductsData(data.productSpecValue || []);
      this.setData({
        proNavData: data,
        specIds: data.skuCode,
        jumpCommonProductTimer: jumpTimer,
        productCode: data.prodCode
      })
      if (data.productStatus == 0) { // 商品走丢了 删除了
        this.ProductFactory.productDefect()
      }
      let callBack = () => {
        this.setData({
          productSpec: productSpec, // 规格描述
        })
        this.selectComponent('#promotionFootbar').checkPromotionFootbarInfo(this.data.promotionFootbar, this.data.proNavData);
        data.id && this.selectComponent('#promotion').init();
      }
      this.ProductFactory.requestFindProductByIdApp(callBack)
    }).catch((res) => {

    })
  },
  setTip: function () {
    this.ProductFactory.setTip(2, () => {
      console.log('降价拍通知');
      Event.emit('tip');
      this.getTopicActivityData(this.data.prodCode);
    })
  },
  //根据不同状态有不同的事情处理
  footbarReady(e) {
    const data = this.data;
    if (data.promotionFootbar.disabled || !data.proNavData.id) return;
    if (data.proNavData.status === 1) {
      this.setTip();
    } else {
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
      activityCode: this.data.prodCode,
      num:this.data.productBuyCount,
      orderProductList: [{
        quantity: 1,
        skuCode: this.data.selectType.skuCode,
        productCode: this.data.selectType.prodCode
      }],
      orderSubType: 2
    }
    Storage.setSubmitOrderList(params)
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