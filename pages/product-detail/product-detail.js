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
    size:0
  },
  onLoad: function (options) {
    this.setData({
      productId: options.productId || '',
      prodCode: options.prodCode || '',
    })
   
    this.didLogin()
    if (!this.data.didLogin){
      app.wxLogin()
    }
    this.requestFindProductByIdApp()
    
    Tool.isIPhoneX(this)
    Event.on('didLogin', this.didLogin, this);
  },
  onShow: function () {
  
  },
  imageLoad(e) {
    Tool.getAdaptHeight(e, this)
  },
  didLogin() {
    Tool.didLogin(this)
    if (this.data.didLogin){
      this.getShoppingCartList()
    }
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
  makeSureOrder(){
    // 立即购买
    if (!this.data.didLogin) {
      Tool.navigateTo('/pages/login-wx/login-wx?isBack='+true)
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
    Tool.navigateTo('/pages/order-confirm/order-confirm?params=' + JSON.stringify(params)+'&type='+this.data.door )
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
    let params = {
      id: this.data.productId,
      requestMethod: 'GET',
      reqName: '获取商品详情页',
      url: Operation.findProductByIdApp
    }
    let r = RequestFactory.wxRequest(params);
    let productInfo = this.data.productInfo
    r.successBlock = (req) => {
      let datas = req.responseObject.data
      this.setData({
        imgUrls: datas.productImgList,
        productInfo: datas.product,
        productInfoList: datas,
        priceList: datas.priceList, // 价格表
        productSpec: datas.specMap, // 规格描述
      })
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
    console.log(e)
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
      activeIndex: e.detail.current+1
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
    let imgUrl = this.data.imgUrls[0].original_img ? this.data.imgUrls[0].original_img:''
    let name = this.data.productInfo.name.length > 10 ? this.data.productInfo.name.slice(0, 10) + "..." : this.data.productInfo.name
    return {
      title: name,
      path: '/pages/product-detail/product-detail?productId=' + this.data.productId,
      imageUrl: imgUrl
    }
  },
  wxParseTagATap: function (e) {
    let link = e.currentTarget.dataset.src
    console.log(link)
  },
  getShoppingCartList() {
    // 查询购物车
    if (!this.data.didLogin){
      let data = Storage.getShoppingCart() || []
      let size = data.length
      this.setData({
        size: size
      })
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
  onUnload: function () {
    Event.off('didLogin', this.didLogin);
  },
})