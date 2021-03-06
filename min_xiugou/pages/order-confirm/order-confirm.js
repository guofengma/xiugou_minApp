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
    coupon: { id: "", name: '选择优惠劵', canClick:true}, //优惠券信息
    useOneCoinNum:0, // 1元劵张数
    couponArr:[1,2], // 不支持优惠卷 不支持1元劵
    canUseTokenCoin: true,//支持使用支持1元劵
    canUseCoupon: true,//支持使用优惠卷
    btnDisabled:false, //提交订单按钮是否可以点击
  },
  onLoad: function (options) {
    Tool.getUserInfos(this)
    this.setData({
      params: JSON.parse(options.params),
      door: options.type,
      formCart: options.formCart || false
    })
    this.requestOrderInfo()
    Tool.isIPhoneX(this)
    this.availableDiscountCouponForProduct()
    Event.on('updateOrderAddress', this.updateOrderAddress,this)
    Event.on('updateCoupon', this.couponClick,this)
    Event.on('getTokenCoin', this.tokenCoinClick,this)
  },
  onShow: function () {
    this.updateCoupon()
    this.getTokenCoin()
  },
  getTokenCoin(){ // 1元劵计算
    if (!this.data.tokenCoinClick) return
    let useOneCoinNum = Storage.getTokenCoin() || 0
    this.data.params.tokenCoin = Number(useOneCoinNum)
    this.setData({
      params: this.data.params
    })
    let callBack = ()=>{
      this.setData({
        useOneCoinNum: this.data.params.tokenCoin,
        tokenCoinClick:false
      })
    }
    this.requestOrderInfo(callBack)
  },
  tokenCoinClick(){
    this.setData({
      tokenCoinClick: true
    })
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
    this.data.params.tokenCoin = 0
    this.setData({
      params: this.data.params,
    })
    let callBack = (item)=>{
      this.setData({
        coupon: coupon,
        couponClick: false
      })
      if (this.data.useOneCoinNum>item.totalAmounts){
        Tool.showAlert("一元劵最多只能使用" + Math.floor(item.totalAmounts)+'张')
        this.setData({
          useOneCoinNum:0
        })
      }
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
      wx.stopPullDownRefresh() //停止下拉刷新du
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
      let canUseTokenCoin = false, canUseCoupon = false
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
        let arr = Tool.bitOperation(this.data.couponArr, item0.restrictions)
        console.log(item0.restrictions)
        let couponType = this.data.couponArr.filter(function (n) {
          return arr.indexOf(n) == -1
        });
        couponType.forEach((item,index)=>{
          if(item==this.data.couponArr[0]){
            canUseCoupon = true
          }
          if (item == this.data.couponArr[1]) {
            canUseTokenCoin = true
          }
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
        addressList: addressList,
        canUseCoupon: canUseCoupon,
        canUseTokenCoin: canUseTokenCoin
      })
      // if (this.data.useOneCoinNum>0){
      //   this.getTokenCoin()
      // }
    };
    r.failBlock = (req) => {
      this.failBlock(req)
    }
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
    if (this.data.btnDisabled) return
    this.setData({
      btnDisabled:true
    })
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
      tokenCoin: this.data.params.tokenCoin, // 一元劵  
      reqName: '订单结算', 
    }
    let orderTypeParmas ={}
    if (this.data.door == 2){
      orderTypeParmas = {
        ...this.data.params,
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
      Tool.redirectTo('/pages/order-confirm/pay/pay?door=1')
    };
    r.failBlock = (req) => {
      this.setData({
        btnDisabled:false
      })
      this.failBlock(req)
    }
    r.addToQueue();
  },
  failBlock(req){
    let callBack = () => { }
    if(req.responseObject.code == 10009) { // 超时登录
      callBack = () => {
        Tool.navigateTo('/pages/login-wx/login-wx?isBack=' + true)
      }
    } else if (req.responseObject.code == 54001) {
      if (this.data.formCart) {
        callBack = () => {
          Event.emit('updateShoppingCart')
          Tool.switchTab('/pages/shopping-cart/shopping-cart')
        }
      } else {
        callBack = () => {
          Tool.navigationPop()
        }
      }
    }
    Tool.showAlert(req.responseObject.msg, callBack)
  },
  iconClicked(){ // 点击使用1元劵跳转
    let useOneCoinNum = this.data.useOneCoinNum ? this.data.useOneCoinNum : Math.floor(this.data.orderInfos.totalAmounts)
    let maxUseCoin= this.data.orderInfos.totalAmounts
    if (this.data.useOneCoinNum){
      maxUseCoin = Tool.add(this.data.orderInfos.totalAmounts, useOneCoinNum)
    }
    Tool.navigateTo("/pages/my/coupon/my-coupon/my-coupon?door=1&useType=1&coin=" + useOneCoinNum + '&maxUseCoin=' + maxUseCoin)
  },
  couponClicked(){ // 点击使用优惠卷跳转
    if ((this.data.door != 99 && this.data.door == 5) || this.data.coupon.canClick === false || !this.data.canUseCoupon) return
    let productIds = this.getCouponProductPriceIds()
    Tool.navigateTo("/pages/my/coupon/my-coupon/my-coupon?door=1&useType=2&productIds=" + JSON.stringify(productIds))
  },
  getCouponProductPriceIds(){ // 获取请求优惠卷的参数
    let productIds = []
    this.data.params.orderProducts.forEach((item) => {
      productIds.push({
        priceId:item.priceId,
        productId:item.productId,
        amount:item.num
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
            canClick:true,
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
    Event.off('getTokenCoin', this.tokenCoinClick)
  },
})

