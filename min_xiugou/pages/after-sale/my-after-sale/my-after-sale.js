let { Tool, API, Storage, Operation } = global
Page({
  data: {
    ysf: { title: '我的售后' },
    keyword:'',
    totalPage: '', // 页面总页数
    currentPage: 1, // 当前的页数
    pageSize: 10, // 每次加载请求的条数 默认10
    lists:[],
    typeState: ["其他", '待审核', '待寄回', '待仓库确认', '待平台处理', '售后完成','关闭',],
    typeArr:[
      { name: '其他'},
      { name: '仅退款', 
        icon: 'shouhou_icon_tuikuan_nor@2x.png',
        page:'/pages/after-sale/only-refund/only-refund-detail/only-refund-detail'
      },
      { name: '退货退款',
        icon: 'shouhou_icon_tuihuo_nor@2x.png',
        page: '/pages/after-sale/return-goods/return-goods' 
      },
      { name: '换货', 
        icon:'shouhou_icon_huanhuo_nor@2x.png',
        page: '/pages/after-sale/exchange-goods/exchange-goods'
      },
    ],
    tipVal:''
  },
  onLoad: function (options) {
    let params = {
      page: this.data.currentPage,
      size: this.data.pageSize,
      // productName: this.data.keyword || ''
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
    if (Tool.isEmptyStr(this.data.keyword)){
      Tool.showAlert('搜索内容不能为空')
      return
    }
    params.page = 1
    params.searchKey = this.data.keyword
    this.setData({
      params: params,
      lists:[]
    })
    this.queryAftermarketOrderPageList(this.data.params,2)
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
  queryAftermarketOrderPageList(params,types=1){
    // returnProductStatus  1申请中 2已同意 3拒绝 4完成 5关闭 6超时

    // getReturnProductType 1退款 2退货 3退货 

    API.afterSaleList(params).then((res) => {
      let lists = this.data.lists
      let datas = res.data || {}
      console.log(datas.totalPage)
      if (datas.totalPage > 0){
        datas.list.forEach((item)=>{
          item.imgUrl = item.specImg
          item.icon = this.data.typeArr[item.type].icon
          item.typeName = this.data.typeArr[item.type].name
          item.typeState = this.data.typeState[item.status]
          item.price = item.unitPrice
          item.num = item.refundNum
        })
        if (!Tool.isEmptyStr(this.data.keyword)){
          lists=[]
        }
        this.setData({
          lists: lists.concat(datas.list),
          totalPage: datas.totalPage || 0,
        })
      }
      else{
        this.setData({
          tipVal:2
        })
      }
    }).catch((res) => {
      console.log(res)
    });
  },
  goPage(e){
    let serviceNo = e.currentTarget.dataset.prdid
    let returnProductType = e.currentTarget.dataset.id
    let page = this.data.typeArr[returnProductType].page + "?serviceNo=" + serviceNo
    Tool.navigateTo(page)
  }
})