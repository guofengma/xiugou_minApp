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
        types:{
          MJ: "满减劵", ZK: "折扣劵", DK: "抵扣劵", DJ:"抵价劵"
        },
        totalPageArr:[], //保存页数 
        params:{
          page:1,
          size:10
        }
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
          //this.availableDiscountCouponForProduct()
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
      let typeObj = this.data.types
      item.typeName = typeObj[item.type]
      item.showTypeName = item.type == 'DK' || item.type == 'DJ'? true:false
      item.value = item.type == 'ZK'?  Tool.mul(item.value,0.1):item.value
    },
    availableDiscountCouponForProduct(){
      // let params = {
      //   orderParam: this.data.productIds
      // }
      // let r = RequestFactory.availableDiscountCouponForProduct(params);
      let params = {
        orderParam: this.data.productIds,
        reqName: '产品可用优惠劵列表',
        url: Operation.availableDiscountCouponForProduct
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let currentTime = new Date().getTime() // 获取当前时间
        for (let i in req.responseObject.data) {
          let item = req.responseObject.data[i];
          item.outTime = Tool.formatTime(item.outTime).slice(0, 10);
          item.start_time = Tool.formatTime(item.startTime).slice(0, 10);
          // let nickname = item.name
          // item.name = item.nickname
          // item.nickname = nickname
          if (currentTime > item.startTime) {
            item.left = '';
            item.canUse =1
            item.active = true;
            item.canUseStart = true
          }
          this.getCouponType(item)
          this.data.lists[0].push(item)
        }
        // this.data.totalPageArr[0] = req.responseObject.data.total
        // this.data.lists[0] = this.data.lists[0].concat(req.responseObject.data.data)
        this.data.lists[0] = req.responseObject.data
        this.setData({
          lists: this.data.lists
        })
      };
      Tool.showErrMsg(r);
      r.addToQueue();
    },
    //未使用
    getDiscountCouponNoUse() {
      let params = {
        ...this.data.params,
        reqName: '未使用优惠劵列表',
        url: Operation.getDiscountCouponNoUse
      }
      let r = RequestFactory.wxRequest(params);
      // let r = RequestFactory.getDiscountCouponNoUse(this.data.params);
      r.successBlock = (req) => {
          if (req.responseObject.data.total==0) return
          let currentTime = new Date().getTime() // 获取当前时间
          for (let i in req.responseObject.data.data) {
            let item = req.responseObject.data.data[i];
            item.outTime = Tool.formatTime(item.outTime).slice(0, 10);
            item.start_time = Tool.formatTime(item.startTime).slice(0, 10);
            if (currentTime > item.startTime){
              item.left = '';
              item.active = true;
              item.canUse = 1
              item.canUseStart = true
            } else {
              item.left = '待激活';
              item.active = false
            }
            this.getCouponType(item)
          }
          this.data.lists[0] = this.data.lists[0].concat(req.responseObject.data.data)
          this.data.totalPageArr[0] = req.responseObject.data.total
          this.setData({
            lists: this.data.lists,
            totalPageArr: this.data.totalPageArr
          })
        };
        Tool.showErrMsg(r);
        r.addToQueue();
    },
    //已经优惠劵列表
    getDiscountCouponUserd() {
      let params = {
        ...this.data.params,
        reqName: '已经优惠劵列表',
        url: Operation.getDiscountCouponUserd
      }
      let r = RequestFactory.wxRequest(params);
        // let r = RequestFactory.getDiscountCouponUserd(this.data.params);
      r.successBlock = (req) => {
        if (req.responseObject.data.total == 0) return
        for (let i in req.responseObject.data.data) {
          let item = req.responseObject.data.data[i];
          item.outTime = Tool.formatTime(item.outTime).slice(0, 10);
          item.start_time = Tool.formatTime(item.startTime).slice(0, 10);
            item.left = '已使用';
            this.getCouponType(item)
            //this.data.lists[2].push(item)
        }
        this.data.totalPageArr[2] = req.responseObject.data.total
        this.data.lists[2] = this.data.lists[2].concat(req.responseObject.data.data)
        this.setData({
            lists: this.data.lists,
            totalPageArr: this.data.totalPageArr
        })
      };
      Tool.showErrMsg(r);
      r.addToQueue();
    },
    //失效优惠劵列表
    getDiscountCouponLosed() {
      // let r = RequestFactory.getDiscountCouponLosed(this.data.params);
      let params = {
        ...this.data.params,
        reqName: '失效优惠劵列表',
        url: Operation.getDiscountCouponLosed
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        if (req.responseObject.data.total == 0) return
          for (let i in req.responseObject.data.data) {
            let item = req.responseObject.data.data[i];
            item.outTime = Tool.formatTime(item.outTime).slice(0, 10);
            item.start_time = Tool.formatTime(item.startTime).slice(0, 10);
            item.left = '已过期';
            //this.data.lists[1].push(item)
          }
          this.data.totalPageArr[1] = req.responseObject.data.total
          this.data.lists[1] = this.data.lists[1].concat(req.responseObject.data.data)
          this.setData({
            lists: this.data.lists,
            totalPageArr: this.data.totalPageArr
          })
      };
      Tool.showErrMsg(r);
      r.addToQueue();
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
      let id=e.currentTarget.dataset.id
      let btn = e.currentTarget.dataset.btn
      let canUse = e.currentTarget.dataset.canuse
      let index = e.currentTarget.dataset.index
      if (canUse != 1 || this.data.door != 1){
        Tool.navigateTo('../coupon-detail/coupon-detail?id=' + id + "&btn=" + btn)
      } else if (canUse == 1 && this.data.lists[0][index].canUseStart && this.data.door==1) {
        Storage.setCoupon(this.data.lists[0][index])
        Event.emit("updateCoupon")
        Tool.navigationPop()
      }
    },
    giveUpUse(){
      Storage.setCoupon({ id: "", nickname: '未使用优惠劵' })
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
        let that = this;
        //  高度自适应
        wx.getSystemInfo({
          success: function (res) {
            let clientHeight = res.windowHeight,
                clientWidth = res.windowWidth,
                rpxR = 750 / clientWidth;
            let calc = clientHeight * rpxR;
            let calc0 = clientHeight * rpxR
            if (that.data.currentTab == 0 & options.door == 1 ){
              calc -= 100 * rpxR
            }
            that.setData({
              winHeight: [calc, calc0, calc0],
            });
          }
        });
        this.setData({
          door: options.door || '',
          productIds: options.productIds || '',
        })
        if(this.data.door==1){
          this.availableDiscountCouponForProduct()
        } else {
          this.getDiscountCouponNoUse();
        }
        this.getDiscountCouponUserd();
        this.getDiscountCouponLosed();
    },
})