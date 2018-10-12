let { Tool, RequestFactory, Event, Storage, Operation } = global;
Page({
  data: {
    leftBarLists:[
    ],
    activeIndex:0
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
  findNameList() {
    let params = {
      reqName: '一级分类列表',
      url: Operation.findNameList
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let datas = req.responseObject.data || []
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
          imgList: datas.imgList,
          productCategoryList: content
        }
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
})