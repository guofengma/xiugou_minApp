 let { Tool, Storage, Event,API } = global

import WxParse from '../../libs/wxParse/wxParse.js';
import ProductFactorys from './temp/product.js'
const app = getApp()
Page({
  data: {
    didLogin:false,
    imgUrls: [],
    msgShow:false,

    selectType:{}, // 是否选择了商品类型
    floorstatus:false, // 是否显示置顶的按钮
    productId:'', // 商品id
    productInfo:'', // 商品信息
    productTypeList:[],
    productBuyCount:1, //商品购买数量
    priceList:[],
    size:0,
    userInfos:{},
    openType:'share',
    alertProps:{
      btn:[
        {name:'取消',type:'share'},
        {name:'去登录',type:''}
      ]
    },
    hasMask:false
  },
  onLoad: function (options) {
    this.setData({
      productCode: options.productId || options.prodCode || '',
      door: options.door || '',
      inviteId: options.inviteId || ''
    })
    this.data.preseat = options.preseat || ''
    this.ProductFactory = new ProductFactorys(this)
    this.didLogin()    
    Tool.isIPhoneX(this)
    Event.on('didLogin', this.didLogin, this);
  },
  onShow: function () {
    this.data.isOnshow = true
    if (this.data.distanceTime <= 0) this.initRequest()
  },
  initRequest(){
    let callBack2 = (datas) => {
      if (datas.productStatus!=0){
        this.activityByProductId(this.data.productCode)
        if (this.data.productInfo.productStatus == 3) {
          this.data.distanceTime = Math.ceil((this.data.productInfo.upTime - this.data.productInfo.now) / 1000)
          this.countdown(this)
        }
      }else{
        this.ProductFactory.productDefect()
      }
    }
    this.ProductFactory.requestFindProductByIdApp(callBack2)
  },
  didLogin() {
    this.ProductFactory.didLogin()
    this.initRequest()
    // if(!this.data.didLogin){
    //   this.setData({
    //     openType:''
    //   })
    // }
    // 领取红包的功能 取消
    // if (!this.data.userInfos.upUserid){
    //   let date = Storage.getRedEnvelopesDate() || ''
    //   let now = new Date().toLocaleDateString()
    //   if (now != date){
    //     Storage.setRedEnvelopesDate(now)
    //     this.selectComponent('#redEnvelopes').btnClick();
    //   }
    // }
  },
  activityByProductId(productCode) {
    API.activityByProductId({
      productCode: productCode
    }).then((res) => {
      let datas = res.data
      if (!datas) return
      if (datas.activityType == 1 || datas.activityType == 2) {
        let proNavData = datas.activityType == 1 ? datas.seckill : datas.depreciate
        proNavData.originalPrice = this.data.productInfo.originalPrice
        this.setData({
          proNavData: datas.activityType == 1 ? datas.seckill : datas.depreciate,
          activityType: datas.activityType,
          promotionDesc: {
            commingDesc: '',
            countdownDesc: '',
            typeDesc: datas.activityType == 1 ? '秒杀价' : "起拍价"
          },
        })
        this.selectComponent('#promotion').init();
      }
    }).catch((res) => {

    })
  },
  groupClicked(){
    Tool.navigateTo('/pages/web-view/web-view?webType=3')
  },
  goPage(){
    if(this.data.activityType==1){
      Tool.redirectTo('/pages/product-detail/seckill-detail/seckill-detail?code=' + this.data.proNavData.activityCode)
    } else if (this.data.activityType == 2){
      Tool.redirectTo('/pages/product-detail/discount-detail/discount-detail?code=' + this.data.proNavData.activityCode)
    }
  },
  makeSureOrder(){
    // 立即购买
    if (!this.data.didLogin) {
      Tool.navigateTo('/pages/login-wx/login-wx?isBack=' + true+'&inviteId=' + this.data.inviteCode)
      return
    }
    let params = {
      orderProductList:[{
        quantity: this.data.productBuyCount,
        skuCode: this.data.selectType.skuCode,
        productCode: this.data.selectType.prodCode
      }],
      orderType:1
    }
    Storage.setSubmitOrderList(params)
    Tool.navigateTo('/pages/order-confirm/order-confirm?params=' + JSON.stringify(params)+'&type=99' )
  },
  addToShoppingCart(){
    this.ProductFactory.addToShoppingCart("","",'产品详情页')
  },
  typeSubClicked(e){
    this.setData({
      selectType: e.detail
    })
    if (this.data.selectType.typeClicked ==1){
      this.addToShoppingCart(1)
    } else if (this.data.selectType.typeClicked == 2) {
      this.makeSureOrder()
    }
  },
  btnClicked(e){
    let n = parseInt(e.currentTarget.dataset.key)
    if (this.data.productInfo.canUserBuy || n == 1 && this.data.productInfo.productStatus !=2) {
      this.selectComponent("#prd-info-type").isVisiableClicked(n)
    }
  },
  goTop (e) {
    this.ProductFactory.goTop(e)
  },
  onPageScroll(e) {
    this.ProductFactory.onPageScroll(e)
  },
  counterInputOnChange(e){
    this.setData({
      productBuyCount:e.detail
    })
  },
  onPullDownRefresh: function () {
    this.initRequest()
    wx.stopPullDownRefresh();
  },
  shareBtnClicked() {
    if (!this.data.didLogin) {
      this.setData({
        alertShow: true
      })
    }
    this.ProductFactory.hiddenTips()
    // this.ProductFactory.shareBtnClicked(this.data.openType)
  },
  shareSubClicked(e){
    this.ProductFactory.shareSubClicked(e)
  },
  onShareAppMessage: function (res) {
    return this.ProductFactory.onShareAppMessage(99,this.data.productInfo.prodCode)
  },
  getShoppingCartList() {
    this.ProductFactory.getShoppingCartList()
  },
  hiddenTips(){
    this.ProductFactory.hiddenTips()
  },
  timeout(){
    this.activityByProductId(this.data.productId)
  },
  countdown(that) { // 倒计时
    clearTimeout(that.data.time);
    if (that.data.distanceTime == 0 && that.data.isOnshow) {
      that.initRequest()
      return
    }
    that.data.distanceTime--
    let time = setTimeout(function () {
      that.countdown(that);
    }, 1000)
    this.data.time = time
  },
  onHide(){
    this.data.isOnshow = false
  },
  onUnload: function () {
    clearTimeout(this.data.time)
    Event.off('didLogin', this.didLogin);
  },
})