let { Tool, RequestFactory, Storage, Operation, Event,API} = global

Page({
  data: {
    show:false, //展示形式  false：网状 
    keyword:'', 
    tipVal:'', // 默认是无 取值 1 2 3 
    productInfo: [], // 商品信息
    totalPage:'', // 页面总页数
    currentPage:1, // 当前的页数
    pageSize: 10, // 每次加载请求的条数 默认10 
    params:{},
    categoryId:'',
    isInit: false,
  },
  onLoad: function (options) {
    this.getInitRequest(options)
    this.getShoppingCartList()
    Tool.isIPhoneX(this)
    this.didLogin()
    Event.on('didLogin', this.didLogin, this);
  },
  onShow: function () {
    
  },
  getInitRequest(options){
    let params = {
      pageSize: this.data.pageSize,
      page: this.data.currentPage,
      keyword: options.keyword || '',
      categoryId: Number(options.categoryId) || '',
      hotWordId: Number(options.hotWordId) || '',
      sortModel:2,
      sortType: 1
    }
    if (options.hotWordId) {
      delete params.categoryId
    } else if (options.categoryId) {
      delete params.keyword
      delete params.hotWordId
    } else if (!options.hotWordId && !options.categoryId){
      delete params.hotWordId
      delete params.categoryId
    }
    this.setData({
      keyword: options.keyword || '',
      params: params,
      categoryId: options.categoryId || '',
      hotWordId: options.categoryId || ''
    })
    this.requestQueryProductList(params)
  },
  didLogin() {
    Tool.didLogin(this)
  },
  getKeyword(e){
    this.setData({
      keyword: e.detail.keyWord
    })
  },
  scroll(e, res) {
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
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  searchKeyword(){
    if (!Tool.isEmpty(this.data.keyword)){
      let history = Storage.getHistorySearch()
      history.unshift(this.data.keyword)
      let setArr = new Set(history)
      history = [...setArr]
      Storage.setHistorySearch(history)
    } else {
      Tool.showAlert('搜索内容不能为空')
      return
    }
    this.data.params.keyword = this.data.keyword
    this.setData({
      params: this.data.params
    })
    this.navbarClicked({detail:{n:1}})
  },
  reloadNet(){
    this.requestQueryProductList(this.data.params)
  },
  onScroll(){
    // 向下滑动的时候请求数据
    if (this.data.currentPage >= this.data.totalPage) return
    let page = this.data.currentPage
    page+=1
    let {params} = this.data
    params.page = page
    this.setData({
      currentPage: page,
      params: params
    })
    this.requestQueryProductList(this.data.params)
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
  addToShoppingCart(e) {
    this.setData({
      selectType: e.detail
    })
    console.log(this.data.selectType)
    let params = {
      productId: this.data.selectType.prodCode,
      amount: this.data.selectType.buyCount,
      priceId: this.data.selectType.skuCode,
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
  setStoragePrd(params) {
    let list = Storage.getShoppingCart() || []
    for (let i = 0; i < list.length; i++) {
      if (list[i].priceId === params.priceId) {
        list[i].showCount += this.data.selectType.buyCount
        this.updateStorageShoppingCart(list)
        return
      }
    }
    params.showCount = this.data.selectType.buyCount
    list.push(params)
    this.updateStorageShoppingCart(list)
  },
  updateStorageShoppingCart(list) {
    Storage.setShoppingCart(list)
    this.getShoppingCartList()
    Tool.showSuccessToast('添加成功')
    Event.emit('updateStorageShoppingCart')
  },
  addShoppingCartClicked(e) {
    //加入购物车
    let index = e.currentTarget.dataset.index
    let imgurl = e.currentTarget.dataset.imgurl
    let price = e.currentTarget.dataset.price
    this.setData({
      productSpec: this.data.productInfo[index].specifyList,
      priceList: this.data.productInfo[index].skuList,
      selectPrice: price,
      isInit:false,
      imgUrl: imgurl
    })
    this.selectComponent("#prd-info-type").isVisiableClicked()
    // this.findProductStockBySpec(id, imgurl, price)
  },
  findProductStockBySpec(id, imgurl, price) {
    // let params = {
    //   id:id,
    //   isShowLoading: false,
    //   requestMethod: 'GET',
    //   url: Operation.findProductStockBySpec,
    //   reqName: "规格搜索"
    // }
    // let r = RequestFactory.wxRequest(params);
    // r.successBlock = (req) => {
    //   let datas = req.responseObject.data
    //   this.setData({
    //     productSpec: datas.specMap,
    //     priceList: datas.priceList,
    //     selectPrice: price,
    //     isInit:false,
    //     imgUrl: imgurl
    //   })
    //   this.selectComponent("#prd-info-type").isVisiableClicked()
    // }
    // Tool.showErrMsg(r)
    // r.addToQueue();
  },
  requestQueryProductList(params){
    API.searchProduct(params).then((res) => {
      let productInfo = this.data.productInfo
      let datas = res.data || {}
      if (datas.totalNum > 0) {
        this.setData({
          productInfo: productInfo.concat(datas.data),
          totalPage: datas.totalPage,
          tipVal: ''
        })
      } else if (datas.totalNum == 0) {
        this.setData({
          tipVal: 2
        })
      }
    }).catch((res) => {

    })
    // params = {
    //   ...params,
    //   url: Operation.searchProduct,
    //   reqName: "关键字搜索"
    // }
    // let r = RequestFactory.wxRequest(params);
    // r.successBlock = (req) => {
    //   let productInfo = this.data.productInfo
    //   let datas = req.responseObject.data
    //   if (datas.totalNum > 0) {
    //     datas.data.forEach((item) => {
    //       item.product.price = Tool.formatNum(item.price)
    //       item.product.originalPrice = Tool.formatNum(item.originalPrice)
    //     })
    //     this.setData({
    //       productInfo: productInfo.concat(datas.data),
    //       totalPage: datas.totalPage,
    //       tipVal: ''
    //     })
    //   } else if (datas.totalNum == 0) {
    //     this.setData({
    //       tipVal: 2
    //     })
    //   }
    // }
    // Tool.showErrMsg(r)
    // r.addToQueue();
  },
  productCliked(e){
    Tool.navigateTo('/pages/product-detail/product-detail?prodCode='+ e.currentTarget.dataset.id+'&door=1')
  },
  goPage(){
    Tool.switchTab('/pages/shopping-cart/shopping-cart')
  },
  navbarClicked(e){
    // 1 综合 2销量 3价格 不是数字为变化排版
    let n = e.detail.n
    let sort = e.detail.sort
    if (n === false || n === true){
      this.setData({
        show: n
      })
      return
    }
    let params = {
      // pageSize: this.data.pageSize,
      // page: 1,
      // keyword: this.data.keyword || '',
      ...this.data.params,
      sortType:n
    }
    params.page =1
    switch (n) {
      case 1:
        params.sortModel = 2
        break;
      case 2:
        params.sortModel = 2
        break;
      case 3:
        let sortType = sort? 1:2
        params.sortModel = sortType
        break;
    }
    this.setData({
      params: params,
      currentPage:1,
      productInfo: []
    }) 
    this.requestQueryProductList(params)
  },
  onUnload: function () {
    
  },
})