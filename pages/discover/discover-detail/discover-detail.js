let { Tool, RequestFactory, Storage, Event, Operation } = global
Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    assist: false,
    fav: true,
    activeIndex: 1,
    details: {
      // "id": 22,
      // "code": "FX181022000009",
      // "title": "002",
      // "coverImg": "https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/show_item.png",
      // "img": "https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/show_list.png",
      // "generalize": 3,
      // "categoryId": 3,
      // "userId": 56,
      // "click": null,
      // "createAdminId": 8,
      // "updateId": 8,
      // "updateTime": 1540194055000,
      // "createTime": 1540193563000,
      // "content": "<p>211231321313</p><p><img src=\"https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/show_item.png\"></p>",
      // "likeCount": 110,
      // "collectCount": 1,
      // "hadLike": false,
      // "hadCollect": true,
      // "products": null
    }
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