let { Tool,Storage, API } = global
const app = getApp()
Page({
  data: {
    assist: false,
    fav: true,
    activeIndex: 1,
    details: {}
  },
  onLoad: function (options) {
    this.setData({
      articleId: options.articleId || '',
      articleCode: options.articleCode || '',
    })
    app.shareClick(options.inviteId);
    
    Tool.isIPhoneX(this);
    this.getArticleDetail();
  },
  onReady() {

  },
  onHide() {

  },
  onUnload() {

  },
  getArticleDetail() { // 获取文章详情
    let reqUrl = this.data.articleCode? 'getDiscoverByCode':'getDiscoverById'
    API[reqUrl]({
      id: this.data.articleId,
      code:this.data.articleCode,
    }).then((res) => {
      let data = res.data || {};
      let WxParse = require('../../../libs/wxParse/wxParse.js');
      WxParse.wxParse('content', 'html', data.content|| '', this, 0);
      this.setData({
        details: data
      })
    }).catch((res) => {
      console.log(res)
    });
  },
  sliderChange(e) {
    this.setData({
      activeIndex: e.detail.current + 1
    })
  },
  toggleDiscoverLikeCollect(e) { // 点赞收藏操作
    let data = e.currentTarget.dataset;
    let typeVal = data.type;
    let params = {
      type: data.type,//1.收藏 2.点赞
      articleIds: [data.id],
      articleId: data.id,
    }
    // status为ture说明已经操作过了  所以要调取消接口
    let reqUrl = data.status ? 'discoverCountCancel' : 'discoverCountSave'
    API[reqUrl](params).then((res) => {
      let data = res.data || {};
      let _details = this.data.details;
      // this.setData({
      //   "details.hadLike": typeVal == 2 ? !_details.hadLike : _details.hadLike,
      //   "details.hadCollect": typeVal == 1 ? !_details.hadCollect : _details.hadCollect,
      // })
      this.getArticleDetail()
    }).catch((res) => {
      console.log(res)
    });
  },
  showItemDetail(e) {
    let productId = e.currentTarget.dataset.id;
    Tool.navigateTo('/pages/product-detail/product-detail?prodCode=' + productId);
  },
  onShareAppMessage() {
    return ({
      title: this.data.details.title,
      path: `pages/discover/discover-detail/discover-detail?articleId=${this.data.articleId}`,
      imageUrl: this.data.details.img
    });
  }
})