//index.js
//获取应用实例
const app = getApp()

let { Tool, RequestFactory, Event, Storage, Operation} = global;

Page({
    data: {
      pageArr: [ // 1.链接产品2.链接专题3.降价拍4.秒杀5.礼包
        '其他',
        '/pages/product-detail/product-detail?productId=',
        '/pages/topic/topic?id=',
        '/pages/product-detail/product-detail',
        '/pages/product-detail/product-detail',
        '/pages/product-detail/gift-bag-detail/gift-bag-detail?giftBagId=',
      ],
      iconArr:[ // icon 图标
        { name: '赚钱', icon:'home-icon-xueyuan.png',page:''},
        { name: '签到', icon: 'home_icon_shengqian.png', page: '' },
        { name: '分享', icon: 'home_icon_share.png', page: '' },
        { name: '学院', icon: 'home-icon-xueyuan.png', page: ''},
        { name: '秒杀', icon: 'home_icon_chuxiao.png', page: ''},
        { name: '手机相机', icon: 'iconForobtain.png', page: '' },
        { name: '电脑家电', icon: 'iconForobtain.png', page: '' },
        { name: '品质男装', icon: 'iconForobtain.png', page: ''},
        { name: '美妆个护', icon: 'iconForobtain.png', page: '' },
        { name: '全部分类', icon: 'iconForobtain.png', page: '/pages/product-classification/product-classification' }
      ],
      imgUrls: [],// 轮播
      adArr:[],// 广告位
      starShop:[], // 明星店铺
      todayList:[], // 今日榜单
      fineQuality:[],//精品推荐
      noticeArr:[ // 头条
        {content:'1手机号大手大脚熬枯受淡卡萨丁阖家安康三打哈科技收到货阿克苏较好的卡仕达'},
        { content: '2手机号大手大脚熬枯受淡卡萨丁阖家安康三打哈科技收到货阿克苏较好的卡仕达' },
        { content: '3手机号大手大脚熬枯受淡卡萨丁阖家安康三打哈科技收到货阿克苏较好的卡仕达' },
        { content: '4手机号大手大脚熬枯受淡卡萨丁阖家安康三打哈科技收到货阿克苏较好的卡仕达' },
        { content: '5手机号大手大脚熬枯受淡卡萨丁阖家安康三打哈科技收到货阿克苏较好的卡仕达' },
      ],
      swiperList: [{//除了1，2之外，其它的swpClass都是swp-rightNo
        aurl: "../start/start",
        swpClass: "swp-center",
        time: "2018年3月下11",
        bname: "2018全球十大突破技术11",
        imgsrc: "http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg"
      }, {
        aurl: "#",
        swpClass: "swp-right",
        time: "2018年3月下22",
        bname: "2018全球十大突破技术22",
          imgsrc: "http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg"
      }, {
        aurl: "#",
        swpClass: "swp-rightNo",
        time: "2018年3月下33",
        bname: "2018全球十大突破技术33",
        imgsrc: "http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg"
      }]
    },
    onLoad: function () {
      this.queryAdList(1,'轮播图片',(datas)=>{
        this.setData({
          imgUrls:datas
        })
      });
      this.queryAdList(2, '推荐位', (datas) => {
        this.setData({
          adArr: datas
        })
      });
      this.queryAdList(3, '明星店铺推荐位', (datas) => {
        this.setData({
          starShop:datas
        })
      });
      this.queryAdList(4, '今日榜单', (datas) => {
        this.setData({
          todayList:datas
        })
      });
      this.queryAdList(5, '精品推荐', (datas) => {
        this.setData({
          fineQuality: datas
        })
      });
      this.queryAdList(6, '超值热卖', (datas) => {
        this.setData({
          hotSale:datas
        })
      });
      this.queryAdList(8, '为你推荐', (datas) => {
        this.setData({
          
        })
      });
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
  queryAdList(types = 1, reqName='',callBack=()=>{}) {
      let params = {
        'type': types,
        reqName: reqName,
        url: Operation.queryAdList,
        hasCookie: false
      }
      let r = RequestFactory.wxRequest(params);
        r.successBlock = (req) => {
          callBack(req.responseObject.data)
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
      let page = this.data.pageArr[adType]+val;
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
  /* 这里实现控制中间凸显图片的样式 */
    handleChange: function (e) {
      this.setData({
        currentIndex: e.detail.current
      })
    },
    onUnload: function () {
      Event.off('didLogin', this.didLogin);
    },
    onShow:function (){

    }
})
