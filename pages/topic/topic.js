let { Tool, RequestFactory, Operation, Storage } = global;
Page({
  data: {
    topicImgUrl:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
    topicTemplateId:5, // 模板id 
    isShowBar:false,//是否显示导航
    topicInfos:{}, //专题信息
    topicDetailList:[], //专题产品信息
    topicList: [], // 专题列表信息
    currentTopicListIndex: 1, // 当前tab位置展示的产品列表信息
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    
  },
  onLoad: function (options) {
    // this.setData({
    //   id: options.id
    // })
    
    // this.getTopicDetail(options.id)

    this.getTopicByCode(options.code || 'ZT20180002');
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
    r.successBlock = (req) => {
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
  },
  // 获取专题信息列表
  getTopicByCode(topicCode) {
      let params = {
        code: topicCode,
        reqName: '获取专题列表',
        url: Operation.getTopicById,
        requestMethod: 'GET'
      };

      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let data = req.responseObject.data;
        console.log(data);
        // 设置专题标题
        wx.setNavigationBarTitle({
          title: data.name
        })
        this.setData({
          topicList: data,
          currentTopicListIndex: data.topicNavbarList.length >> 1 // 这里取了个中位数，可能接口会提供
        })
      };
      Tool.showErrMsg(r)
      r.addToQueue();
  },

  // 是否设置商品提醒
  toggleSubscribeItem(e) {
    let userInfo = Storage.getUserAccountInfo();

    const data = e.currentTarget.dataset;
    console.log(data);

    let type = data.type,
        itemIndex = data.index;

    let params = {
      reqName: '订阅提醒',
      url: Operation.addActivitySubscribe,
      activityId: 1,
      activityType: 1, //activityType  '活动类型 1.秒杀 2.降价拍 3.优惠套餐 4.助力免费领 5.支付有礼 6满减送 7刮刮乐',
      type: type, // 1订阅 0 取消订阅
      userId: userInfo.id
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let data = req.responseObject || {};
      let items = this.data.topicDetailList;
      //是否通知值为0or1
      items[itemIndex].notify = +!items[itemIndex].notify;
      
      this.setData({
        topicDetailList: items
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  //切换专题活动tab
  changeTopicTabIndex(e) {
    const data = e.currentTarget.dataset;
    let tabIndex = data.index;
    this.setData({
      currentTopicListIndex: tabIndex
    })
  }
})