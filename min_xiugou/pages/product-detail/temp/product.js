let { Tool, RequestFactory, Storage, Event, Operation,API } = global
const app = getApp()
export default class ProductFactorys  {
  constructor(page) {
    this.page = page
  }
  requestFindProductByIdApp(callBack = () => { }) { // 产品详情接口请求
    API.getProductDetailByCode({
      code: this.page.data.productCode
    }).then((res) => {
      let datas = res.data || {}
      this.page.data.userInfos = this.page.data.userInfos || {}
      datas.userLevelTypeName = datas.priceType == (1 || 0 || null || undefined) ? '原价' : datas.priceType == 2 ? "拼店价" : this.page.data.userInfos.levelRemark + "价"
      datas.showPrice = (datas.minPrice == datas.maxPrice) ? '¥' + datas.maxPrice : '¥' + datas.minPrice + ' - ¥' + datas.maxPrice
      // 用户不能购买 限购但属于数量小于等于0且状态不是1
      if ((datas.buyLimit != -1 && !datas.leftBuyNum) || datas.productStatus != 1) {
        datas.canUserBuy = false
      } else {
        datas.canUserBuy = true
      }
      datas.showContent = datas.content.split(',')
      this.page.setData({
        isInit: false,
        imgUrls: datas.imgFileList || [],
        productInfo: datas,
        // productInfoList: datas,
        priceList: datas.skuList, // 价格表
        productSpec: datas.specifyList, // 规格描述
        productId: datas.prodCode ? datas.prodCode : this.page.data.productCode
      })
      // 渲染表格
      this.renderTable(datas.paramList || {}, 'paramName', 'paramValue')

      // 渲染详情图文
      // this.page.selectComponent("#productInfos").initDatas()
      // 执行额外需要做的操作
      callBack(datas)
    }).catch((res) => {

    })
  }
  renderTable(paramList, paramName, paramValue) {  // 渲染表格
    let tbody = [{
      name: "table",
      attrs: {
        class: "table"
      },
      children: [],
    }]
    let tr = []
    for (let i = 0; i < paramList.length; i++) {
      tr.push(
        {
          name: "tr",
          attrs: { class: "tr" },
          children: [ {
            name: "td",
            attrs: { class: 'td frist-td' },
            children: [{
              type: "text",
              text: paramList[i][paramName]
            }]
          },
          {
            name: "td",
            attrs: { class: 'td td2' },
            children: [{
              type: "text",
              text: paramList[i][paramValue]
            }]
          }
          ]
        }

      )
    }
    tbody[0].children = tr
    this.page.setData({
      nodes: tbody
    })
  }
  didLogin(){ // 是否登录 
    Tool.didLogin(this.page)
    Tool.getUserInfos(this.page)
    if (this.page.data.didLogin){
      this.queryPushNum()
    }
    this.getShoppingCartList()
  }
  queryPushNum() { // 获取消息
    let callBack = (datas)=>{
      this.page.setData({
        messageNum: datas.totalMessageNum
      })
    }
    app.queryPushMsg(callBack)
  }
  addToShoppingCart() { // 加入购物车
    let params = {
      productCode: this.page.data.selectType.prodCode,
      amount: this.page.data.selectType.buyCount,
      skuCode: this.page.data.selectType.skuCode,
      timestamp: new Date().getTime(),
    }
    // 加入购物车
    if (!this.page.data.didLogin) {
      this.setStoragePrd(params)
      return
    }
    API.addToShoppingCart(params).then((res) => {
      this.getShoppingCartList()
      Event.emit('updateShoppingCart')
      Tool.showSuccessToast('添加成功')
    }).catch((res) => {

    })
  }
  setStoragePrd(params, index) { // 加入本地购物车
    let list = Storage.getShoppingCart() || []
    for (let i = 0; i < list.length; i++) {
      if (list[i].skuCode === params.skuCode) {
        list[i].showCount += this.page.data.selectType.buyCount
        this.updateStorageShoppingCart(list)
        return
      }
    }
    params.showCount = this.page.data.selectType.buyCount
    list.push(params)
    this.updateStorageShoppingCart(list)
  }
  updateStorageShoppingCart(list) { // 存储在本地
    Storage.setShoppingCart(list)
    this.getShoppingCartList()
    Tool.showSuccessToast('添加成功')
    Event.emit('updateStorageShoppingCart')
  }
  getShoppingCartList() { // 获取线上购物车
    if (!this.page.data.didLogin) {
      this.getStorageCartList()
      return
    }
    API.getShoppingCartList({}).then((res) => {
      let data = res.data || []
      let size = data.length > 99 ? 99 : data.length
      this.page.setData({
        size: size
      })
    }).catch((res) => {

    })
  }
  cartClicked() { // 跳转购物车
    Tool.switchTab('/pages/shopping-cart/shopping-cart')
  }
  getStorageCartList() { // 获取本地购物车
    let data = Storage.getShoppingCart() || []
    let size = data.length
    this.page.setData({
      size: size
    })
    return
  }
  msgTipsClicked(e, didLogin) { // 轮播右上角分享点击事件
    let n = parseInt(e.currentTarget.dataset.index)
    switch (n) {
      case 1:
        if (!didLogin) {
          Tool.navigateTo('/pages/login-wx/login-wx?isBack=' + true)
        } else {
          Tool.navigateTo('/pages/my/information/information')
        }
        break;
      case 2:
        // Tool.switchTab('/pages/index/index')
        Tool.navigateTo('/pages/search/search?door=0')
        break;
      case 3:
        break;
    }
  }
  productDefect(){ // 跳转到产品缺失页面
    Tool.redirectTo('/pages/product-detail/temp/defect/defect')
  }
  goTop() { // 置顶
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      Tool.showAlert('当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。')
    }
  }
  onPageScroll(e) { // 滚动事件
    this.page.setData({
      msgShow: false
    })
    if (e.scrollTop > 200) {
      this.page.setData({
        floorstatus: true
      });
    } else {
      this.page.setData({
        floorstatus: false
      });
    }
  }
  hiddenTips() {
    this.page.setData({
      msgShow: false
    })
  }
  shareSubClicked(e){
    let index = e.detail.index
    if (index == 2 || !index){
      Tool.navigateTo('/pages/login-wx/login-wx?isBack=' + true)
    }
    this.page.setData({
      alertShow:false
    })
  }
  onShareAppMessage(typeId,id){ // 分享
    let that = this
    let upUserId = Storage.getUpUserId() || {}
    let inviteCode = this.page.data.userInfos.id || upUserId.id || ''
    let imgUrl = this.page.data.productInfo.imgUrl? this.page.data.productInfo.imgUrl : ''
    let name = this.page.data.productInfo.name.length > 10 ? this.page.data.productInfo.name.slice(0, 10) + "..." : this.page.data.productInfo.name
    return {
      title: name,
      path: `/pages/index/index?type=${typeId}&id=${id}&inviteId=${inviteCode}`,
      imageUrl: imgUrl
    }
  }
}