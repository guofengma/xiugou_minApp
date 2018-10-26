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
    door:'', // 1秒杀 2降价 3优惠套餐 4助力免费领 5礼包 99 普通
    coupon: { id: "", name: '未使用优惠劵', canClick:true}, //优惠券信息
    useOneCoinNum:0, // 1元劵张数
  },
  onLoad: function (options) {
    Tool.getUserInfos(this)
    this.setData({
      params: JSON.parse(options.params),
      door: options.type,
    })
    this.requestOrderInfo()
    Tool.isIPhoneX(this)
    this.availableDiscountCouponForProduct()
    Event.on('updateOrderAddress', this.updateOrderAddress,this)
    Event.on('updateCoupon', this.couponClick,this)
    Event.on('getTokenCoin', this.getTokenCoin,this)
  },
  onShow: function () {
    this.updateCoupon()
  },
  getTokenCoin(){ // 1元劵计算
    let useOneCoinNum = Storage.getTokenCoin() || 0
    if (useOneCoinNum > this.data.orderInfos.totalAmounts){
      useOneCoinNum = Math.floor(this.data.orderInfos.totalAmounts)
    }
    this.data.params.tokenCoin = Number(useOneCoinNum)
    this.setData({
      params: this.data.params
    })
    let callBack = ()=>{
      this.setData({
        useOneCoinNum: Number(useOneCoinNum)
      })
    }
    if (useOneCoinNum>0)
    this.requestOrderInfo(callBack)
    // if (this.data.orderInfos.totalAmounts>=1){
    //   this.data.orderInfos.showTotalAmounts = Tool.sub(Math.floor(this.data.orderInfos.totalAmounts), useOneCoinNum)
    //   if (this.data.orderInfos.showTotalAmounts<0){
    //     this.data.orderInfos.showTotalAmounts = 0
    //     useOneCoinNum = Math.floor(this.data.orderInfos.totalAmounts)
    //   }
    //   this.data.orderInfos.showTotalAmounts = Tool.sub(this.data.orderInfos.totalAmounts, useOneCoinNum)
    //   this.setData({
    //     useOneCoinNum: Number(useOneCoinNum),
    //     orderInfos: this.data.orderInfos
    //   })
    // }
  },
  couponClick() { // 是否点击了优惠卷
    this.setData({
      couponClick:true
    })
  },
  updateCoupon(){ // 点击优惠卷价格联动
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
  },
  requestOrderInfo(callBack = ()=>{}){ // 获取订单信息 优惠卷和省市区地址更改联动
    let url = ''

    if(this.data.door==1){
      url = Operation.seckillMkeSureOrder
    } else if (this.data.door == 2){
      url = Operation.discountMakeSureOrder
    } else if (this.data.door == 5) {
      url = Operation.giftMkeSureOrder
    } else {
      url = Operation.makeSureOrder
    }
    let params = {
      ...this.data.params,
      reqName: '提交订单',
      url: url
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

      item.showProduct = showProduct
      
      item.orginTotalAmounts = item.totalAmounts
      item.showTotalScore = item.totalScore

      // this.userScore(item)

      let addressList = this.data.addressList

      if (!this.data.isChangeAddress){
        addressList[1] = item.address
      }
      // item.showTotalAmounts = item.totalAmounts
      // item.totalAmounts = Tool.add(item.totalAmounts, item.totalFreightFee)
      callBack(item)

      this.setData({
        orderInfos: item,
        addressList: addressList
      })
      // if (this.data.useOneCoinNum>0){
      //   this.getTokenCoin()
      // }
    };
    Tool.showErrMsg(r)
    r.addToQueue();
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
      "address": orderAddress.address,
      "areaCode": orderAddress.areaCode || '',
      "buyerRemark": this.data.remark,
      "cityCode": orderAddress.cityCode || '',
      "couponId": this.data.coupon.id || '',
      "orderType": this.data.params.orderType,
      "provinceCode": orderAddress.provinceCode || '',
      "receiver": orderAddress.receiver || '',
      "recevicePhone": orderAddress.receiverPhone || '',
      tokenCoin: Number(this.data.useOneCoinNum), // 一元劵  
      reqName: '订单结算', 
    }
    let orderTypeParmas ={}
    if (this.data.door == 2){
      orderTypeParmas = {
        ...this.data.params,
        // "orderProducts": this.data.params.orderProducts,
        url: Operation.discountSubmitOrder
      }
    } else if (this.data.door == 5){
      orderTypeParmas = {
        ...this.data.params,
        url: Operation.giftSubmitOrder
      }
    } else if (this.data.door == 1){
      orderTypeParmas = {
        ...this.data.params,
        // "orderProducts": this.data.params.orderProducts,
        url: Operation.seckillSubmitOrder
      }
    }
    else {
      orderTypeParmas = {
        "orderProducts": this.data.params.orderProducts,
        url: Operation.submitOrder
      }
    }
    Object.assign(params, params, orderTypeParmas)
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      Event.emit('getLevel')  
      Event.emit('updateShoppingCart')
      let data = req.responseObject.data
      Storage.setPayOrderList(data)
      Tool.redirectTo('/pages/order-confirm/pay/pay?data=' + JSON.stringify(data))
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  iconClicked(){ // 点击使用1元劵跳转
    let useOneCoinNum = this.data.useOneCoinNum ? this.data.useOneCoinNum : Math.floor(this.data.orderInfos.totalAmounts)
    Tool.navigateTo("/pages/my/coupon/my-coupon/my-coupon?door=1&useType=1&coin=" + useOneCoinNum)
  },
  couponClicked(){ // 点击使用优惠卷跳转
    if ((this.data.door != 99 && this.data.door ==5)|| this.data.coupon.canClick===false) return
    let productIds = this.getCouponProductPriceIds()
    Tool.navigateTo("/pages/my/coupon/my-coupon/my-coupon?door=1&useType=2&productIds=" + JSON.stringify(productIds))
  },
  getCouponProductPriceIds(){ // 获取请求优惠卷的参数
    let productIds = []
    this.data.params.orderProducts.forEach((item) => {
      productIds.push({
        priceId: item.priceId,
        productId: item.productId,
      })
    })
    return productIds
  },
  availableDiscountCouponForProduct() { // 产品可用优惠劵列表
    if (this.data.door != 99&&this.data.door != 5) return
    let productIds = this.getCouponProductPriceIds()
    let params = {
      productPriceIds: productIds,
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
            name:"暂无可用优惠劵",
            canClick:false,
          }
        })
      }      
    };
    Tool.showErrMsg(r);
    r.addToQueue();
  },
  onPullDownRefresh: function () {
    this.requestOrderInfo()
  },
  onUnload: function () {
    Event.off('updateOrderAddress', this.updateOrderAddress)
    Event.off('updateCoupon', this.couponClick)
  },
  // switchChange(){
  //   if (!this.data.orderInfos.canUseScore) return
  //   this.setData({
  //     isUseIntegral: !this.data.isUseIntegral,
  //   })
  //   this.getReducePrice()
  // },
  // getReducePrice(){
  //   let { orderInfos, isUseIntegral} = this.data
  //   if (isUseIntegral) {
  //     orderInfos.totalAmounts = Tool.sub(orderInfos.totalAmounts, orderInfos.reducePrice) 
  //   } else {
  //     orderInfos.totalAmounts = Tool.add(orderInfos.totalAmounts, orderInfos.reducePrice) 
  //   }
  //   this.setData({
  //     orderInfos: orderInfos
  //   })
  // },
  // userScore(item){ // 计算积分
  //   // 积分抵扣计算
  //   let score = item.dealer.userScore > item.showTotalScore ? item.showTotalScore : item.dealer.userScore
  //   item.showScore = score
  //   // item.reducePrice = item.userScoreToBalance*score
  //   item.reducePrice = Tool.mul(item.userScoreToBalance,score)
  //   // 当商品可以使用积分 用户积分大于0的时候 显示可以使用积分
  //   if (this.data.door != 0){
  //     item.canUseScore = (item.showTotalScore > 0 && item.dealer.userScore) ? true : false
  //     item.showTipsName = item.dealer.userScore <= 0? '暂无积分可用' : '不支持积分消费'
  //   } else{
  //     item.canUseScore =  false
  //     item.showTipsName = '不支持积分消费'
  //   }

  //   return item
  // },
})

