let { Tool, RequestFactory, Event, Storage, Operation } = global
Page({
  data: {
    innerCount:1, //件数
    isUseIntegral:false, //能否使用积分和是否使用积分
    addressType:1, //1 快递 2自提
    isChangeAddress:false,
    canSelfLifting:false, //是否可以自提
    address:'', //地址
    params:'',
    orderInfos:"",
    addressList:[],
    remark:'', // 买家留言
    door:'', //0 是礼包 1是产品详情页进入 2是购物车进入 3是从我的订单进来的 
    coupon: { id: "", nickname:'未使用优惠劵'}, //优惠券信息
  },
  onLoad: function (options) {
    this.setData({
      params: JSON.parse(options.params),
      door: options.type
    })
    this.requestOrderInfo()
    Tool.isIPhoneX(this)
    this.availableDiscountCouponForProduct()
    Event.on('updateOrderAddress', this.updateOrderAddress,this)
    Event.on('updateCoupon', this.couponClick,this)
  },
  onShow: function () {
    this.updateCoupon()
  },
  couponClick() {
    this.setData({
      couponClick:true
    })
  },
  updateCoupon(){
    if (!this.data.couponClick) return
    let coupon = Storage.getCoupon()
    this.data.params.couponId = coupon.id
    this.setData({
      params: this.data.params
    })
    let callBack = ()=>{
      this.setData({
        coupon: coupon,
        couponClick: false
      })
    }
    this.requestOrderInfo(callBack)
    // if (coupon.id){ // 选择了优惠券的时候请求数据
    //   this.orderCalcDiscountCouponAndUseScore(coupon)
    // } else {
    //   let orderList = this.data.orderInfos
    //   if (this.data.addressType == 1) { // 快递
    //     orderList.totalAmounts = Tool.add(orderList.orginTotalAmounts, orderList.totalFreightFee)
    //   } else {
    //     orderList.totalAmounts = orderList.totalPrice
    //   }
    //   orderList.showTotalScore = orderList.totalScore
    //   this.userScore(orderList)
    //   if (this.data.isUseIntegral) {
    //     orderList.totalAmounts = Tool.sub(orderList.totalAmounts,orderList.reducePrice)
    //     orderList.totalAmounts = orderList.totalAmounts > 0 ? orderList.totalAmounts:0
    //   }
    //   this.setData({
    //     orderInfos: orderList,
    //     couponClick:false,
    //     coupon: coupon
    //   })
    // }
  },
  orderCalcDiscountCouponAndUseScore(coupon) { 
    // let params = {
    //   couponId: coupon.id,
    //   orderProductList: this.data.params
    // }
    let param = JSON.parse(this.data.params)
    param.couponId = coupon.id
    // let params = {
    //   orderParam: JSON.stringify(param)
    // }
    // let r = RequestFactory.orderCalcDiscountCouponAndUseScore(params);
    let params = {
      orderParam: JSON.stringify(param),
      reqName: '使用优惠券查询',
      url: Operation.orderCalcDiscountCouponAndUseScore
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      this.setData({
        coupon: coupon
      })
      let datas = req.responseObject.data
      let orderList = this.data.orderInfos
      orderList.totalAmounts = datas.totalAmounts
      orderList.showTotalScore = datas.totalScore

      if (this.data.addressType == 1) { // 快递
        orderList.totalAmounts = Tool.add(datas.totalAmounts,orderList.totalFreightFee)
      } else {
        orderList.totalAmounts = datas.totalAmounts
      }
      this.userScore(orderList)
      if (this.data.isUseIntegral && orderList.canUseScore) {
        orderList.totalAmounts = Tool.sub(orderList.totalAmounts, orderList.reducePrice)
        orderList.totalAmounts = orderList.totalAmounts > 0 ? orderList.totalAmounts : 0
      }
      if (!orderList.canUseScore){
        this.setData({
          isUseIntegral:false
        })
      }
      this.setData({
        orderInfos: orderList
      })
      //this.getReducePrice()
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  onPullDownRefresh: function () {
    this.requestOrderInfo()
  },
  requestOrderInfo(callBack = ()=>{}){
    let params = {
      ...this.data.params,
      reqName: '提交订单',
      url: Operation.makeSureOrder
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      wx.stopPullDownRefresh() //停止下拉刷新
      let item = req.responseObject.data || {}
      // 渲染地址列表
      let userAdress = item.userAddress

      if (userAdress){
        item.address = { ...userAdress}
        item.address.addressInfo = userAdress.province + userAdress.city + userAdress.area + userAdress.address
        item.address.hasData = userAdress.receiver ? true : false
      }
     
      //渲染产品信息列表
      let showProduct =[]
      if(this.data.door!=0){
        item.orderProductList.forEach((item0) => {
          showProduct.push({
            showImg: item0.specImg,
            showName: item0.productName,
            showType: item0.spec,
            showPrice: item0.price,
            showQnt: item0.num,
            status: 1,
            stock: item0.stock,
          })
        })
      }
      if(this.data.door==0){
        item.orderProductList.forEach((item0,index)=>{
          showProduct.push({
            showImg: item0.specImg,
            showName: item0.productName,
            showType: item0.spec,
            showPrice: item0.price,
            showQnt: item0.num,
            status: 1,
            stock: item0.stock,
          })
        })
      }

      // 是否有自提的权限 礼包没有自提权限
      // item.hasSelfLifting = (item.user.pickedUp==1&&this.data.door!=0? true:false)

      // if (item.hasSelfLifting){
      //   this.queryStoreHouseList()
      // }

      item.showProduct = showProduct
      
      item.orginTotalAmounts = item.totalAmounts
      item.showTotalScore = item.totalScore

      // this.userScore(item)

      let addressList = this.data.addressList

      if (!this.data.isChangeAddress){
        addressList[1] = item.address
      }
      // item.totalAmounts = Tool.add(item.totalAmounts, item.totalFreightFee)

      callBack(item)

      this.setData({
        orderInfos: item,
        addressList: addressList
      })
      
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  userScore(item){ // 计算积分
    // 积分抵扣计算
    let score = item.dealer.userScore > item.showTotalScore ? item.showTotalScore : item.dealer.userScore
    item.showScore = score
    // item.reducePrice = item.userScoreToBalance*score
    item.reducePrice = Tool.mul(item.userScoreToBalance,score)
    // 当商品可以使用积分 用户积分大于0的时候 显示可以使用积分
    if (this.data.door != 0){
      item.canUseScore = (item.showTotalScore > 0 && item.dealer.userScore) ? true : false
      item.showTipsName = item.dealer.userScore <= 0? '暂无积分可用' : '不支持积分消费'
    } else{
      item.canUseScore =  false
      item.showTipsName = '不支持积分消费'
    }
   
    return item
  },
  addressClicked(){
    if (this.data.addressType!=1){
      Tool.navigateTo('/pages/address/choose-address/choose-address?addressType=' + this.data.addressType)
    } else {
      Tool.navigateTo('/pages/address/select-express-address/select-express-address?addressType=' + this.data.addressType+'&door=1')
    }
  },
  changeAddressType(e){
    let index = e.currentTarget.dataset.index
    console.log(index)
    let { orderInfos, isUseIntegral } = this.data
    this.setData({
      addressType: e.currentTarget.dataset.index
    })
    if (this.data.coupon.id){ // 使用了优惠券更新
      this.updateCoupon()
    } else {
      if(index==1){
        orderInfos.totalAmounts = Tool.add(orderInfos.orginTotalAmounts, orderInfos.totalFreightFee)
      } else {
        orderInfos.totalAmounts = orderInfos.totalPrice
      }
      if (isUseIntegral) {
        orderInfos.totalAmounts = Tool.sub(orderInfos.totalAmounts,orderInfos.reducePrice)
      }
    }
    this.setData({
      orderInfos: orderInfos
    })
  },
  switchChange(){
    if (!this.data.orderInfos.canUseScore) return
    this.setData({
      isUseIntegral: !this.data.isUseIntegral,
    })
    this.getReducePrice()
  },
  getReducePrice(){
    let { orderInfos, isUseIntegral} = this.data
    if (isUseIntegral) {
      orderInfos.totalAmounts = Tool.sub(orderInfos.totalAmounts, orderInfos.reducePrice) 
    } else {
      orderInfos.totalAmounts = Tool.add(orderInfos.totalAmounts, orderInfos.reducePrice) 
    }
    this.setData({
      orderInfos: orderInfos
    })
  },
  queryStoreHouseList() {
    // let r = RequestFactory.queryStoreHouseList();
    let params = {
      reqName: '获取自提地址列表',
      url: Operation.queryStoreHouseList,
      preprocessCallback:true,
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let data = req.responseObject.data
      data.forEach((item, index) => {
        item.addressInfo = item.province + item.city + item.area + item.address
        item.hasData = true
        if (index == 0) {
          item.defaultStatus = 1
        }
      })
      if (req.responseObject.data.length > 0) {
        let addressList = this.data.addressList
        addressList[2] = req.responseObject.data[0]
        this.setData({
          addressList: addressList
        })
      }
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  updateOrderAddress(){ // 重新计算邮费 
    let address = Storage.getOrderAddress()
    let addressList = { ...this.data.addressList}
    addressList[this.data.addressType] = address
    // 参数 省市区code
    this.data.params.areaCode = address.areaCode
    this.data.params.provinceCode = address.provinceCode
    this.data.params.cityCode = address.cityCode
    this.setData({
      isChangeAddress:true,
      addressList: addressList,
      params: this.data.params
    })
    this.requestOrderInfo()
  },
  remarkChange(e){ // 客户留言
    this.setData({
      remark: e.detail.value
    })
  },
  payBtnClicked(){ // 提交订单
    let score = this.data.orderInfos.showScore
    if (!this.data.isUseIntegral){
        score=0
    }
    let orderAddress = this.data.addressList[this.data.addressType]
    if (!orderAddress){
      Tool.showAlert('请选择订单地址')
      return
    }
    if (this.data.remark.length>140){
      Tool.showAlert('买家留言不能多于140字')
      return
    }
    let storehouseId = this.data.addressType == 2? orderAddress.id : ''
    let params = {
      // orderParam: JSON.stringify({
        "address": orderAddress.address,
        "areaCode": orderAddress.areaCode || '',
        "buyerRemark": this.data.remark,
        "cityCode": orderAddress.cityCode || '',
        "couponId": this.data.coupon.id || '',
        "orderProducts": this.data.params.orderProducts,
        "orderType": this.data.params.orderType,
        // "pickedUp": this.data.addressType,
        "provinceCode": orderAddress.provinceCode || '',
        "receiver": orderAddress.receiver || '',
        "recevicePhone": orderAddress.recevicePhone || '',
        // "storehouseId": storehouseId,
        "useScore": score,
      // }),
      reqName: '订单结算',
      url: Operation.submitOrder
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {        
      Event.emit('updateShoppingCart')
      let data = req.responseObject.data
      Storage.setPayOrderList(data)
      Tool.redirectTo('/pages/order-confirm/pay/pay?data=' + JSON.stringify(data))
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  couponClicked(){
    if(this.data.door==0) return
    let productIds = []
    let orderList = this.data.orderInfos.orderProductList
    orderList.forEach((item)=>{
      productIds.push(item.productId)
    })
    Tool.navigateTo("/pages/my/coupon/my-coupon/my-coupon?door=1&&productIds=" + this.data.params)
  },
  availableDiscountCouponForProduct() { // 产品可用优惠劵列表
    let productIds = []
    this.data.params.orderProducts.forEach((item)=>{
      productIds.push(item.productId)
    })
    console.log(productIds)
    let params = {
      productIds: productIds,
      reqName: '产品可用优惠劵列表',
      url: Operation.availableDiscountCouponForProduct
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let datas = req.responseObject.data
      if (datas.totalPage==0){
        this.setData({
          coupon:{
            id:'',
            nickname:"暂无可用优惠劵"
          }
        })
      }      
    };
    Tool.showErrMsg(r);
    r.addToQueue();
  },
  onUnload: function () {
    Event.off('updateOrderAddress', this.updateOrderAddress)
    Event.off('updateCoupon', this.couponClick)
  }
})

