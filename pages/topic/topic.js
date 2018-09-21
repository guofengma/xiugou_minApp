let { Tool, RequestFactory, Operation } = global;
Page({
  data: {
    topicImgUrl:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
    topicTemplateId:3, // 模板id 
    isShowBar:false,//是否显示导航
    topicInfos:{}, //专题信息
    topicDetailList:[], //换题产品信息
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getTopicDetail(options.id)
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    let cur = e.target.dataset.current;
    if (this.data.currentTab == cur) {
      return false;
    }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  getTopicDetail(id){
    let params = {
      id: id,
      reqName: '获取专题详情页',
      url: Operation.getTopicDetail
    }
    let r = RequestFactory.wxRequest(params);
    // let r = RequestFactory.getTopicDetail(params);
    r.finishBlock = (req) => {
      let data = req.responseObject.data
      if (data){
        this.setData({
          topicTemplateId: data.templateId,
          topicDetailList: data.content,
          topicInfos: data
        })
      }
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  productClicked(e){
    let id = e.currentTarget.dataset.id
    let prdType = e.currentTarget.dataset.type
    if (prdType ==1 ){
      Tool.navigateTo('/pages/product-detail/product-detail?productId=' + id + '&door=1')
    } else if (prdType==2){
      Tool.navigateTo('/pages/product-detail/gift-bag-detail/gift-bag-detail?giftBagId=' + id + '&door=1')
    } else if (prdType == 3) {
      Tool.navigateTo('/pages/download-app/download-app?title='+'不能购买此产品')
    } else if (prdType == 5){
      this.getTopicDetail(id)
    }
  }
})