let { Tool, RequestFactory, Storage, Event, Operation } = global
Page({
  data: {
    assist: false,
    fav: true,
    activeIndex: 1,
    details: {}
  },
  onLoad: function (options) {
    let articleId = options.articleId;
    this.setData({
      articleId: articleId
    })
    console.log(this.data)
    this.getArticleDetail();
    
  },
  onReady() {

  },
  onShow() {

  },
  onHide() {

  },
  onUnload() {

  },
  getArticleDetail() {
    let params = {
      id: this.data.articleId,
      url: Operation.getDiscoverById,
      requestMethod: 'GET',
      reqName: '获取文章详情'
    }
    let _ = this;    
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let data = req.responseObject.data || {};
      console.log(data);
      let WxParse = require('../../../libs/wxParse/wxParse.js');
      WxParse.wxParse('content', 'html', data.content, _, 0);
      this.setData({
        details: data
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  sliderChange(e) {
    this.setData({
      activeIndex: e.detail.current + 1
    })
  },
  toggleDiscoverLikeCollect(e) {
    let data = e.currentTarget.dataset;
    let type = data.type;
    let params = {
      type: type,//1.收藏 2.点赞
      articleIds: [data.id],
      articleId: data.id,
      reqName: '点赞收藏操作',
      // status为ture说明已经操作过了  所以要调取消接口
      url: data.status ? Operation.discoverCountCancel : Operation.discoveerCountSave
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let data = req.responseObject.data || {};
      let _details = this.data.details;
      this.setData({
        "details.hadLike": type == 2 ? !_details.hadLike : _details.hadLike,
        "details.hadCollect": type == 1 ? !_details.hadCollect : _details.hadCollect,
      })
      // this.getArticleDetail()
    };
    Tool.showErrMsg(r)
    r.addToQueue();
    
  }
})