//index.js
//获取应用实例
const app = getApp()

let { Tool, RequestFactory, Event, Storage, Operation} = global;

Page({
    data: {
      pageArr: [ // 1.链接产品2.链接专题3.降价拍4.秒杀5.礼包 6.外链
        '其他',
        '/pages/product-detail/product-detail?prodCode=',
        '/pages/topic/topic?code=',
        '/pages/product-detail/discount-detail/discount-detail?code=',
        '/pages/product-detail/seckill-detail/seckill-detail?code=',
        '/pages/product-detail/gift-bag-detail/gift-bag-detail?giftBagId=',
      ],
      iconArr:[ // icon 图标
        { name: '赚钱', img:'home-icon-xueyuan.png',page:''},
        { name: '分享', img: 'home_icon_share.png', page: '' },
        { name: '签到', img: 'home_icon_shengqian.png', page: '/pages/signIn/signIn',login:true },
        { name: '学院', img: 'home-icon-xueyuan.png', page: ''},
        { name: '秒杀', img: 'home_icon_chuxiao.png', page: ''},
        // { name: '手机相机', icon: 'iconForobtain.png', page: '' },
        // { name: '电脑家电', icon: 'iconForobtain.png', page: '' },
        // { name: '品质男装', icon: 'iconForobtain.png', page: ''},
        // { name: '美妆个护', icon: 'iconForobtain.png', page: '' },
        { name: '全部分类', img: 'iconForobtain.png', page: '/pages/product-classification/product-classification' }
      ],
      imgUrls: [],// 轮播
      adArr:[],// 广告位
      starShop:[], // 明星店铺
      todayList:[], // 今日榜单
      fineQuality:[],//精品推荐
      noticeArr:[  ],// 头条
      recommendArr:[],
      params:{
        page:1,
        pageSize:10
      },
      notice: ['', '精选', '热门','推荐','']
    },
    onLoad: function () {
      Event.on('getLevel', this.getLevel,this)
      this.discoverNotice()
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
      this.indexQueryCategoryList()
      if (!app.globalData.systemInfo){
        app.getSystemInfo()
      }
      app.wxLogin()
      Event.on('didLogin', this.didLogin, this);
    },
    goPages(e){
      let index = e.currentTarget.dataset.index
      let page = this.data.iconArr[index].page
      if (this.data.iconArr[index].login){
        let callBack =''
        this.getIsLogin(callBack = () => { Tool.navigateTo(page)})
        return
      }
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
        this.getLevel()
      }
    },
    indexQueryCategoryList(){
      let params = {
        isShowLoading: false,
        reqName: '获取首页4个分类',
        requestMethod: 'GET',
        url: Operation.indexQueryCategoryList
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let datas = req.responseObject.data || []
        this.data.iconArr.splice(5, 0, ...datas)
        this.setData({
          iconArr: this.data.iconArr
        })
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    discoverNotice() {
      let params = {
        isShowLoading: false,
        reqName: '获取秀场头条',
        requestMethod: 'GET',
        url: Operation.discoverNotice
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let datas = req.responseObject.data.data || []
        this.setData({
          noticeArr: Tool.sliceArray(datas, 2)
        })
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    noticeChange(e){ // 轮播结束以后继续请求
      if (e.detail.current==this.data.noticeArr.length-1){
        this.discoverNotice()
      }
    },
    noticeClicked(e){
      let id = e.currentTarget.dataset.id
      Tool.navigateTo('/pages/discover/discover-detail/discover-detail?articleId='+id)
    },
    getLevel() {
      let params = {
        isShowLoading: false,
        reqName: '获取用户等级',
        requestMethod: 'GET',
        url: Operation.getLevel
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        Storage.setUserAccountInfo(req.responseObject.data)
        let userInfos = req.responseObject.data 
        userInfos.experience = userInfos.experience ? userInfos.experience:0
        this.setData({
          userInfos: req.responseObject.data
        })
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    getLevelInfos(){
      let params = {
        requestMethod: 'GET',
        url: Operation.getLevelInfos,
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let datas = req.responseObject.data || []
        this.setData({
          levelList:datas
        })
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    queryAdList(types = 1, reqName='',callBack=()=>{}) {
      let params = {
        'type': types,
        reqName: reqName,
        url: Operation.queryAdList,
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
      if (adType==6){
        Tool.showAlert("跳转链接等待H5页面域名确认")
        return
      }
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
      let callBack =()=>{
        Tool.navigateTo('/pages/my/information/information')
      }
      this.getIsLogin(callBack)
    },
    getIsLogin(callBack=()=>{}){
      let cookie = Storage.getToken() || ''
      if (!this.data.didLogin && !cookie) {
        Tool.navigateTo('/pages/login-wx/login-wx?isBack=' + true)
        return
      }
      callBack()
    },
    levelBtnClicked(){
      Tool.navigateTo('/pages/my/my-promotion/my-promotion')
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
