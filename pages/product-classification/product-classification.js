let { Tool, RequestFactory, Event, Storage, Operation } = global;
Page({
  data: {
    leftBarLists:[
    ],
    activeIndex:0,
    pageArr: [ // 1.链接产品2.链接专题3.降价拍4.秒杀5.礼包 6.外链
      '其他',
      '/pages/product-detail/product-detail?prodCode=',
      '/pages/topic/topic?code=',
      '/pages/product-detail/discount-detail/discount-detail?code=',
      '/pages/product-detail/seckill-detail/seckill-detail?code=',
      '/pages/product-detail/gift-bag-detail/gift-bag-detail?giftBagId=',
    ],
  },
  onLoad: function (options) {
    this.findNameList()
    this.findHotList()
  },
  search(){
    Tool.navigateTo('/pages/search/search?door=0')
  },
  leftBarClicked(e){
    let index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.id
    this.setData({
      activeIndex:index
    })
    if(id=='hot'){
      this.findHotList()
    } else {
      this.findProductCategoryList(id)
    }
  },
  itemClicked(e){
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    Tool.navigateTo('/pages/search/search-result/search-result?keyword=' + name +"&categoryId="+id)
  },
  findProductCategoryList(id) {
    let params = {
      id:id,
      isShowLoading: false,
      reqName: '获取二、三级列表',
      requestMethod: 'GET',
      url: Operation.findProductCategoryList
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let datas = req.responseObject.data || []
       this.setData({
         content:datas
       })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  adClicked(e){
    let linkType = e.currentTarget.dataset.linktype
    let code = e.currentTarget.dataset.code
    if (linkType == 6) {
      Tool.showAlert("跳转链接等待H5页面域名确认")
      return
    }
    let page = this.data.pageArr[linkType] + code;
    Tool.navigateTo(page)
  },
  findNameList() {
    let params = {
      reqName: '一级分类列表',
      url: Operation.findNameList
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let datas = req.responseObject.data || []
      datas.forEach((item,indx)=>{
        if(item.name.length>4){
          item.name = item.name.slice(0,4)+'...'
        }
      })
      datas.unshift({
        id: 'hot', name: "为你推荐"
      })
      this.setData({
        leftBarLists: datas
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  findHotList() {
    let params = {
      isShowLoading: false,
      reqName: '热门分类列表',
      url: Operation.findHotList
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let datas = req.responseObject.data || []
      let content = []
      content = [{
        name:"为你推荐",
        productCategoryList: datas.productCategoryList
      }]
      this.setData({
        content: {
          img: datas.img || '',
          linkType:datas.linkType || 0,
          linkTypeCode: datas.linkTypeCode || 0,
          productCategoryList: content
        }
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
})