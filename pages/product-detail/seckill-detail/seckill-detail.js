let { Tool, RequestFactory, Storage, Event, Operation } = global

import WxParse from '../../../libs/wxParse/wxParse.js';
import ProductFactorys from '../temp/product.js'

Page({
  data: {
    door:1,
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
      typeDesc: '秒杀价'
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
      productId: options.productId ||1,
      prodCode: options.code
    })
    this.didLogin()
    this.getTopicActivityData(this.data.prodCode);    
    Tool.isIPhoneX(this)
    Event.on('didLogin', this.didLogin, this);
    this.ProductFactory = new ProductFactorys(this)
  },
  onShow: function () {
    if (!this.data.screenShow) return;
    this.onLoad({ code: this.data.prodCode })
  },
  onHide() {
    this.toggleScreenShowStatus();
  },
  toggleScreenShowStatus() {
    this.setData({
      screenShow: !this.data.screenShow
    })
  },
  //获取专题活动数据  JJP201810100001
  getTopicActivityData(code) {
    let params = {
      code: code,
      reqName: '获取秒杀详情',
      url: Operation.getActivitySeckillById,
      requestMethod: 'GET'
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let data = req.responseObject.data || {};
      let productSpec = this.refactorProductsData(data.productSpecValue);
      let jumpTimer = null; 
      if (data.status >= 4 && data.type == 1) {//type是否为隐藏类目，非隐藏要跳转  1：显示 2：隐藏
        jumpTimer = setTimeout(() => {
          //跳转到普通详情页
          Tool.navigateTo('/pages/product-detail/product-detail?productId=' + data.productId)
        }, 5000)
      }
      let specIds= []
      data.productSpecValue.forEach((item)=>{
        specIds.push(item.id)
      })
      specIds = Tool.bubbleSort(specIds)
      this.setData({
        proNavData: data,
        specIds: specIds,
        jumpCommonProductTimer: jumpTimer,
        productId: data.productId
      })
      let callBack = () => {
        this.setData({
          productSpec: productSpec, // 规格描述
        })
      }
      this.ProductFactory.requestFindProductByIdApp(callBack)
      //this.requestFindProductByIdApp(data.productId, productSpec)
      this.selectComponent('#promotionFootbar').checkPromotionFootbarInfo(this.data.promotionFootbar, this.data.proNavData);

      data.id && this.selectComponent('#promotion').init();
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
        specName: item.specName,
        specValue: item.specValue,
      })
    })
    return newData;
  },
  setTip: function () {
    let userInfo = Storage.getUserAccountInfo();
    console.log(userInfo);
    // return;
    let prop = this.data.proNavData;
    let params = {
      reqName: '订阅提醒',
      url: Operation.addActivitySubscribe,
      activityId: prop.id,
      activityType: 1, //activityType  '活动类型 1.秒杀 2.降价拍 3.优惠套餐 4.助力免费领 5.支付有礼 6满减送 7刮刮乐',
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
    if (this.data.promotionFootbar.disabled) return;
    if (this.data.proNavData.status === 1) {
      this.setTip();
    } else {
      this.btnClicked(e);
    }
  },
  didLogin() {
    Tool.didLogin(this)
  },
  makeSureOrder() {
    // 立即购买
    if (!this.data.didLogin) {
      Tool.navigateTo('/pages/login-wx/login-wx?isBack=' + true)
      return
    }
    let params = {
      code: this.data.prodCode,
      num: this.data.productBuyCount,
      orderType: 1,
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
  goTop(e) {
    this.ProductFactory.goTop(e)
  },
  scroll(e, res) {
    this.ProductFactory.scroll(e)
  },
  hiddenTips() {
    this.ProductFactory.hiddenTips()
  },
  onShareAppMessage: function (res) {
    return this.ProductFactory.onShareAppMessage(1, this.data.prodCode)
  },
  onUnload: function () {
    Event.off('didLogin', this.didLogin);
    this.selectComponent('#promotion').clearInterval();
    clearTimeout(this.data.jumpCommonProductTimer);
  },
  //倒计时结束 执行下一步操作  刷新当前页面或跳转什么的
  timeout() {
    console.log('countdown complete');
    this.getTopicActivityData(this.data.prodCode);
  },
})