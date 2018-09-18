let { Tool, RequestFactory, Storage, Event, Operation} = global;
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
      types: ["其他", "满减劵", "抵价劵", "折扣劵","抵扣劵"],
      totalPageArr:[], //保存页数 
      params:{
        page:1,
        pageSize:10
      },
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
        if(this.data.door==1){
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
    getCouponType(item){
      // 优惠卷的类型
      let typeObj = this.data.types
      item.typeName = typeObj[item.type]
      item.showTypeName = item.type == 4 || item.type == 2? true:false
      item.value = item.type == 3?  Tool.mul(item.value,0.1):item.value

      //优惠卷的使用范围
      
      let length = item.length
    
      if (length==0){
        // 单产品和多产品的判断
        item.nickname = item.products.length == 1 ? "限" + item.products[0] + "可用" :"限指定商品可使用"
      } else if (length>1){
        // 多品类
        item.nickname = "限指定商品可使用" 
      } else if (length==1){
        // 单品类
        if (item.products.length==0){
          item.nickname = item[item.key].length > 0 ? "限指定商品可使用" : "限" + item[item.key][0] + "可用"
        } else if (item.products.length==1) {
          item.nickname = "限" + item.products[0] + "可用" 
        } else {
          item.nickname = "限指定商品可使用" 
        }
      }
      
    },
    formatCouponInfos(params,index,isActive=false,leftName,){
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let datas = req.responseObject.data
        if (req.responseObject.data.totalPage == 0) return
        datas.data.forEach((item,index)=>{
          item.outTime = Tool.timeStringForDateString(Tool.formatTime(item.expireTime),"YYYY.MM.DD");
          item.start_time = Tool.timeStringForDateString(Tool.formatTime(item.startTime), "YYYY.MM.DD");
          let length = 0,key=""
          length += (item.cat1.length>0? 0:1)
          length += (item.cat2.length > 0 ? 0 : 1)
          length += (item.cat3.length> 0 ? 0 : 1)
          key = (item.cat1.length > 0 ? 'cat1' : key)
          key = (item.cat2.length > 0 ? 'cat2' : key)
          key = (item.cat3.length > 0 ? 'cat3' : key)
          item.length =length
          item.key = key
          item.left = leftName;
          item.active = isActive;
          this.getCouponType(item)
        })
        this.data.lists[index] = this.data.lists[index].concat(datas.data)
        this.data.totalPageArr[index] = datas.totalPage
        this.setData({
          lists: this.data.lists,
          totalPageArr: this.data.totalPageArr
        })
      };
      Tool.showErrMsg(r);
      r.addToQueue();
    },
    availableDiscountCouponForProduct(){
      let params = {
        ...this.data.params,
        productIds: this.data.productIds,
        reqName: '产品可用优惠劵列表',
        url: Operation.availableDiscountCouponForProduct
      }
      this.formatCouponInfos(params, 0, true, '')
    },
    
    //未使用
    getDiscountCouponNoUse() {
      let params = {
        ...this.data.params,
        reqName: '未使用优惠劵列表',
        url: Operation.couponList,
        status:1
      }
      params.pageSize = 5
      this.formatCouponInfos(params, 0,true,'')
    },
    // 待激活
    getDiscountCouponNoActive() {
      let params = {
        ...this.data.params,
        reqName: '未使用优惠劵列表',
        url: Operation.couponList,
        status: 4
      }
      params.pageSize = 5
      this.formatCouponInfos(params, 0, false, '待激活')
    },
    //已经优惠劵列表
    getDiscountCouponUserd() {
      let params = {
        ...this.data.params,
        status: 2,
        reqName: '已使用优惠劵列表',
        url: Operation.couponList
      }
      this.formatCouponInfos(params, 2, false, '已使用')
    },
    //失效优惠劵列表
    getDiscountCouponLosed() {
      let params = {
        ...this.data.params,
        reqName: '失效优惠劵列表',
        status:3,
        url: Operation.couponList
      }
      this.formatCouponInfos(params, 1, false, '已失效')
    },

    // 点击标题切换当前页时改变样式
    swichNav: function (e) {
        var cur = e.target.dataset.current;
        if (this.data.currentTaB == cur) {
            return false;
        }
        else {
            this.setData({
                currentTab: cur,
            })
        }
    },
    //优惠券详情
    toDetail(e){

      // let id=e.currentTarget.dataset.id
      let index = e.currentTarget.dataset.index
      let key = e.currentTarget.dataset.key
      Storage.setCoupon(this.data.lists[key][index])
      Tool.navigateTo('../coupon-detail/coupon-detail')
      if(this.data.door==1&&key==0){
        console.log(11111)
        // Event.emit("updateCoupon")
        Tool.navigationPop()
      } else{
        Tool.navigateTo('../coupon-detail/coupon-detail')
      }
    },
    giveUpUse(){
      Storage.setCoupon({ id: "", name: '未使用优惠劵' })
      Event.emit("updateCoupon")
      Tool.navigationPop()
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
      onLoad: function (options) {
        this.setData({
          door: options.door || 1,
          productIds: options.productIds || [1],
        })
        if(this.data.door==1){
          this.availableDiscountCouponForProduct()
        } else {
          this.getDiscountCouponNoActive()
          this.getDiscountCouponNoUse();
        }
        this.getDiscountCouponUserd();
        this.getDiscountCouponLosed();
    },
})