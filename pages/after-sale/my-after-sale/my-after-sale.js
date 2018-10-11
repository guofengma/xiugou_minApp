let { Tool, RequestFactory, Storage, Operation } = global
Page({
  data: {
    ysf: { title: '我的售后' },
    keyword:'',
    totalPage: '', // 页面总页数
    currentPage: 1, // 当前的页数
    pageSize: 5, // 每次加载请求的条数 默认10
    lists:[],
    typeState: ["其他",'申请中', '已同意', '拒绝', '中','中','已完成','已关闭','已超时'],
    typeArr:[
      { name: '其他'},
      { name: '仅退款', 
        page:'/pages/after-sale/only-refund/only-refund-detail/only-refund-detail'
      },
      { name: '退货',
        page: '/pages/after-sale/return-goods/return-goods' 
      },
      { name: '换货', 
        page: '/pages/after-sale/exchange-goods/exchange-goods'
      },
    ],
    tipVal:''
  },
  onLoad: function (options) {
    let params = {
      page: this.data.currentPage,
      size: this.data.pageSize,
      productName: this.data.keyword
    }
    this.setData({
      params: params
    })
    this.queryAftermarketOrderPageList(params)
  },
  getKeyword(e) {
    this.setData({
      keyword: e.detail.keyWord
    })
  },
  searchKeyword() {
    let { params } = this.data
    params.page = 1
    params.productName = this.data.keyword
    this.setData({
      params: params
    })
    if (Tool.isEmptyStr(this.data.keyword)){
      Tool.showAlert('请输入搜索内容')
      return
    }
    this.queryAftermarketOrderPageList(this.data.params)
  },
  onScroll() {
    // 向下滑动的时候请求数据
    if (this.data.currentPage >= this.data.totalPage) return
    let page = this.data.currentPage
    page += 1
    let { params } = this.data
    params.page = page
    this.setData({
      currentPage: page,
      params: params
    })
    this.queryAftermarketOrderPageList(this.data.params)
  },
  queryAftermarketOrderPageList(params){
    // returnProductStatus  1申请中 2已同意 3拒绝 4完成 5关闭 6超时

    // getReturnProductType 1退款 2退货 3退货 
    params = {
      ...params,
      reqName: '我的售后',
      url: Operation.queryAftermarketOrderPageList,
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let lists = this.data.lists
      let datas = req.responseObject.data
      if (datas.totalPage>0){
        datas.data.forEach((item)=>{
          item.imgUrl = item.specImg
          item.typeName = this.data.typeArr[item.type].name
          item.typeState = this.data.typeState[item.status]
          console.log(item.type)
          if (item.status == 4 || item.status ==5){
            item.typeState = item.typeName + item.typeState
          }
        })
        if (!Tool.isEmptyStr(this.data.keyword)){
          lists=[]
        }
        this.setData({
          lists: lists.concat(datas.data),
          totalPage: req.responseObject.data.totalPage,
        })
      }else{
        this.setData({
          tipVal:2
        })
      }
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  goPage(e){
    let returnProductId = e.currentTarget.dataset.prdid
    let returnProductType = e.currentTarget.dataset.id
    console.log(returnProductId)
    let page = this.data.typeArr[returnProductType].page + "?returnProductId="+returnProductId
    Tool.navigateTo(page)
  }
})