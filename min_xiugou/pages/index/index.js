//index.js
//获取应用实例
const app = getApp()
import {pages,adsensePage} from '../../tools/common.js'
let {Tool, Event, Storage, API} = global;

Page({
    data: {
        pageArr: adsensePage,
        redirectTo: pages,
        iconArr: [ // icon 图标
            {name: '分享', img: 'home_icon_fenxing_nor@3x.png', page: '/pages/topic/topic?code=ZT2018000001'},
            {name: '秀场', img: 'home_icon_xiuchang_nor@3x.png', page: '/pages/discover/discover', tabbar: true},
            {name: '签到', img: 'home_icon_qiangdao_nor@3x.png', page: '/pages/signIn/signIn', login: true},
            {name: '必看', img: 'home_icon_bikan_nor@3x.png', page: '/pages/discover/discover-detail/discover-detail?articleId=1'},
            {name: '秒杀', img: 'home_icon_miaoshao_nor@3x.png', page: '/pages/topic/topic?code=ZT2018000002'},
        ],
        imgUrls: [],// 轮播
        adArr: [],// 广告位
        starShop: [], // 明星店铺
        todayList: [], // 今日榜单
        fineQuality: [],//精品推荐
        noticeArr: [],// 头条
        recommendArr: [],
        params: {
            page: 1,
            pageSize: 10
        },
        isChange: true,
        noticeLabel: ['', '精选', '热门', '推荐', '最新'],
        isShowNotice: false, // 是否展示公告
        hasTask: false,
        showCard: false, // 任务领取窗口展示
        isScroll: false,
        downPriceParam: {
            1: 'startPrice',
            2: 'markdownPrice',
            3: 'markdownPrice',
            4: 'markdownPrice',
            5: 'markdownPrice'
        },
        taskDetail: {},
        width: 0,
        isShowCoupon: false,// 优惠卷弹窗
        couponList: [
            '',// 没有礼包
            "https://cdn.sharegoodsmall.com/sharegoods/resource/sg/images/package/olduser.png",//老用户 1688
            "https://cdn.sharegoodsmall.com/sharegoods/resource/sg/images/package/newuser_y.png",// 选择导师的新用户 2688
            "https://cdn.sharegoodsmall.com/sharegoods/resource/sg/images/package/newuser_n.png",// 没有选择导师的新用户 666
        ]
    },
    close() {
        this.toggleCardShow();
    },
    toggleCardShow() {
        if (this.data.isScroll) {
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
        API.findUserJobsByUserId({}).then((res) => {
            let data = res.data || {};

            data.receiveFlag &&
            this.setData({
                taskDetail: data,
                hasTask: data.receiveFlag
            })
        }).catch((res) => {
            console.log(res)
        })
    },
    getJob() {
        API.addJobs({}).then((res) => {
            let data = res.data || {}
            Tool.navigateTo(`/pages/my/task/task-detail/task-detail?jobId=${data.jobId}&status=1&id=${data.id}`)
        }).catch((res) => {
            console.log(res)
        })
    },
    // 滚动的时候任务要缩进去
    onPageScroll(e){
        // 这里加个判断 如果没任务的话也return
        let changeBg = this.data.changeBg
        if (e.scrollTop > 160) {
            changeBg = true
        } else {
            changeBg = false
        }
        this.setData({
            changeBg: changeBg
        })
        if (this.data.isScroll) return;
        this.setData({
            isScroll: true,
        })
    },
    onLoad: function (options) {
        Event.on('didLogin', this.didLogin, this);
        if (!Storage.getFirstRegistration()) {
            this.selectComponent("#notice").getNotice()
        }
        // 初始化请求
        this.initRequset(options)
        // 初始化传参
        this.initOptions(options)
        this.setData({
            options: options
        })
    },
    onPullDownRefresh: function () {
        this.setData({
            imgUrls: [],// 轮播
            adArr: [],// 广告位
            starShop: [], // 明星店铺
            todayList: [], // 今日榜单
            fineQuality: [],//精品推荐
            noticeArr: [],// 头条
            recommendArr: [],
            params: {
                page: 1,
                pageSize: 10
            }
        })
        this.didLogin()
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
            //1、产品详情(1,2,101) 2、邀请注册(101) 3、秀场分享(在分享页面那边处理了) 4、拼店分享(暂无): 点击增加经验
            if ([1, 2, 99, 101].includes(parseInt(options.type))) {
                app.shareClick(options.inviteId);
            }
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
        if (index < 5) {
            if (this.data.iconArr[index].login) {
                let callBack = ''
                this.getIsLogin(callBack = () => {
                    Tool.navigateTo(page)
                })
                return
            }
        } else if (index < 9) {
            page = '/pages/search/search-result/search-result?keyword=' + this.data.iconArr[index].name
        } else if (index == 9) {
            page = '/pages/product-classification/product-classification'
        }
        if (page) {
            if (isTab) {
                Tool.switchTab(page)
            } else {
                Tool.navigateTo(page)
            }
        }

    },
    imageLoad(e){
        Tool.getAdaptHeight(e, this)
    },
    didLogin() {
        Tool.didLogin(this)
        if (this.data.didLogin) {
            // this.findUserJobsByUserId();
            this.getLevel()
            this.queryPushMsg()
        }
    },
    queryPushMsg() {
        let callBack = (datas) => {
            this.setData({
                pushMsg: datas
            })
        }
        app.queryPushMsg(callBack)
    },
    indexQueryCategoryList(){
        API.indexQueryCategoryList({}).then((res) => {
            let datas = res.data || []
            this.data.iconArr.splice(5, 0, ...datas)
            this.setData({
                iconArr: this.data.iconArr
            })
        }).catch((res) => {
            console.log(res)
        });
    },
    discoverNotice() {
        if (!this.data.isChange) return
        API.discoverNotice({}).then((res) => {
            let datas = res.data || []
            this.setData({
                noticeArr: Tool.sliceArray(datas, 2)
            })
        }).catch((res) => {
            console.log(res)
        })
    },
    noticeChange(e){ // 轮播结束以后继续请求
        if (e.detail.current == this.data.noticeArr.length - 1) {
            this.discoverNotice()
        }
    },
    noticeClicked(e){
        let id = e.currentTarget.dataset.id
        Tool.navigateTo('/pages/discover/discover-detail/discover-detail?articleId=' + id)
    },
    getLevel() {
        let callBack = (datas)=> {
            this.setData({
                userInfos: datas
            })
        }
        app.getLevel(callBack)
    },
    queryAdList(types = 1, reqName = '', callBack = ()=> {
    }) {
        API.queryAdList({
            'type': types,
        }).then((res) => {
            callBack(res.data)
        }).catch((res) => {
            console.log(res)
        });
    },
    adListClicked(e) {
        let adType = e.currentTarget.dataset.type;
        let val = e.currentTarget.dataset.val;
        let prodtype = e.currentTarget.dataset.prodtype
        let index = e.currentTarget.dataset.index
        let key = e.currentTarget.dataset.key
        if (adType == 10) {
            Tool.navigateTo('/pages/web-view/web-view?webUrl='+val)
            return
        }
        let changeType = {
            1:4,
            2:3,
            3:5,
            6:6,
            99:1
        }
        if(prodtype) adType= changeType[prodtype]
        let page = this.data.pageArr[adType].page + val;
        if(adType==6&&index!==undefined&&key!==undefined){
            let topicBannerProductDTOList = this.data.hotSale[key].topicBannerProductDTOList || []
            let list = topicBannerProductDTOList[index]
            if(!list) return
            let isEend = list.endTime>list.currTime? false:true
            let isBegin = list.beginTime>list.currTime? false:true
            if(isBegin&&!isEend){
                page = this.data.pageArr[adType].page + this.data.hotSale[key].linkTypeCode+'&productCode='+val
            } else {
                page = this.data.pageArr[1].page +val
            }
        }

        if(this.data.pageArr[adType].tabbar){
            Tool.switchTab(page)
        }else {
            Tool.navigateTo(page)
        }

    },
    queryFeaturedList() {
        API.queryFeaturedList(this.data.params).then((res) => {
            let datas = res.data || {}
            let list = datas.data || []
            list.forEach((item, index) => {

            })
            this.setData({
                recommendArr: this.data.recommendArr.concat(datas.data),
                recommendTotalPage: datas.totalPage,
            })
        }).catch((res) => {
            console.log(res)
        });
    },
    searchClicked() {
        Tool.navigateTo('/pages/search/search?door=0')
    },
    msgClicked() {
        let callBack = ()=> {
            Tool.navigateTo('/pages/my/information/information')
        }
        this.getIsLogin(callBack)
    },
    getIsLogin(callBack = ()=> {
    }){
        let cookie = Storage.getToken() || ''
        if (!this.data.didLogin) {
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
        Tool.navigateTo('/pages/topic/topic?id=' + id)
    },
    onReachBottom() {
        this.data.params.page++;
        if (this.data.params.page > this.data.recommendTotalPage) {
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
    isShowCoupon() { // 展示优惠卷
        let index = Storage.getFirstRegistration()
        this.setData({
            isShowCoupon: !this.data.isShowCoupon,
            showCouponImg: this.data.couponList[index]
        })
        if (!this.data.isShowCoupon) {
            Storage.setFirstRegistration(null)
            this.selectComponent("#notice").getNotice()
        }
    },
    onUnload: function () {
        Event.off('didLogin', this.didLogin);
    },
    onShow: function () {
        this.setData({
            isChange: true
        })
        if (Storage.getFirstRegistration()) {
            this.isShowCoupon()
        }
        if (this.data.didLogin) {
            this.queryPushMsg()
        }
    },
    onHide: function () {
        this.setData({
            isChange: false
        })
    }
})
