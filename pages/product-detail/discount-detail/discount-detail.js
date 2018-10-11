let { Tool, RequestFactory, Storage, Event, Operation } = global

import WxParse from '../../../libs/wxParse/wxParse.js';

Page({
  data: {
    didLogin: false,
    imgUrls: [],
    activeIndex: 1, // 轮播图片的index 
    show: true,
    msgShow: false,
    selectType: {}, // 是否选择了商品类型
    floorstatus: false, // 是否显示置顶的按钮
    productId: '', // 商品id
    productInfo: '', // 商品信息
    productTypeList: [],
    productBuyCount: 1, //商品购买数量
    priceList: [],
    nodes: [{
            name: "table",
            attrs: {
        class: "table"
            },
            children: [],
    }],
    size: 0,
    proNavData: {},
    promotionDesc:{
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
    showRegular: false
  },
  onLoad: function (options) {
    this.getTopicActivityData();
    this.setData({
      productId: options.productId || 1,
      prodCode: options.prodCode || ''
    })
    this.didLogin()
    // this.requestFindProductByIdApp()
    // this.getShoppingCartList()
    Tool.isIPhoneX(this)
    Event.on('didLogin', this.didLogin, this);
  },
  onShow: function () {

  },
  //获取专题活动数据  JJP201810100001
  getTopicActivityData() {
    this.setData({
      proNavData: {
        "id": 1,
        "activityCode": "JJP1809210001",
        "productPriceId": 1,
        "totalNumber": 100,
        "surplusNumber": 10,
        "freezeNumber": 1,
        "startPrice": 2,
        "floorPrice": 1.5,
        "orderCloseTime": 1,
        "intervalTime": 1,
        "downPrice": 1.5,
        "floorPriceTime": 1,
        "limitNumber": 1,
        "status": 2,
        "activityTime": +new Date() + 2000000,
        "beginTime": +new Date() + 2000000,
        "endTime": +new Date() + 5000,
        "closeTime": 1537962985000,
        "createTime": 1537513053000,
        "modifiedTime": 1537962985000,
        "createUser": null,
        "reseCount": 0,
        "productName": "红米66",
        "spec": "红色-32G-1KG",
        "specImg": "https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/pms_1528718750.15896438!560x560.jpg",
        "originalPrice": 1000,
        "markdownPrice": 3,
        "limitFlag": 0,
        "notifyFlag": 0,
        "date": +new Date(),//1538034474246
        "tip": false,
        "reseCount": 0,
      }
    });
      this.selectComponent('#promotionFootbar').checkPromotionFootbarInfo(this.data.promotionFootbar, this.data.proNavData);
      this.selectComponent('#promotion').init();
    // let params = {
    //   code: 'JJP1810100008',
    //   reqName: '获取降价拍详情',
    //   url: Operation.getActivityDepreciateById,
    //   requestMethod: 'GET'
    // }
    // let r = RequestFactory.wxRequest(params);
    // r.successBlock = (req) => {
    //   let data = req.responseObject.data || {};
    //   this.setData({
    //     proNavData: data
    //   })

    //   this.selectComponent('#promotionFootbar').checkPromotionFootbarInfo(this.data.promotionFootbar, this.data.proNavData);
    //   this.selectComponent('#promotion').init();
    // };
    // Tool.showErrMsg(r)
    // r.addToQueue();
  },
  setTip: function() {
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
  footbarReady(e){
    if (this.data.promotionFootbar.disabled) return;    
    if(this.data.proNavData.status === 1){
      this.setTip();
    } else {
      this.btnClicked(e);
    }
  },
  imageLoad(e) {
    Tool.getAdaptHeight(e, this)
  },
  didLogin() {
    Tool.didLogin(this)
  },
  msgTipsClicked(e) {
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
  setStoragePrd(params, index) {
    let list = Storage.getShoppingCart()
    if (!list) {
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
  updateStorageShoppingCart(list) {
    Storage.setShoppingCart(list)
    this.getShoppingCartList()
    Tool.showSuccessToast('添加成功')
    Event.emit('updateStorageShoppingCart')
  },
  makeSureOrder() {
    // 立即购买
    if (!this.data.didLogin) {
      Tool.navigateTo('/pages/login-wx/login-wx?isBack=' + true)
      return
    }
    let params = {
      orderProducts: [{
        num: this.data.productBuyCount,
        priceId: this.data.selectType.id,
        productId: this.data.productInfo.id
      }],
      orderType: 99
    }
    Tool.navigateTo('/pages/order-confirm/order-confirm?params=' + JSON.stringify(params) + '&type=' + this.data.door)
  },
  addToShoppingCart() {
    let params = {
      productId: this.data.productInfo.id,
      amount: this.data.productBuyCount,
      priceId: this.data.selectType.id,
      timestamp: +new Date(),
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
  requestFindProductByIdApp() {
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
      for (let i = 0; i < datas.paramList.length; i++) {
        tr.push(
          {
            name: "tr",
            attrs: { class: "tr" },
            children: [ {
              name: "td",
              attrs: { class: 'td frist-td' },
              children: [{
                type: "text",
                text: datas.paramList[i].paramName
              }]
            },
            {
              name: "td",
              attrs: { class: 'td td2' },
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
  typeSubClicked(e) {
    console.log(e)
    this.setData({
      selectType: e.detail
    })
    if (this.data.selectType.typeClicked == 1) {
      this.addToShoppingCart(1)
    } else if (this.data.selectType.typeClicked == 2) {
      this.makeSureOrder()
    }
  },
  sliderChange(e) {
    this.setData({
      activeIndex: e.detail.current + 1
    })
  },
  // 切换 tabar
  infoChoose(e) {
    let show = e.currentTarget.dataset.show == 1 ? true : false
    this.setData({
      show: show
    })
  },
  cartClicked() {
    Tool.switchTab('/pages/shopping-cart/shopping-cart')
  },
  btnClicked(e) {
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
    if (e.detail.scrollTop > 200) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  msgClicked() {
    this.setData({
      msgShow: !this.data.msgShow
    })
  },
  counterInputOnChange(e) {
    this.setData({
      productBuyCount: e.detail
    })
  },
  onShareAppMessage: function (res) {

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    let imgUrl = this.data.imgUrls[0].original_img ? this.data.imgUrls[0].original_img : ''
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
    if (!this.data.didLogin) {
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
      let size = data.length > 99 ? 99 : data.length
      this.setData({
        size: size
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  hiddenTips() {
    this.setData({
      msgShow: false
    })
  },
  onUnload: function () {
    Event.off('didLogin', this.didLogin);
  },
  //倒计时结束 执行下一步操作  刷新当前页面或跳转什么的
  timeout() {
    console.log('countdown complete');
    this.getTopicActivityData();
  },
  toggleShowRegular(){
    console.log(22);
    this.setData({
      showRegular: !this.data.showRegular
    })
  },
  regularTouch(){
    return;
  }
})