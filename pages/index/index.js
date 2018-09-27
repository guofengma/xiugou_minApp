//index.js
//获取应用实例
const app = getApp()

let { Tool, RequestFactory, Event, Storage, Operation} = global;

Page({
    data: {
        imgUrls: [ // 轮播
          'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
          'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
        ],
        url: 'https://dnlcrm.oss-cn-beijing.aliyuncs.com/xcx/',
        iconArr:[ // icon 图标
          { name: '赚钱', icon:'home-icon-xueyuan.png',page:''},
          { name: '省钱', icon: 'home_icon_shengqian.png', page: '' },
          { name: '分享', icon: 'home_icon_share.png', page: '' },
          { name: '学院', icon: 'home-icon-xueyuan.png', page: ''},
          { name: '促销', icon: 'home_icon_chuxiao.png', page: ''},
          { name: '手机相机', icon: 'iconForobtain.png', page: '' },
          { name: '电脑家电', icon: 'iconForobtain.png', page: '' },
          { name: '品质男装', icon: 'iconForobtain.png', page: ''},
          { name: '美妆个护', icon: 'iconForobtain.png', page: '' },
          { name: '全部分类', icon: 'iconForobtain.png', page: '/pages/product-classification/product-classification' }
        ],
        adArr:[ // 广告位
          { imgUrl:"iconForobtain.png"},
          { imgUrl: "iconForobtain.png" },
          { imgUrl: "iconForobtain.png" }
        ],
        noticeArr:[ // 头条
          {content:'1手机号大手大脚熬枯受淡卡萨丁阖家安康三打哈科技收到货阿克苏较好的卡仕达'},
          { content: '2手机号大手大脚熬枯受淡卡萨丁阖家安康三打哈科技收到货阿克苏较好的卡仕达' },
          { content: '3手机号大手大脚熬枯受淡卡萨丁阖家安康三打哈科技收到货阿克苏较好的卡仕达' },
          { content: '4手机号大手大脚熬枯受淡卡萨丁阖家安康三打哈科技收到货阿克苏较好的卡仕达' },
          { content: '5手机号大手大脚熬枯受淡卡萨丁阖家安康三打哈科技收到货阿克苏较好的卡仕达' },
        ]
    },
    onLoad: function () {
      // this.queryAdList();
      // this.querySpeList();
      // this.queryFeaturedList()
      this.setData({
        noticeArr:Tool.sliceArray(this.data.noticeArr,2)
      })
      if (!app.globalData.systemInfo){
        app.getSystemInfo()
      }
      app.wxLogin()
      Event.on('didLogin', this.didLogin, this);
    },
    goPages(e){
      let index = e.currentTarget.dataset.index
      let page = this.data.iconArr[index].page
      if(page){
        Tool.navigateTo(page)
      }
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
