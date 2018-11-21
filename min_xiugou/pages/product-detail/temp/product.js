let { Tool, RequestFactory, Storage, Event, Operation } = global

export default class ProductFactorys  {
  constructor(page) {
    this.page = page
  }
  requestFindProductByIdApp(callBack = () => { }) { // 产品详情接口请求
    let url = this.page.data.prodCode ? Operation.getProductDetailByCode : Operation.findProductByIdApp
    url = this.page.data.proNavData ? Operation.findProductByIdApp : url
    let params = {
      id: this.page.data.productId,
      code: this.page.data.prodCode,
      requestMethod: 'GET',
      reqName: '获取商品详情页',
      url: url
    }
    let r = RequestFactory.wxRequest(params);
    let productInfo = this.page.data.productInfo
    r.successBlock = (req) => {
      let datas = req.responseObject.data || {}
      this.page.data.userInfos = this.page.data.userInfos || {}
      datas.userLevelTypeName = datas.priceType == (1 || 0 || null) ? '原价' : datas.priceType == 2 ? "拼店价" : this.page.data.userInfos.levelName + "价"
      if (datas.product.buyLimit != -1 && !datas.product.leftBuyNum) {
        datas.product.canUserBuy = false
      } else {
        datas.product.canUserBuy = true
      }
      this.page.setData({
        isInit:false,
        imgUrls: datas.productImgList,
        productInfo: datas.product,
        productInfoList: datas,
        priceList: datas.priceList, // 价格表
        productSpec: datas.specMap, // 规格描述
        productId: datas.product.id ? datas.product.id : this.page.data.productId
      })

      // 渲染表格
      this.renderTable(datas.paramList, 'paramName','paramValue')
      
      // 渲染详情图文
      this.page.selectComponent("#productInfos").initDatas()
      // 执行额外需要做的操作
      callBack(datas)
    }
    Tool.showErrMsg(r)
    r.addToQueue();
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
  queryPushNum() {
    let params = {
      reqName: '消息未读详情',
      url: Operation.queryPushNum,
      requestMethod: 'GET'
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let detail = req.responseObject.data;
      this.page.setData({
        messageNum: detail.messageCount + detail.noticeCount + detail.shopMessageCount
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  }
  getShoppingCartList() { // 获取线上购物车
    if (!this.page.data.didLogin) {
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
      let size = data.length > 99 ? 99 : data.length
      this.page.setData({
        size: size
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
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