//index.js
//获取应用实例
const app = getApp()

let { Tool, RequestFactory, Event, Storage, Operation} = global;

Page({
    data: {
      pageArr: [ // 1.链接产品2.链接专题3.降价拍4.秒杀5.礼包
        '其他',
        '/pages/product-detail/product-detail?prodCode=',
        '/pages/topic/topic?code=',
        '/pages/product-detail/discount-detail/discount-detail?code=',
        '/pages/product-detail/seckill-detail/seckill-detail?code=',
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
        { content:'1手机号大手大脚熬枯受淡卡萨丁阖家安康三打哈科技收到货阿克苏较好的卡仕达'},
        { content: '2手机号大手大脚熬枯受淡卡萨丁阖家安康三打哈科技收到货阿克苏较好的卡仕达' },
        { content: '3手机号大手大脚熬枯受淡卡萨丁阖家安康三打哈科技收到货阿克苏较好的卡仕达' },
        { content: '4手机号大手大脚熬枯受淡卡萨丁阖家安康三打哈科技收到货阿克苏较好的卡仕达' },
        { content: '5手机号大手大脚熬枯受淡卡萨丁阖家安康三打哈科技收到货阿克苏较好的卡仕达' },
      ],
      recommendArr:[],
      params:{
        page:1,
        pageSize:10
      }
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
      this.queryFeaturedList()
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
      if (this.data.didLogin){
        this.getLevelInfos()
      }
    },
    getLevelInfos(){
      let params = {
        requestMethod: 'GET',
        url: Operation.getLevelInfos,
        hasCookie: false
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        
      };
      Tool.showErrMsg(r)
      r.addToQueue();
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
    adListClicked(e) {
      let adType = e.currentTarget.dataset.type;
      let val = e.currentTarget.dataset.val;
      let prodtype = e.currentTarget.dataset.prodtype
      if (prodtype == 1){
        adType= 4
      } else if (prodtype == 2){
        adType = 3
      } else if (prodtype == 3){
        adType = 5
      } else if (prodtype == 5){
        adType = 2
      } else if (prodtype == 99){
        adType =1
      }
      let page = this.data.pageArr[adType]+val;
      Tool.navigateTo(page)
    },
    queryFeaturedList() {
      let params = {
        ...this.data.params,
        reqName: '获取推荐产品',
        url: Operation.queryFeaturedList
      }
      let r = RequestFactory.wxRequest(params);
        r.successBlock = (req) => {
          let datas = req.responseObject.data
          this.setData({
            recommendArr: this.data.recommendArr.concat(datas.data),
            recommendTotalPage: datas.totalPage,
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
        Tool.navigateTo('/pages/login-wx/login-wx?isBack=' + true)
        return
      }
      Tool.navigateTo('/pages/my/information/information')
    },
    topicClicked(e){
      let id = e.currentTarget.dataset.id
      Tool.navigateTo('/pages/topic/topic?id='+id)
    },
    onReachBottom() {
      this.data.params.page++;
      if (this.data.params.page>this.data.recommendTotalPage){
        return
      }
      this.setData({
        params: this.data.params,
      })
      this.queryFeaturedList()
    },
    onUnload: function () {
      Event.off('didLogin', this.didLogin);
    },
    onShow:function (){

    }
})
