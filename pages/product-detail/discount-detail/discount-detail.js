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
      "limitNumber": -1,
      "status": 2,
      "beginTime": new Date().getTime() + 2000000,
      "endTime": new Date().getTime() + 5000,
      "closeTime": 1537962985000,
      "createTime": 1537513053000,
      "modifiedTime": 1537962985000,
      "createUser": null,
      "reseCount": 0,
      "productName": "红米66",
      "spec": "红色-32G-1KG",
      "specImg": "https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/pms_1528718750.15896438!560x560.jpg",
      "originalPrice": 1000,
      "markdownPrice": 1.5,
      "activityTime": null,
      "limitFlag": 0,
      "notifyFlag": 0,
      "date": 1538034474246,
      "tip": false,
      "reseCount": 0,
      "notifyFlag": 0,
    },
    promotionDesc:{
      commingDesc: '',
      countdownDesc: '',
      typeDesc: '起拍价'
    },
    promotionFootbar: {
      className: 'footbar-primary',
      text: '设置提醒'
    }
  },
  onLoad: function (options) {
    // 获取完数据再展示
    let prop = this.data.proNavData;

    let commingDesc = this.decorateTime(
        prop.beginTime,
        prop.date,
        prop.notifyFlag
      ) 
    console.log(commingDesc);

    let countdownDesc = '距开抢';
    if( prop.status === 2){
      countdownDesc = '距结束'; // 距下次降价 活动结束
    }

    // ==========
    this.setData({
      productId: options.productId || 1,
      prodCode: options.prodCode || '',
      "promotionDesc.commingDesc": commingDesc,
      "promotionDesc.countdownDesc": countdownDesc
    })
    console.log(this.data.promotionDesc);
    this.didLogin()
    this.requestFindProductByIdApp()
    this.getShoppingCartList()
    Tool.isIPhoneX(this)
    Event.on('didLogin', this.didLogin, this);
  },
  onShow: function () {

  },
  setTip: function() {
    if (this.data.promotionFootbar.className == 'footbar-disabled') return;
    let title = `已关注本商品,\n活动开始前3分钟会有消息通知您`;
    wx.showToast({
      title: title,
      icon: 'none'
    })
    this.setData({
      promotionFootbar: {
        className: 'footbar-disabled',
        text: '没人限购2次',
        textSmall: '(您已购买过本商品)'
      }
    })
  },
  // 未开始 未设置提醒时： X月X日X:00开拍
  // 未开始 已设置提醒时： 明天X点开拍
  decorateTime(t, c, isTip) {
    let str = '';
    let targetDate = new Date(t);
    let targetM = targetDate.getMonth() + 1;
    let targetD = targetDate.getDate();
    let targetH = targetDate.getHours();
    let targetMi = targetDate.getMinutes();

    let diff = t - c;
    let diffHour = Math.floor(diff / 1000 / 60 / 60);
    let timeToTomorrow = 24 - new Date().getHours();

    let strHM = ([targetH, targetMi].map(Tool.formatNumber)).join(':') + '开拍'

    str = [targetM, '月', targetD, '日'].join('') + strHM;

    if (isTip) {
      if (diffHour - timeToTomorrow <= 0) {
        str = '今天' + strHM;
      }
      else if (diffHour - timeToTomorrow > 0 && diffHour - timeToTomorrow < 24) {
        str = '明天' + strHM;
      }
    }
    this.setData({
      "promotionInfo.commingDesc": str
    })
    return str;
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
  timeout: function () {
    console.log('complete')
  }
})