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
    hasMask:false,
    isShowGiftTips:false, //是否显示礼包升级提示
  },
  onLoad: function (options) {
    this.setData({
      giftBagId: options.giftBagId || ''
    })
    this.data.preseat = options.preseat || ''
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
    this.ProductFactory.onShow()
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
    let orderProductList = []
    this.data.selectType.priceList.forEach((item)=>{
      orderProductList.push({
        skuCode: item.skuCode
      })
    })
    let params = {
      orderProductList: orderProductList,
      quantity:1,
      orderType: 2,
      orderSubType: this.data.productInfo.type==2? 3:4, // 3升级礼包 4 普通礼包
      activityCode: this.data.productInfo.packageCode
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
      datas.content = datas.content || ''
      datas.showContent = datas.content.split(',')
      this.setData({
        imgUrls: datas.imgFileList,
        productInfo: datas,
        productId: datas.id,
        productTypeList: specPriceList
      })

      // 渲染表格
      this.ProductFactory.renderTable(datas.paramValueList || {}, 'paramName', 'paramValue')
      Tool.sensors("CommodityDetail",{
        preseat:this.data.preseat,
        commodityID:datas.packageCode,
        commodityName:datas.name,
        pricePerCommodity:datas.levelPrice
      })
      // this.selectComponent("#productInfos").initDatas()
    }).catch((res) => {
      console.log(res)
      let callBack =()=>{}
      if (res.code == 604) { // 超时登录
        callBack = () => {
          Tool.navigationPop()
        }
      }
      Tool.showAlert(res.msg, callBack)
    })
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