let { Tool, API, Storage, Event} = global;
const regeneratorRuntime = require('../../../../libs/asyncRuntime/runtime.js')
Page({
    data: {
      winHeight: "",//窗口高度
      currentTab: 0, //预设当前项的值
      scrollLeft: 0, //tab标题的滚动条位置
      lists: [ // 0是未使用 1：失效 2：已使用
          [  ],
          [  ],
          [  ]
      ],
      types: {
        0:"其他",
        1:"满减劵",
        2:"抵价劵",
        3:"折扣劵",
        4:"抵扣劵" ,
        11:"靓号兑换券",
        12:"拼店券",
      },
      totalPageArr:[], //保存页数 
      params:{
        page:1,
        pageSize:10
      },
      coinData:{
        nickname:'全品类：无金额门槛',
        'type':0,
        name:'1元现金券',
        timeTips:'无时间限制',
        tips:'可叠加使用',
        isCoinCoupon:true,
        value:1,
        num:0,
        active:true,
      },
      show:false,
      coinNum:1
    },
    // 上拉加载更多
    onScroll(e) {
      let { totalPageArr, params, currentTab} = this.data
      let currentPage = params.page
      currentPage++
      let currentTotalPage = totalPageArr[currentTab]
      if (currentTotalPage < currentPage){
        return
      }
      params.page = currentPage
      this.setData({
        params: params
      })
      if (currentTab==0){
        if(this.data.door==1&&this.data.useType==2){
          this.availableDiscountCouponForProduct()
        } else {
          this.getDiscountCouponNoUse();
        }
      } else if (currentTab==1){
        this.getDiscountCouponLosed();
      } else if (currentTab == 2) {
        this.getDiscountCouponUserd();
      }
    },
    // 滚动切换标签样式
    switchTab: function (e) {
      this.setData({
        currentTab: e.detail.current
      });
      this.checkCor();
    },
    //判断当前滚动超过一屏时，设置tab标题滚动条。
    checkCor: function () {
      if (this.data.currentTab > 3) {
        this.setData({  
          scrollLeft: 300
        })
      } else {
        this.setData({
          scrollLeft: 0
        })
      }
    },
    // 点击标题切换当前页时改变样式
    swichNav(e) {
      var cur = e.target.dataset.current;
      if (this.data.currentTaB == cur) {
        return false;
      }else {
        this.setData({
          currentTab: cur,
        })
      }
    },
    getCouponType(item){
      // 优惠卷的类型
      let typeObj = this.data.types
      item.typeName = typeObj[item.type]
      item.showTypeName = item.type == 4 || item.type == 2? true:false
      item.value = item.type == 3?  Tool.mul(item.value,0.1):item.value
      item.nickname = this.getCouponTypename(item)
    },
    getCouponTypename(item) { //优惠卷的使用范围
      let products = item.products || [], cat1 = item.cat1 || [], cat2 = item.cat2 || [], cat3 = item.cat3 || [];
      let result = null;
      if (products.length) {
        if ((cat1.length || cat2.length || cat3.length)) {
          return '限商品：限指定商品可使用';
        }
        if (products.length > 1) {
          return '限商品：限指定商品可使用';
        }
        if (products.length === 1) {
          let productStr = products[0];
          if (productStr.length > 15) {
            productStr = productStr.substring(0, 15) + '...';
          }
          return `限商品：限${productStr}商品可用`;
        }
      }
      else if ((cat1.length + cat2.length + cat3.length) === 1) {
        result = [...cat1, ...cat2, ...cat3];
        return `限品类：限${result[0]}品类可用`;
      }
      else if ((cat1.length + cat2.length + cat3.length) > 1) {
        return `限品类：限指定品类商品可用`;
      } else {
        return '全品类：全场通用券';
      }
    },
    formatCouponInfos:async function(reqUrl,params, index, isActive = false, couponClassName){
      // let reqName = []
      if(params.page==1 && reqUrl!='availableDiscountCouponForProduct'){
        await this.getActiveCoupon({
          status:params.status
        })
      }
      API[reqUrl](params).then((res) => {
        let datas = res.data
        if (datas.totalPage == 0 || datas.data == null) return
        let userLevelId = this.data.userInfo.levelId
        datas.data.forEach((item, index0) => {
          item.outTime = Tool.timeStringForDateString(Tool.formatTime(item.expireTime), "YYYY.MM.DD");
          item.start_time = Tool.timeStringForDateString(Tool.formatTime(item.startTime), "YYYY.MM.DD");
          // 未使用优惠卷
          if (index == 0) {
            couponClassName = '', isActive = true
            let isNoLimitUsed = item.levels.includes(userLevelId)
            // 是否等级受限
            couponClassName = isNoLimitUsed ? couponClassName : 'coupon-right-limitLevel'
            // 是否待激活
            couponClassName = item.status == 3 ? 'coupon-right-unUsed' : couponClassName
            isActive = (!isNoLimitUsed || item.status == 3) ? false : true
          }
          item.couponClassName = couponClassName;
          item.active = isActive;
          this.getCouponType(item)
        })
        this.data.lists[index] = this.data.lists[index].concat(datas.data)
        this.data.totalPageArr[index] = datas.totalPage
        this.setData({
          lists: this.data.lists,
          totalPageArr: this.data.totalPageArr
        })
      }).catch((res) => {
        console.log(res)
      })
    },
    availableDiscountCouponForProduct(){
      let params = {
        ...this.data.params,
        ...this.data.productIds,
      }
      this.formatCouponInfos('availableDiscountCouponForProduct',params, 0, true, '')
    },
    
    //未使用
    getDiscountCouponNoUse() {
      let params = {
        ...this.data.params,
        status:0
      }
      this.formatCouponInfos('couponList',params, 0, true,'')
    },
    //已经优惠劵列表
    getDiscountCouponUserd() {
      let params = {
        ...this.data.params,
        status: 1,
      }
      this.formatCouponInfos('couponList',params, 1, false, 'coupon-right-used')
    },
    //失效优惠劵列表
    getDiscountCouponLosed() {
      let params = {
        ...this.data.params,
        status:2,
      }
      this.formatCouponInfos('couponList',params, 2, false, 'coupon-right-lose')
    },
    getActiveCoupon(params){
      API.couponListActive(params).then((res) => {
        let datas = res.data || []
        let list = []
        datas.forEach((item)=>{
          list.push({
            nickname:item.type==11? "兑换券: 靓号兑换券":"全场券: 全场通用券",
            'type':item.type,
            name:item.name,
            timeTips:'敬请期待',
            value:item.type==11? item.value:"拼店",
            num:item.type==11? "":item.number,
            active:true,
          })
        })
        this.data.lists[params.status] = [...this.data.lists[params.status],...list]
        this.setData({
          lists:this.data.lists
        })
      }).catch((res) => {
        console.log(res)
      })
    },
    //优惠券详情
    toDetail(e){
      let index = e.currentTarget.dataset.index
      let key = e.currentTarget.dataset.key
      Storage.setCoupon(this.data.lists[key][index])
      if(this.data.door==1&&key==0){
        if (this.data.useType==1) {
          this.btnClicked()
        } else {
          this.data.lists[key][index].canClick= true
          Event.emit("updateCoupon")
          Tool.navigationPop()
        }
      } else{
        Tool.navigateTo('/pages/my/coupon/coupon-detail/coupon-detail')
      }
    },
    btnClicked(e){
      this.setData({
        show:!this.data.show
      })
      if (e){
        let index = e.currentTarget.dataset.index
        Storage.setTokenCoin(this.data.coinNum)
        Event.emit('getTokenCoin')
        Tool.navigationPop()
      }
    },
    bindKeyInput(e){
      this.setData({
        coinNum: Number(e.detail.value)
      })
      this.setInputValue()
    },
    setInputValue(){
      this.data.coinNum = this.data.coinNum < 0 ? 0 : this.data.coinNum
      this.data.coinNum = this.data.coinNum > this.data.maxNum ? this.data.maxNum : this.data.coinNum
      this.setData({
        coinNum: this.data.coinNum
      })
    },
    addClicked(e){
      let index = e.currentTarget.dataset.index
      if(index==1){
        this.data.coinNum--
      }else{
        this.data.coinNum++
      }
      this.setInputValue()
    },
    giveUpUse(){
      Storage.setCoupon({ id: "", name: '选择优惠劵', canClick:true })
      Event.emit("updateCoupon")
      Tool.navigationPop()
    },
    lookAround() {
      Tool.switchTab('/pages/index/index')
    },
    onLoad: function (options) {
      let userInfo = Storage.getUserAccountInfo() || {}
      this.data.coinData.num = userInfo.tokenCoin || 0
      if (this.data.coinData.num && options.useType!=2){
        this.data.lists[0].unshift(this.data.coinData)
      }
      this.setData({
        door: options.door || '',
        useType: options.useType || '',
        lists: this.data.lists,
        productIds: Storage.getQueryStringParams() || '',
        coinData: this.data.coinData,
        userInfo:userInfo
      })
      if (this.data.door == 1){
        let maxUseCoin = options.maxUseCoin || 0
        if (this.data.useType == 1){
          let coinNum = options.coin > this.data.coinData.num? this.data.coinData.num : options.coin
          this.setData({
            coinNum: coinNum ,
            maxNum: this.data.coinData.num > maxUseCoin ? maxUseCoin : this.data.coinData.num,
          })
        } else {
          this.availableDiscountCouponForProduct()
        }
      } else {
        this.getDiscountCouponNoUse();
      }
      this.getDiscountCouponUserd();
      this.getDiscountCouponLosed();
  },
})