let { Tool, API, Event, Storage, Operation } = global
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
    btnDisabled:false, //提交订单按钮是否可以点击,
    confirmUrl:{ // 确认订单接口
      1: 'seckillSubmit',
      2: 'depreciateSubmit',
      5: 'giftSubmit',
      99: 'makeSureOrder'
    },
    submitUrl:{ // 提交订单接口
      99:'submitOrder'
    }
  },
  onLoad: function (options) {
    Tool.getUserInfos(this)
    this.setData({
      params:Storage.getSubmitOrderList() || {},
      door: options.type,
      formCart: options.formCart || false,
      submitUrl: {
        ...this.data.confirmUrl,
        ...this.data.submitUrl
      }
    })
    this.requestOrderInfo()
    Tool.isIPhoneX(this)
    // this.availableDiscountCouponForProduct()
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
    this.data.params.userCouponCode = coupon.code
    this.data.params.tokenCoin = 0
    this.setData({
      params: this.data.params,
    })
    let callBack = (item)=>{
      console.log(item)
      this.setData({
        coupon: coupon,
        couponClick: false
      })
      if (this.data.useOneCoinNum > item.payAmount){
        Tool.showAlert("一元劵最多只能使用" + Math.floor(item.payAmount)+'张')
        this.setData({
          useOneCoinNum:0
        })
      }
    }
    this.requestOrderInfo(callBack)
  },
  requestOrderInfo(callBack = ()=>{}){ // 获取订单信息 优惠卷和省市区地址更改联动
    // orderSubType: 1.秒杀 2.降价拍 3.升级礼包 4.普通礼包 orderType 1.普通订单 2.活动订单
    let params = {
      ...this.data.params,
      channel:1,
      source: this.data.formCart ? 1 : 2, // 订单来源
      submitType:1,
    }
    let reqUrl = this.data.confirmUrl[this.data.door]
    // 1秒杀 2降价 3优惠套餐 4助力免费领 5礼包 99 普通
    API[reqUrl](params).then((res) => {
      wx.stopPullDownRefresh() //停止下拉刷新du
      let item = res.data || {}
      let userAdress = item.userAddressDTO || item.userAddress || {}
      if (userAdress){
        item.address = { ...userAdress}
        item.address.addressInfo = userAdress.province + userAdress.city + userAdress.area + userAdress.address
        item.address.hasData = userAdress.receiver? true : false
      }
      // console.log(userAdress)
      //渲染产品信息列表
      let showProduct =[]
      let canUseTokenCoin = false, canUseCoupon = false
      item.orderProductList.forEach((item0,index)=>{
        let specValues = item0.specValues || ''
        let spec = specValues.split('@').join('-')
        showProduct.push({
          showImg: item0.specImg,
          showName: item0.productName,
          showType: spec,
          showPrice: item0.unitPrice,
          showQnt: item0.quantity,
          status: 1,
          stock: item0.stock || 1,
        })
        let arr = Tool.bitOperation(this.data.couponArr, item0.restrictions)
        // let couponType = this.data.couponArr.filter(function (n) {
        //   return arr.indexOf(n) == -1
        // });
        // couponType.forEach((item, index) => {
        arr.forEach((item,index)=>{
          if(item==this.data.couponArr[0]){
            canUseCoupon = true
          }
          if (item == this.data.couponArr[1]) {
            canUseTokenCoin = true
          }
        })
      })

      item.showProduct = showProduct

      item.orginTotalAmounts = item.payAmount
      item.showTotalScore = item.totalScore || 0

      // this.userScore(item)

      let addressList = this.data.addressList

      if (!this.data.isChangeAddress){
        addressList[1] = item.address
      }
      // 升级礼包默认不支持优惠卷
      if (this.data.orderSubType==3){
        canUseCoupon=false
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
      // 可以使用优惠卷的情况下 请求优惠券
      if (this.data.canUseCoupon && this.data.params.orderSubType != 4 && this.data.params.orderSubType != 3){
        this.availableDiscountCouponForProduct()
      } else if (this.data.canUseCoupon && (this.data.params.orderSubType == 4 || this.data.params.orderSubType == 3)){
        this.setData({
          coupon: {
            id: '',
            name: "暂无可用优惠劵"
          }
        })
      }
    }).catch((res) => {
      this.failBlock(res)
      console.log(res)
    })
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
    if (this.data.coupon.code){ // 使用了优惠券更新
      this.updateCoupon()
    } else {
      if(index==1){
        orderInfos.payAmount = Tool.add(orderInfos.orginTotalAmounts, orderInfos.totalFreightFee)
      } else {
        orderInfos.payAmount = orderInfos.totalPrice
      }
      if (isUseIntegral) {
        orderInfos.payAmount = Tool.sub(orderInfos.payAmount,orderInfos.reducePrice)
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
    this.data.params.addressId = address.id
    // this.data.params.provinceCode = address.provinceCode
    // this.data.params.cityCode = address.cityCode
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
    let params = {
      ...this.data.params,
      // orderProductList: this.data.params.orderProductList || '',
      // orderType: this.data.params.orderType || '',// 订单类型
      // orderSubType: this.data.params.orderSubType || '', //订单子类型
      // tokenCoin: this.data.params.tokenCoin,//一元劵
      // userCouponCode: this.data.coupon.code || '', //优惠卷
      addressId: this.data.orderInfos.address.id,// 收件地址
      message: this.data.remark || '',// 买家留言
      channel: 1,// 渠道 1.小程序 2.APP 3.H5
      source: this.data.formCart ? 1 : 2, // 订单来源
      submitType: 2, // 提交类型 1：确认订单，2：提交订单
    }
    let reqUrl = this.data.submitUrl[this.data.door]
    API[reqUrl](params).then((res) => {
      let datas = res.data || {}
      Event.emit('getLevel')  
      Event.emit('updateShoppingCart')
      Storage.setPayOrderList(datas)
      Tool.redirectTo('/pages/order-confirm/pay/pay?door=1')
    }).catch((res) => {
      this.setData({
        btnDisabled:false
      })
      this.failBlock(res)
      console.log(res)
    })
  },
  failBlock(res){
    console.log(res)
    let callBack = () => { }
    if (res.code == 54001 || res.code == 10003) {
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
    Tool.showAlert(res.msg, callBack)
  },
  iconClicked(){ // 点击使用1元劵跳转
    let useOneCoinNum = this.data.useOneCoinNum ? this.data.useOneCoinNum : Math.floor(this.data.orderInfos.payAmount)
    let maxUseCoin = this.data.orderInfos.payAmount
    if (this.data.useOneCoinNum){
      maxUseCoin = Tool.add(this.data.orderInfos.payAmount, useOneCoinNum)
    }
    Tool.navigateTo("/pages/my/coupon/my-coupon/my-coupon?door=1&useType=1&coin=" + useOneCoinNum + '&maxUseCoin=' + maxUseCoin)
  },
  couponClicked(){ // 点击使用优惠卷跳转
    if ( !this.data.canUseCoupon) return
    // let productIds = this.getCouponProductPriceIds()
    Tool.navigateTo("/pages/my/coupon/my-coupon/my-coupon?door=1&useType=2")
  },
  getCouponProductPriceIds(){ // 获取请求优惠卷的参数
    let productIds = []
    let orderProductList = this.data.params.orderProductList || []
    orderProductList.forEach((item) => {
      productIds.push({
        priceCode: item.skuCode,
        productCode: item.productCode,
        amount: item.quantity
      })
    })
    return productIds
  },
  
  availableDiscountCouponForProduct() { // 产品可用优惠劵列表
    // 1.秒杀 2.降价拍 3.升级礼包 4.普通礼包 orderType 1.普通订单 2.活动订单
    let productIds = this.getCouponProductPriceIds()
    if (productIds.length==0) return
    let params = {
      productPriceIds: productIds,
      activityCode: this.data.params.activityCode || '',
      activityType: this.data.params.orderSubType || ''
    }
    Storage.setQueryStringParams(params)
    API.availableDiscountCouponForProduct(params).then((res) => {
      let datas = res.data
      if (datas.totalPage==0){
        this.setData({
          coupon:{
            id:'',
            name:"暂无可用优惠劵"
          }
        })
      }  
    }).catch((res) => {
      console.log(res)
    })
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

