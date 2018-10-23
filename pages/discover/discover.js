let { Tool, RequestFactory, Operation } = global
Page({
  data: {
    tabIndex: 0,
    discoverData: {},
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    showEdit: false,
    swipers: [],// 广告轮播
    assist: [],//精选
    hot:[], //热门
    topic: [],//推荐
    discover: [],//最新发现
  },

  onLoad (options) {
    // 1：精选 2：热门 3：推荐 4：最新
    this.getDiscoverSwiper();
    this.getDiscoveryByType(1);
    this.getDiscoveryByType(2);
    this.getDiscoveryByType(3);
    this.getDiscoveryByType(4);
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
    this.getDiscoveryByType(type);
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
      console.log(data);
      this.setData({
        swipers: data
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  // 获取发现相关数据
  getDiscoveryByType(type) {
    let params = {
      generalize: type,
      url: Operation.queryDiscoverListByType,
      requestMethod: 'GET',
      reqName: '获取发现'
    };
    const typeList = {
      1: 'assist',
      2: 'hot',
      3: 'topic',
      4: 'discover'
    }
    let obj = {};
    
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let data = req.responseObject.data || {};
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
  }
})