//index.js
//获取应用实例
const app = getApp()
import { levelName, pages} from '../../tools/common.js'
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
      redirectTo:pages,
      iconArr:[ // icon 图标
        { name: '分享', img: 'home_icon__fenxing_nor@3x.png', page:'/pages/topic/topic?code=ZT2018000019'},
        { name: '秀场', img: 'home_icon_xiuchang_nor@3x.png', page: '/pages/discover/discover',tabbar:true},
        { name: '签到', img: 'home_icon_qiangdao_nor@3x.png', page: '/pages/signIn/signIn',login:true },
        { name: '必看', img: 'home_icon_bikan_nor@3x.png', page: '/pages/discover/discover-detail/discover-detail?articleId=10'},
        { name: '秒杀', img: 'home_icon_miaoshao_nor@3x.png', page: '/pages/topic/topic?code=ZT2018000012'},
      ],
      levelName: levelName,
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
      isChange:true,
      noticeLabel: ['', '精选', '热门','推荐','最新'],
      isShowNotice:false, // 是否展示公告
      hasTask: false,
      showCard: false, // 任务领取窗口展示
      isScroll: false,
      downPriceParam:{
        1: 'startPrice',
        2: 'markdownPrice',
        3: 'markdownPrice',
        4: 'markdownPrice',
        5: 'markdownPrice'
      },
      taskDetail:{},
      width:0
    },
    close() {
      this.toggleCardShow();
    },
    toggleCardShow() {
      if(this.data.isScroll) {
        this.setData({
          isScroll: false
        })
        return;
      }
      this.setData({
        showCard: !this.data.showCard
      })
    },
    findUserJobsByUserId() {
      let params = {
        url: Operation.findUserJobsByUserId,
        requestMethod: 'GET'
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let data = req.responseObject.data || {};
        
        data.receiveFlag &&
        this.setData({
          taskDetail: data,
          hasTask: data.receiveFlag
        })
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    getJob() {
      let params = {
        url: Operation.addJobs
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let data = req.responseObject.data || {};
        Tool.navigateTo(`/pages/my/task/task-detail/task-detail?jobId=${data.jobId}&status=1&id=${data.id}`)
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    // 滚动的时候任务要缩进去
    onPageScroll(e){
      // 这里加个判断 如果没任务的话也return
      let changeBg = this.data.changeBg
      let change = this.data.changeBg
      if (e.scrollTop>160){
        changeBg=true
      }else{
        changeBg = false
      }
      this.setData({
        changeBg:changeBg
      })
      if (change != this.data.changeBg){
        this.selectComponent('#topBarImg').getBaseUrl();
      }
      if (this.data.isScroll) return;  
      this.setData({
        isScroll: true,
      })
    },
    onLoad: function (options) {
      Event.on('getLevel', this.getLevel,this)
      Event.on('didLogin', this.didLogin, this); 
      // 初始化请求
      this.initRequset(options)
      // 初始化传参
      this.initOptions(options)
      this.setData({
        options: options
      })
    },
    onPullDownRefresh: function () {
      this.onLoad(this.data.options)
      wx.stopPullDownRefresh();
    },
    initOptions(options){
      // 分享过来有邀请者id的那么存储在本地 当天有效 次日失效
      if (options.inviteId != 'null' && options.inviteId != 'undefined' && options.inviteId) {
        Storage.setUpUserId({
          date: new Date().toLocaleDateString(),
          id: options.inviteId
        })
      }
      if (options.type) { // 页面跳转
        Tool.navigateTo(this.data.redirectTo[options.type] + options.id)
      }
      
    },
    initRequset(){
      this.queryAdList(1, '轮播图片', (datas) => {
        this.setData({
          imgUrls: datas
        })
      });
      this.queryAdList(2, '推荐位', (datas) => {
        this.setData({
          adArr: datas
        })
      });
      this.queryAdList(4, '今日榜单', (datas) => {
        this.setData({
          todayList: datas
        })
      });
      this.queryAdList(5, '精品推荐', (datas) => {
        this.setData({
          fineQuality: datas
        })
      });
      this.queryAdList(6, '超值热卖', (datas) => {
        datas.forEach((item, index) => {
          let topicBannerProductDTOList = item.topicBannerProductDTOList || []
          topicBannerProductDTOList.forEach((item0, index0) => {
            if (item0.productType === 2) {
              item0.showPrice = item0[this.data.downPriceParam[item0.status]]
            }
            else if (item0.productType === 1) {
              item0.showPrice = item0.seckillPrice
            }
            else {
              item0.showPrice = item0.originalPrice
            }
          })
        })
        this.setData({
          hotSale: datas
        })
      });
      this.queryFeaturedList()
      // this.indexQueryCategoryList()
    },
    onUnload(){
      Storage.setUpUserId(null)
    },
    goPages(e){
      let index = e.currentTarget.dataset.index
      let page = this.data.iconArr[index].page
      let isTab = this.data.iconArr[index].tabbar
      if(index<5){
        if (this.data.iconArr[index].login) {
          let callBack = ''
          this.getIsLogin(callBack = () => { Tool.navigateTo(page) })
          return
        }
      } else if(index<9){
        page ='/pages/search/search-result/search-result?keyword='+this.data.iconArr[index].name
      } else if(index==9){
        page ='/pages/product-classification/product-classification'
      }
      if (page) {
        if (isTab){
          Tool.switchTab(page)
        }else{
          Tool.navigateTo(page)
        } 
      }
      
    },
    imageLoad(e){
      Tool.getAdaptHeight(e, this)
    },
    didLogin() {
      Tool.didLogin(this)
      if (this.data.didLogin){
        this.findUserJobsByUserId();
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
      //Tool.showErrMsg(r)
      r.addToQueue();
    },
    discoverNotice() {
      if (!this.data.isChange) return
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
        // this.getLevelInfos()
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
        let userInfos = this.data.userInfos
        let levelId = userInfos.levelId
        // let levelId = 1
        let userExp = userInfos.experience
        // let userExp = 1300
        let levelObj = datas.filter((item) =>{
          return item.id == levelId
        }) 
        let index = datas.indexOf(levelObj[0])
        // 下一等级
        let nextLevel = datas[index+1]
        // 当前等级
        let preLevel = datas[index]
        let width = 0
        // 是否升级
        let isUpdateLevel = !(userExp > nextLevel.upgradeExp)
        userExp = userExp > nextLevel.upgradeExp? nextLevel.upgradeExp : userExp
        if(index==0){
          let Denominator = isUpdateLevel ? userExp / nextLevel.upgradeExp : userExp / nextLevel.upgradeExp - 0.01
          width = Denominator  * (1 / (datas.length - 2))
        } else if (index==datas.length-1){
          width =1 
        } else {
          let Denominator = isUpdateLevel ? (userExp - preLevel.upgradeExp) / (nextLevel.upgradeExp - preLevel.upgradeExp) : (userExp - preLevel.upgradeExp) / (nextLevel.upgradeExp - preLevel.upgradeExp) - 0.01
          width = index / (datas.length - 2) + Denominator * (1 / (datas.length - 2))
        }
        this.setData({
          levelList:datas,
          width: width*100
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
          let list = datas.data || []
          list.forEach((item,index)=>{

          })
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
      Tool.navigateTo('/pages/my/my-account/deposit/deposit')
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
    isShowNotice(){
      this.setData({
        isShowNotice: !this.data.isShowNotice
      })
    },
    onUnload: function () {
      Event.off('didLogin', this.didLogin);
      // Event.off('getLevel', this.getLevel)
    },
    onShow:function (){
      this.setData({
        isChange:true
      })
      // this.discoverNotice()
    },
    onHide: function () {
      this.setData({
        isChange:false
      })
    }
})
