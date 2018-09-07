let { Tool, RequestFactory, Storage, Operation} = global

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false, //展示形式  false：网状 
    keyword:'', 
    tipVal:'', // 默认是无 取值 1 2 3 
    productInfo:[], // 商品信息
    totalPage:'', // 页面总页数
    currentPage:1, // 当前的页数
    pageSize: 10, // 每次加载请求的条数 默认10 
    params:{},
    code:'',
    ysf: { title: '搜索结果' }
  },
  onLoad: function (options) {
    
    let params = {
      pageSize: this.data.pageSize,
      page: this.data.currentPage,
      keyword: options.keyword || '',
      areaCode: options.code || -1,
    }
    this.setData({
      keyword: options.keyword || '',
      params: params,
      code: options.code
    })

    // this.getRequestUrl(params)
    this.requestQueryProductList(params)
  },
  onShow: function () {
    
  },
  getKeyword(e){
    this.setData({
      keyword: e.detail.keyWord
    })
  },
  searchKeyword(){
    if (!Tool.isEmpty(this.data.keyword)){
      let history = Storage.getHistorySearch()
      let str = this.data.keyword.length > 10 ? this.data.keyword.slice(0, 10) + "..." : this.data.keyword
      let hasSame = false
      history.forEach((item) => {
        if (item == str) {
          hasSame = true
        }
      })
      if (!hasSame) {
        history.unshift(this.data.keyword)
        Storage.setHistorySearch(history)
      }
    } else {
      Tool.showAlert('请输入搜索内容')
      return
    }
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
  requestQueryProductList(params){
    let url = ''
    let reqName = ''
    if (this.data.keyword){
      // r = RequestFactory.searchProduct(params)
      url = Operation.searchProduct
      reqName = '关键字搜索'
    } else {
      // r = RequestFactory.queryProductListAPP(params);
      url = Operation.queryProductListAPP
      reqName = '获取商品列表'
    }
    let productInfo = this.data.productInfo
    params.reqName = reqName
    params.url = url
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let datas = req.responseObject.data
      if (datas.resultCount > 0) {
        this.setData({
          productInfo: productInfo.concat(datas.data),
          totalPage: datas.total,
          tipVal:''
        })
      } else if (datas.resultCount == 0) {
        this.setData({
          tipVal: 2
        })
      } else {
        this.setData({
          tipVal: 1
        })
      }
    }
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  productCliked(e){
    Tool.navigateTo('/pages/product-detail/product-detail?productId='+ e.currentTarget.dataset.id+'&door=1')
  },
  // getRequestUrl(params){
  //   if (this.data.keyword) {
  //     this.searchProduct(params)
  //   } else {
  //     this.requestQueryProductList(params)
  //   }
  // },
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
      pageSize: this.data.pageSize,
      page: 1,
      keyword: this.data.keyword || '',
      areaCode: this.data.code || -1,
    }
    switch (n) {
      case 1:
        break;
      case 2:
        params.saleNum = 2
        break;
      case 3:
        let sortType = sort? 1:2
        params.sort = sortType
        break;
    }
    this.setData({
      params: params,
      currentPage:1,
      productInfo: []
    }) 
    this.requestQueryProductList(params)
  }
})