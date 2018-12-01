let { Tool, RequestFactory, Storage, Operation, Event,API} = global

Page({
  data: {
    show:false, //展示形式  false：网状 
    keyword:'', 
    tipVal:'', // 默认是无 取值 1 2 3 
    productInfo: [
      // {
      //   "afterSaleServiceDays": 1,
      //   "brandId": 1,
      //   "brandName": "string",
      //   "buyLimit": 1,
      //   "content": "string",
      //   "firstCategoryId": 1,
      //   "firstCategoryName": "string",
      //   "freight": 0,
      //   "groupPrice": 0,
      //   "imgUrl": "https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/28ae8c7a07bb4784a0b36b1125365101.png",
      //   "leftBuyNum": 1,
      //   "maxPrice": 0,
      //   "minPrice": 0,
      //   "monthSaleTotal": 0,
      //   "name": "111111111",
      //   "originalPrice": 0,
      //   "paramList": [
      //     {
      //       "paramName": "尺寸",
      //       "paramValue": "杯子大小"
      //     }
      //   ],
      //   "priceType": 1,
      //   "prodCode": "P001",
      //   "productImgList": [
      //     {
      //       "height": 0,
      //       "originalImg": "string",
      //       "smallImg": "string",
      //       "sort": 0,
      //       "width": 0
      //     }
      //   ],
      //   "productStatus": 1,
      //   "secCategoryId": 1,
      //   "secCategoryName": "string",
      //   "sendMode": 1,
      //   "shareMoney": "100.01-200.01",
      //   "skuList": [
      //     {
      //       "barCode": "2018102sdjhku2",
      //       "originalPrice": 100,
      //       "price": 10,
      //       "prodCode": "P001",
      //       "propertyValues": "金色,64G,全网通",
      //       "sellStock": 10,
      //       "skuCode": "Sku001",
      //       "specImg": "https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/8a08ab77b6a34222bf27e3d6fae49db1.jpg",
      //       "stockUnit": "件",
      //       "weight": 1.25
      //     }
      //   ],
      //   "specifyList": [
      //     {
      //       "specName": "颜色",
      //       "specValues": [
      //         {
      //           "id": 1,
      //           "oldSpecImg": "string",
      //           "oldSpecValue": "string",
      //           "specImg": "string",
      //           "specName": "颜色",
      //           "specValue": "金色"
      //         }
      //       ]
      //     },
      //     {
      //       "specName": "规格",
      //       "specValues": [
      //         {
      //           "id": 1,
      //           "oldSpecImg": "string",
      //           "oldSpecValue": "string",
      //           "specImg": "string",
      //           "specName": "颜色",
      //           "specValue": "64G"
      //         }
      //       ]
      //     },
      //     {
      //       "specName": "LEI",
      //       "specValues": [
      //         {
      //           "id": 1,
      //           "oldSpecImg": "string",
      //           "oldSpecValue": "string",
      //           "specImg": "string",
      //           "specName": "颜色",
      //           "specValue": "全网通"
      //         },
      //         {
      //           "id": 1,
      //           "oldSpecImg": "string",
      //           "oldSpecValue": "string",
      //           "specImg": "string",
      //           "specName": "颜色",
      //           "specValue": "全网通2"
      //         }
      //       ]
      //     }
      //   ],
      //   "supplierCode": 1,
      //   "supplierName": "string",
      //   "thirdCategoryId": 1,
      //   "thirdCategoryName": "string",
      //   "upTime": "2018-12-01T03:24:28.537Z",
      //   "videoUrl": "string"
      // }
    ], // 商品信息
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
    let params = {
      productId: this.data.selectType.productId,
      amount: this.data.selectType.buyCount,
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
  setStoragePrd(params, index) {
    let list = Storage.getShoppingCart()
    if (!list) {
      list = []
    } else {
      for (let i = 0; i < list.length; i++) {
        if (list[i].priceId === params.priceId) {
          list[i].showCount += this.data.selectType.buyCount
          this.updateStorageShoppingCart(list)
          return
        }
      }
    }
    params.productId = this.data.selectType.productId
    params.priceId = this.data.selectType.id
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