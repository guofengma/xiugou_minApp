//index.js
//获取应用实例
const app = getApp()

let { Tool, RequestFactory, Event, Storage, Operation} = global;

Page({
    data: {
        imgUrls: [
          'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
          'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
        ],
        url: 'https://dnlcrm.oss-cn-beijing.aliyuncs.com/xcx/',
    },
    onLoad: function () {
      // this.queryAdList();
      // this.querySpeList();
      // this.queryFeaturedList()
      Event.on('didLogin', this.didLogin, this);
    },
    goPages(){
      Tool.navigateTo("/pages/product-classification/product-classification")
    },
    imageLoad(e){
      Tool.getAdaptHeight(e, this)
    },
    didLogin() {
      Tool.didLogin(this)
    },
    queryAdList() {
      let params = {
        pageType: 1,
        type: 1,
        reqName: '轮播图查询',
        url: Operation.queryAdList,
        hasCookie: false
      }
      let r = RequestFactory.wxRequest(params);
        r.successBlock = (req) => {
            this.setData({
                imgUrls: req.responseObject.data
            })
        };
        Tool.showErrMsg(r)
        r.addToQueue();
    },
    querySpeList() {
      let params = {
        pageType: 1,
        type: 1,
        reqName: '专题查询',
        url: Operation.queryAdList
      }
      let r = RequestFactory.wxRequest(params);
        r.successBlock = (req) => {
            this.setData({
                topicImgUrl: req.responseObject.data
            })
        };
        Tool.showErrMsg(r)
        r.addToQueue();
    },
    adListClicked(e) {
        let adType = e.currentTarget.dataset.type;
        let val = e.currentTarget.dataset.val;
        let page = '';
        if (adType == 1) {
          page = '/pages/product-detail/product-detail?prodCode=' + val
        } else if (adType == 2) {
          page = '/pages/topic/topic?id=' + val
        }
        Tool.navigateTo(page)
        
    },
    queryFeaturedList() {
      let params = {
        linkType: 1,
        pageType: 1,
        reqName: '获取推荐产品',
        url: Operation.queryFeaturedList
      }
      let r = RequestFactory.wxRequest(params);
        r.successBlock = (req) => {
            let data = req.responseObject.data ? req.responseObject.data : []
            this.setData({
                recommendImgUrl: req.responseObject.data
            })
        };
        Tool.showErrMsg(r)
        r.addToQueue();
    },
    searchClicked() {
      Tool.navigateTo('/pages/search/search?door=0')
    },
    msgClicked() {
      let cookie = Storage.getUserCookie() || ''
      if (!this.data.didLogin && !cookie ) {
        Tool.navigateTo('/pages/login/login-wx/login-wx?isBack=' + true)
        return
      }
      Tool.navigateTo('/pages/my/information/information')
    },
    topicClicked(e){
      let id = e.currentTarget.dataset.id
      Tool.navigateTo('/pages/topic/topic?id='+id)
    },
    onUnload: function () {
      Event.off('didLogin', this.didLogin);
    },
    onShow:function (){

    }
})
