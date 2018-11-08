let { Tool, RequestFactory, Storage, Event, Operation } = global

import WxParse from '../../../libs/wxParse/wxParse.js';
import ProductFactory from '../temp/product.js'

Page({
  data: {
    ysf: { title: '礼包详情' },
    didLogin: false,
    imgUrls: [],
    msgShow: false,
    selectType: {}, // 是否选择了商品类型
    floorstatus: false, // 是否显示置顶的按钮
    giftBagId: '', // 商品id
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
    isShowGiftTips:false, //是否显示礼包升级提示
    size: 0,
    dismiss:false, // 能否可以购买礼包
  },
  onLoad: function (options) {
    this.setData({
      giftBagId: options.giftBagId || '',
      inviteCode: options.inviteCode || ''
    })
    this.didLogin()
    Event.on('didLogin', this.didLogin, this);
    this.refreshMemberInfoNotice()
  },
  refreshMemberInfoNotice() {
    Tool.getUserInfos(this)
  },
  onShow: function () {
    this.getGiftBagDetail()
  },
  swiperImgCliked(e) {
    let index = e.currentTarget.dataset.index
    let src = this.data.imgUrls[index].smallImg
    let urls = []

    this.data.imgUrls.forEach((item) => {
      if (item.smallImg){
        urls.push(item.smallImg)
      }
    })
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: urls// 需要预览的图片http链接列表
    })
  },
  didLogin() {
    Tool.didLogin(this)
    Tool.isIPhoneX(this)
  },
  giftBagClicked() {
    // 立即购买
    if (!this.data.didLogin) { // 未登录
      Tool.navigateTo('/pages/login-wx/login-wx?isBack=' + true + '&inviteCode=' + this.data.inviteCode)
      return
    }
    
    if (!this.data.selectType.productType){ // 未选择
      this.selectComponent("#prd-info-type").isVisiableClicked()
      return
    }
    let params = {
      orderProducts: [{
        num:1,
        priceId: this.data.productInfo.id,
        productId: this.data.productInfo.id,
        priceList: this.data.selectType.priceList
      }],
      orderType: 5,
      packageCode: this.data.productInfo.packageCode
    }

    Tool.navigateTo('/pages/order-confirm/order-confirm?params=' + JSON.stringify(params) + "&type=5")
  },
  getGiftBagDetail() { //获取礼包详情
    let params = {
      code:this.data.giftBagId,
      isShowLoading:false,
      reqName: '礼包详情',
      requestMethod: 'GET',
      url: Operation.getGiftBagDetail
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let datas = req.responseObject.data
      if (this.data.didLogin){
        if (datas.userBuy && datas.type==2){
          this.data.isShowGiftTips =true
        }
        this.setData({
          dismiss: !datas.userBuy,
          isShowGiftTips: this.data.isShowGiftTips
        })
      }
      // 渲染库存
      let giftStock = []
      let specPriceList = []
      for (let key in datas.specPriceList) {
        specPriceList.push({
          name: datas.specPriceList[key][0].productName,
          value: datas.specPriceList[key]
        })
        let total = 0
        datas.specPriceList[key].forEach((items, index) => {
          total += items.surplusNumber
          giftStock.push(total)
        })
      }
      

      // 显示各礼包总库存里面的最小库存

      datas.showStock = Math.min(...giftStock)

      this.setData({
        imgUrls: datas.imgFileList,
        productInfo: datas,
        // priceList: datas.priceList,
        productId: datas.id,
        productTypeList: specPriceList
      })
      // 渲染表格
      let tr = []
      let tbody = this.data.nodes
      for (let i = 0; i < datas.paramValueList.length; i++) {
        tr.push(
          {
            name: "tr",
            attrs: { class: "tr" },
            children: [ {
              name: "td",
              attrs: { class: 'td frist-td' },
              children: [{
                type: "text",
                text: datas.paramValueList[i].param
              }]
            },
            {
              name: "td",
              attrs: { class: 'td td2' },
              children: [{
                type: "text",
                text: datas.paramValueList[i].paramValue
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
      let html = datas.content
      WxParse.wxParse('article', 'html', html, this, 5);
    }
    r.failBlock = (req) => {
      let callBack =()=>{}
      if (req.responseObject.code == 604) { // 超时登录
        callBack = () => {
          Tool.navigationPop()
        }
      }
      Tool.showAlert(req.responseObject.msg, callBack)
    }
    r.addToQueue();
  },
  typeSubClicked(e) {
    this.setData({
      selectType: e.detail
    })
    this.giftBagClicked()
  },
  btnClicked(e) {
    if (this.data.dismiss) return
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
  onShareAppMessage: function (res) {
    let inviteCode = this.data.userInfos.inviteId || this.data.inviteCode
    let imgUrl = this.data.imgUrls[0].original_img ? this.data.imgUrls[0].original_img : ''
    let name = this.data.productInfo.name.length > 10 ? this.data.productInfo.name.slice(0, 10) + "..." : this.data.productInfo.name
    return {
      title: name,
      path: '/pages/index/index?type=3&id=' + this.data.giftBagId + '&inviteCode=' + inviteCode,
      imageUrl: imgUrl
    }
  },
  productTypeListClicked(e) {
    this.setData({
      productTypeList: e.detail.productTypeList
    })
  },
  closeMask(){
    // let { isShowGiftTips} = this.data
    // isShowGiftTips.show = !isShowGiftTips.show
    this.setData({
      isShowGiftTips: !this.data.isShowGiftTips
    })
  },
  hiddenTips() {
    this.setData({
      msgShow: false
    })
  },
  onUnload: function () {
    Event.off('didLogin', this.didLogin);
  },
})