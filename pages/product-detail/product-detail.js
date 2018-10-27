let { Tool, RequestFactory, Storage, Event, Operation } = global

import WxParse from '../../libs/wxParse/wxParse.js';
const app = getApp()
Page({
  data: {
    didLogin:false,
    imgUrls: [],
    activeIndex:1, // 轮播图片的index 
    show:true,
    msgShow:false,
    selectType:{}, // 是否选择了商品类型
    floorstatus:false, // 是否显示置顶的按钮
    productId:'', // 商品id
    productInfo:'', // 商品信息
    productTypeList:[],
    productBuyCount:1, //商品购买数量
    priceList:[],
    nodes:  [{
      name:  "table",
      attrs:  {
        class: "table"
      },
      children: [],
    }],
    size:0,
    userInfos:{},
    autoplay:true,
  },
  videoClicked(){
    this.setData({
      autoplay: !this.data.autoplay
    })
    // Tool.navigateTo('/pages/my/information/information')
  },
  onLoad: function (options) {
    console.log(options);
    this.setData({
      productId: options.productId || '',
      prodCode: options.prodCode || '',
      door: options.door || '',
      inviteCode: options.inviteCode || ''
    })
   
    this.didLogin()
    let callBack = ()=>{
      this.getShoppingCartList()
    }
    if (!this.data.didLogin){
      app.getSystemInfo()
      app.wxLogin(callBack)
    } else {
      this.getShoppingCartList()
    }
    this.requestFindProductByIdApp()
    Tool.isIPhoneX(this)
    Event.on('didLogin', this.didLogin, this);
    this.refreshMemberInfoNotice()
  },
  onShow: function () {
  
  },
  refreshMemberInfoNotice() {
    Tool.getUserInfos(this)
  },
  imageLoad(e) {
    Tool.getAdaptHeight(e, this)
  },
  didLogin() {
    Tool.didLogin(this)
  },
  swiperImgCliked(e){
    let index = e.currentTarget.dataset.index
    let src = this.data.imgUrls[index].smallImg
    let urls = []
    this.data.imgUrls.forEach((item)=>{
      if (item.smallImg) {
        urls.push(item.smallImg)
      }
    })
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: urls// 需要预览的图片http链接列表
    })
  },
  msgTipsClicked(e){
    let n = parseInt(e.currentTarget.dataset.index) 
    switch (n) {
      case 1:
        Tool.navigateTo('/pages/my/information/information')
        break;
      case 2:
        Tool.switchTab('/pages/index/index')
        break;
      case 3:
        
        break;  
    }
  },
  setStoragePrd(params,index){
    let list = Storage.getShoppingCart()
    if (!list){
      list = []
    } else {
      for (let i = 0; i < list.length; i++) {
        if (list[i].priceId === params.priceId) {
          console.log(list[i].showCount, this.data.productBuyCount)
          list[i].showCount += this.data.productBuyCount
          this.updateStorageShoppingCart(list)
          return
        }
      }
    }
    params.productId = this.data.selectType.productId
    params.priceId = this.data.selectType.id
    params.showCount = this.data.productBuyCount
    
    list.push(params)
    this.updateStorageShoppingCart(list)
  },
  updateStorageShoppingCart(list){
    Storage.setShoppingCart(list)
    this.getShoppingCartList()
    Tool.showSuccessToast('添加成功')
    Event.emit('updateStorageShoppingCart')
  },
  activityByProductId(productId) {
    let params = {
      productId: productId,
      reqName: '获取是否是活动产品',
      url: Operation.activityByProductId,
      requestMethod: 'GET',
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let datas = req.responseObject.data
      if(!datas) return
      if (datas.activityType == 1 || datas.activityType == 2 ){
        let proNavData =datas.activityType == 1 ? datas.seckill : datas.depreciate
        proNavData.originalPrice = this.data.productInfoList.originalPrice
        this.setData({
          proNavData: datas.activityType == 1 ? datas.seckill : datas.depreciate,
          activityType: datas.activityType,
          promotionDesc: {
            commingDesc: '',
            countdownDesc: '',
            typeDesc: datas.activityType == 1 ? '秒杀价':"起拍价"
          },
        })
        // if (this.data.door == 100) {
        //   this.goPage()
        // }
       this.selectComponent('#promotion').init();
      }
    };
    Tool.showErrMsg(r)
    r.addToQueue();
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
      Tool.navigateTo('/pages/login-wx/login-wx?isBack=' + true+'&inviteCode=' + this.data.inviteCode)
      return
    }
    let params = {
      orderProducts:[{
        num: this.data.productBuyCount,
        priceId: this.data.selectType.id,
        productId: this.data.productInfo.id
      }],
      orderType:99
    }
    Tool.navigateTo('/pages/order-confirm/order-confirm?params=' + JSON.stringify(params)+'&type=99' )
  },
  addToShoppingCart(){
    let params = {
      productId: this.data.productInfo.id,
      amount: this.data.productBuyCount,
      priceId: this.data.selectType.id,
      timestamp: new Date().getTime(),
      reqName: '加入购物车',
      url: Operation.addToShoppingCart
    }
    // 加入购物车
    if (!this.data.didLogin) {
      this.setStoragePrd(params, this.data.selectType.index)
      return
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      this.getShoppingCartList()
      Event.emit('updateShoppingCart')
      Tool.showSuccessToast('添加成功')
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  requestFindProductByIdApp(){
    let url = this.data.prodCode? Operation.getProductDetailByCode : Operation.findProductByIdApp
    let params = {
      id: this.data.productId,
      code:this.data.prodCode,
      requestMethod: 'GET',
      reqName: '获取商品详情页',
      url: url
    }
    let r = RequestFactory.wxRequest(params);
    let productInfo = this.data.productInfo
    r.successBlock = (req) => {
      let datas = req.responseObject.data || {}
      datas.priceLable = datas.priceType == 1 ? '原价' : datas.priceType == 2 ? "拼店价" : this.data.userInfos.levelName+"价"
      datas.product.videoUrl && datas.productImgList.unshift({
        videoUrl: datas.product.videoUrl
      })
      this.setData({
        imgUrls: datas.productImgList,
        productInfo: datas.product,
        productInfoList: datas,
        priceList: datas.priceList, // 价格表
        productSpec: datas.specMap, // 规格描述
        productId: datas.product.id ? datas.product.id : this.data.productId
      })
      this.activityByProductId(this.data.productId)
      // 渲染表格
      let tr = []
      let tbody = this.data.nodes
      for (let i = 0; i < datas.paramList.length;i++){ 
        tr.push(
          {
            name: "tr",
            attrs: { class: "tr" },
            children: [ {
              name: "td",
              attrs: { class:'td frist-td'},
              children: [{
                type: "text",
                text: datas.paramList[i].paramName
              }]
            },
            {
              name: "td",
              attrs: { class: 'td td2'},
              children: [{
                type: "text",
                text: datas.paramList[i].paramValue
              }]
            }
            ]
          }  

        )
      }
      tbody[0].children = tr
      this.setData({
        nodes: tbody
      })
      let html = datas.product.content 
      WxParse.wxParse('article', 'html', html, this, 5);
    }
    Tool.showErrMsg(r)
    r.addToQueue();
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
  sliderChange(e){
    this.setData({
      activeIndex: e.detail.current+1,
      autoplay:true
    })
  },
  // 切换 tabar
  infoChoose(e){
    let show = e.currentTarget.dataset.show ==1 ?  true:false
    this.setData({
      show: show
    })
  },
  cartClicked(){
    Tool.switchTab('/pages/shopping-cart/shopping-cart')
  },
  btnClicked(e){
    let n = parseInt(e.currentTarget.dataset.key)
    this.selectComponent("#prd-info-type").isVisiableClicked(n)
  },
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  scroll: function (e, res) {
    
    this.setData({
      msgShow: false
    });
    if (e.detail.scrollTop >200) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  msgClicked(){
    this.setData({
      msgShow: !this.data.msgShow
    })
  },
  counterInputOnChange(e){
    this.setData({
      productBuyCount:e.detail
    })
  },
  onShareAppMessage: function (res) {

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    let inviteCode = this.data.userInfos.inviteId || this.data.inviteCode
    let imgUrl = this.data.imgUrls[0].original_img ? this.data.imgUrls[0].original_img:''
    let name = this.data.productInfo.name.length > 10 ? this.data.productInfo.name.slice(0, 10) + "..." : this.data.productInfo.name
    return {
      title: name,
      path: '/pages/product-detail/product-detail?productId=' + this.data.productInfo.id + '&inviteCode=' + inviteCode,
      imageUrl: imgUrl
    }
  },
  wxParseTagATap: function (e) {
    let link = e.currentTarget.dataset.src
    console.log(link)
  },
  getStorageCartList() {
    let data = Storage.getShoppingCart() || []
    let size = data.length
    this.setData({
      size: size
    })
    return
  },
  getShoppingCartList() {
    if (!this.data.didLogin){
      this.getStorageCartList()
      return
    }
    let params = {
      reqName: '获取购物车',
      url: Operation.getShoppingCartList,
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let data = req.responseObject.data
      data = data === null ? [] : data
      let size = data.length > 99 ?  99: data.length
      this.setData({
        size: size
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  hiddenTips(){
    this.setData({
      msgShow:false
    })
  },
  timeout(){
    this.activityByProductId(this.data.productId)
  },
  onUnload: function () {
    Event.off('didLogin', this.didLogin);
  },
})