let { Tool, Storage, Event, API } = global;
Page({
  data: {
    topicImgUrl:'',
    topicTemplateId: 0, // 模板id 
    isShowBar:false,//是否显示导航
    topicInfos:{}, //专题信息
    topicDetailList:[], //专题产品信息
    topicList: [], // 专题列表信息
    currentTopicListIndex: 1, // 当前tab位置展示的产品列表信息
    topicTabWidth: "", // 降价秒杀tab宽度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
  },
  onLoad: function (options) {
    this.setData({
        topicCode: options.code || ''
    });
    this.getTopicByCode();
    Event.on('tip', this.getTopicByCode, this)
    Event.on('didLogin', this.didLogin, this)
  },
  onUnload() {
    Event.off('tip', this.getTopicByCode)
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
  productClicked(e){
    let dataset = e.currentTarget.dataset;
    let id = dataset.id;
    let prdType = dataset.type;  //1秒杀 2降价拍 3礼包 4助力免费领 5专题 99普通商品
    let code = dataset.code;
    if (prdType == 99 ){
      Tool.navigateTo('/pages/product-detail/product-detail?productId=' + code + '&door=1')
    } else if (prdType==3){
      Tool.navigateTo('/pages/product-detail/gift-bag-detail/gift-bag-detail?giftBagId=' + code + '&door=1')
    } else if(prdType == 2){
      Tool.navigateTo('/pages/product-detail/discount-detail/discount-detail?code=' + code)
    } else if(prdType == 1) {
      Tool.navigateTo('/pages/product-detail/seckill-detail/seckill-detail?code=' + code)
    } else if(prdType == 5) {
      Tool.navigateTo(`/pages/topic/topic?code=${code}`);
    }
  },
  // 获取专题信息列表
  getTopicByCode() {
    let userInfo = Storage.getUserAccountInfo() || {};
    let params = {
      code: this.data.topicCode,
      userId: userInfo.code|| ""
    }
    API.getTopicById(params).then((res) => {
      let data = res.data;
      if (!data) return
      let width = '';
      wx.getSystemInfo({
        success: function (res) {
          let topicNavbarListLength = data.topicNavbarList.length;
          if (topicNavbarListLength < 0) {
            width = '0';
            return;
          }
          if (topicNavbarListLength <= 5) {
            width = (100 / topicNavbarListLength) + '%';
          } else {
            width = (res.windowWidth / 5) + 'px';
          }
        }
      })

      // 设置专题标题
      wx.setNavigationBarTitle({
        title: data.name
      })
      this.setData({
        topicList: data,
        currentTopicListIndex: data.checkIndex,//data.topicNavbarList.length >> 1, // 这里取了个中位数，可能接口会提供
        topicTabWidth: width,
        topicTemplateId: data.templateId
      })
    }).catch((res) => {
      console.log(res)
    })
  },

  // 是否设置商品提醒
  toggleSubscribeItem(e) {
    if(!this.data.didLogin){
      Tool.navigateTo('/pages/login-wx/login-wx?isBack=true')
      return
    }
    let userInfo = Storage.getUserAccountInfo() || {};

    const data = e.currentTarget.dataset;

    let typeVal = data.type,
        itemIndex = data.index;

    let params = {
      activityId: data.activityId,
      activityType: data.activityType, //activityType  '活动类型 1.秒杀 2.降价拍 3.优惠套餐 4.助力免费领 5.支付有礼 6满减送 7刮刮乐',
      type: typeVal, // 1订阅 0 取消订阅
      userId: userInfo.code || ""
    }
    API.addActivitySubscribe(params).then((res) => {
      this.getTopicByCode();
    }).catch((res) => {
      console.log(res)
    })
  },
  //切换专题活动tab
  changeTopicTabIndex(e) {
    const data = e.currentTarget.dataset;
    let tabIndex = data.index;
    this.setData({
      currentTopicListIndex: tabIndex
    })
  },
  //跳转到商品详情
  showGoodDetail(e) {
    const data = e.currentTarget.dataset;
    console.log(data);
    //data.type  '活动类型 1.秒杀 2.降价拍 3.优惠套餐 4.助力免费领 5.支付有礼 6满减送 7刮刮乐',
    // if(data.status >= 3) return;
    if(data.type == 1){
      Tool.navigateTo('/pages/product-detail/seckill-detail/seckill-detail?code='+data.code)
    } else if(data.type == 2){
      Tool.navigateTo('/pages/product-detail/discount-detail/discount-detail?code=' + data.code)
    }
  },
  didLogin() {
    Tool.didLogin(this)
  },
  onUnload: function () {
    Event.off('didLogin', this.didLogin);
  },
})