let { Tool, RequestFactory, Operation } = global
Page({
  data: {
    tabIndex: 0,
    discoverData: {},
    typeList: {
      1: 'assist',
      2: 'hot',
      3: 'topic',
      4: 'discover'
    },
    showEdit: false,
    swipers: [],// 广告轮播
    assist: [],//精选
    hot:[], //热门
    topic: [],//推荐
    discover: [],//最新发现
    currentTopicPage: 1,
    totalTopicPage: null,
    currentDiscoverPage: 1,
    totalDiscoverPage: null,
    showBackTop: false,
  },

  onLoad (options) {
    // 1：精选 2：热门 3：推荐 4：最新
    this.getDiscoverSwiper();
    this.getDiscoveryByType(1,1);
    this.getDiscoveryByType(2,1);
    this.getDiscoveryByType(3,1, (data) => {
      let topic = this.data.topic;
      this.setData({
        topic: topic.concat(data.data),
        currentTopicPage: data.currentPage,
        totalTopicPage: data.totalPage,
      })
    });
    this.getDiscoveryByType(4, 1, (data) => {
      let discover = this.data.discover;
      this.setData({
        discover: discover.concat(data.data),
        currentDiscoverPage: data.currentPage,
        totalDiscoverPage: data.totalPage,
      })
    });
  },
  onReady() {

  },
  onShow() {

  },
  onHide() {

  },
  onUnload() {

  },
  onReachBottom() {
    let type = this.data.tabIndex == 0 ? 3 : 4;
    let localData = this.data;
    if(
      (type == 3 && localData.currentTopicPage == localData.totalTopicPage) || 
      (type == 4 && localData.currentDiscoverPage == localData.totalDiscoverPage)
    ){
        return;
    }
    type == 3 &&
      this.getDiscoveryByType(3, localData.currentTopicPage + 1, (data) => {
      let topic = this.data.topic;
      this.setData({
        topic: topic.concat(data.data),
        currentTopicPage: data.currentPage,
        totalTopicPage: data.totalPage,
      })
    });
    type == 4 && 
      this.getDiscoveryByType(4, localData.currentDiscoverPage + 1 , (data) => {
      let discover = this.data.discover;
      this.setData({
        discover: discover.concat(data.data),
        currentDiscoverPage: data.currentPage,
        totalDiscoverPage: data.totalPage,
      })
    });
  },
  onPageScroll(e) {
    let flag = false;
    if (e.scrollTop > 200) {
      flag = true;
    }
    this.setData({
      showBackTop: flag
    })
  },
  // 返回顶部
  goTop() {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  handleItemClicked(e){
    let articleId = e.currentTarget.dataset.id;
    Tool.navigateTo('/pages/discover/discover-detail/discover-detail?articleId=' + articleId)
  },
  // 获取发现轮播广告
  getDiscoverSwiper() {
    let params = {
      'type': 11,
      reqName: '获取发现轮播广告',
      url: Operation.queryAdList,
      // hasCookie: false
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let data = req.responseObject.data || {};
      
      this.setData({
        swipers: data
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  // 获取发现相关数据
  getDiscoveryByType(type, page = 1, callback) {
    let params = {
      generalize: type,
      page: page,
      size: 20, //默认20
      url: Operation.queryDiscoverListByType,
      requestMethod: 'GET',
      reqName: '获取发现'
    };
    const typeList = this.data.typeList;
    let obj = {};
    
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let data = req.responseObject.data || {};
      if (typeof callback == 'function'){
        callback(data);
        return;
      }
      obj[typeList[type]] = data.data;
      this.setData(obj)
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  changeTabIndex(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      tabIndex: index
    })
  },
  handleSwiperClick(e) {
    let code = e.currentTarget.dataset.code;
    Tool.navigateTo('/pages/product-detail/product-detail?prodCode=' + code);
  }
})