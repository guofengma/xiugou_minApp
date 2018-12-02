let { Tool, Storage, Event, API } = global

import ProductFactorys from '../temp/product.js'

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
    isShowGiftTips:false, //是否显示礼包升级提示
  },
  onLoad: function (options) {
    this.setData({
      giftBagId: options.giftBagId || ''
    })
    this.ProductFactory = new ProductFactorys(this)
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
  didLogin() {
    this.ProductFactory.didLogin()
    Tool.isIPhoneX(this)
  },
  giftBagClicked() {
    // 立即购买
    if (!this.data.didLogin) { // 未登录
      Tool.navigateTo('/pages/login-wx/login-wx?isBack=' + true + '&inviteId=' + this.data.inviteCode)
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
    Storage.setSubmitOrderList(params)
    Tool.navigateTo('/pages/order-confirm/order-confirm?params=' + JSON.stringify(params) + "&type=5")
  },
  getGiftBagDetail() { //获取礼包详情
    API.getGiftBagDetail({
      code: this.data.giftBagId
    }).then((res) => {
      let datas = res.data || {}
      if (datas.status == 0) { // 商品走丢了 删除了
        this.ProductFactory.productDefect()
        return
      }
      if (this.data.didLogin) {
        if (datas.userBuy && datas.type == 2) {
          this.data.isShowGiftTips = true
        }
        this.setData({
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
        })
        giftStock.push(total)
      }
      // 不限购剩余测试小于0  不在购买时间  状态为1的情况下没有资格购买礼包
      if ((datas.buyLimit != -1 && !datas.leftBuyNum) || !datas.buyTime || (datas.status == 1 && !datas.userBuy)) {
        datas.canUserBuy = false
      } else {
        datas.canUserBuy = true
      }
      // 显示各礼包总库存里面的最小库存

      datas.showStock = Math.min(...giftStock)
      datas.showContent = datas.content.split(',')
      this.setData({
        imgUrls: datas.imgFileList,
        productInfo: datas,
        // priceList: datas.priceList,
        productId: datas.id,
        productTypeList: specPriceList
      })

      // 渲染表格
      this.ProductFactory.renderTable(datas.paramValueList || {}, 'param', 'paramValue')

      // this.selectComponent("#productInfos").initDatas()
    }).catch((res) => {
      let callBack =()=>{}
      if (res.code == 604) { // 超时登录
        callBack = () => {
          Tool.navigationPop()
        }
      }
      Tool.showAlert(res.msg, callBack)
    })
    // let params = {
    //   code:this.data.giftBagId,
    //   isShowLoading:false,
    //   reqName: '礼包详情',
    //   requestMethod: 'GET',
    //   url: Operation.getGiftBagDetail
    // }
    // let r = RequestFactory.wxRequest(params);
    // r.successBlock = (req) => {
    //   let datas = req.responseObject.data
    //   if (datas.status == 0) { // 商品走丢了 删除了
    //     this.ProductFactory.productDefect()
    //     return
    //   }
    //   if (this.data.didLogin){
    //     if (datas.userBuy && datas.type==2){
    //       this.data.isShowGiftTips =true
    //     }
    //     this.setData({
    //       isShowGiftTips: this.data.isShowGiftTips
    //     })
    //   }
    //   // 渲染库存
    //   let giftStock = []
    //   let specPriceList = []
    //   for (let key in datas.specPriceList) {
    //     specPriceList.push({
    //       name: datas.specPriceList[key][0].productName,
    //       value: datas.specPriceList[key]
    //     })
    //     let total = 0
    //     datas.specPriceList[key].forEach((items, index) => {
    //       total += items.surplusNumber
    //     })
    //     giftStock.push(total)
    //   }
    //   // 不限购剩余测试小于0  不在购买时间  状态为1的情况下没有资格购买礼包
    //   if ((datas.buyLimit != -1 && !datas.leftBuyNum) || !datas.buyTime || (datas.status == 1 && !datas.userBuy)) {
    //     datas.canUserBuy = false
    //   } else {
    //     datas.canUserBuy = true
    //   }
    //   // 显示各礼包总库存里面的最小库存

    //   datas.showStock = Math.min(...giftStock)

    //   this.setData({
    //     imgUrls: datas.imgFileList,
    //     productInfo: datas,
    //     // priceList: datas.priceList,
    //     productId: datas.id,
    //     productTypeList: specPriceList
    //   })

    //   // 渲染表格
    //   this.ProductFactory.renderTable(datas.paramValueList || {}, 'param','paramValue')

    //   this.selectComponent("#productInfos").initDatas()
    // }
    // r.failBlock = (req) => {
    //   let callBack =()=>{}
    //   if (req.responseObject.code == 604) { // 超时登录
    //     callBack = () => {
    //       Tool.navigationPop()
    //     }
    //   }
    //   Tool.showAlert(req.responseObject.msg, callBack)
    // }
    // r.addToQueue();
  },
  typeSubClicked(e) {
    this.setData({
      selectType: e.detail
    })
    this.giftBagClicked()
  },
  btnClicked(e) {
    if (this.data.productInfo.canUserBuy&& this.data.productInfo.status ==1 ){
      let n = parseInt(e.currentTarget.dataset.key)
      this.selectComponent("#prd-info-type").isVisiableClicked(n)
    } 
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
    return this.ProductFactory.onShareAppMessage(3, this.data.giftBagId)
  },
  productTypeListClicked(e) {
    this.setData({
      productTypeList: e.detail.productTypeList
    })
  },
  closeMask(){
    this.setData({
      isShowGiftTips: !this.data.isShowGiftTips
    })
  },
  onUnload: function () {
    Event.off('didLogin', this.didLogin);
  },
})