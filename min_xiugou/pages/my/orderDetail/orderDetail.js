let { Tool, API, Storage, Event, Operation, Config} = global;

Page({
    data: {
      ysf: { title: '订单详情' },
      addressType: 1,
      src: '/img/address-icon-gray.png',
      address: {
          receiver:'',
          recevicePhone:'',
          addressInfo:''
      },
      // afterSaleTypeArr:[4,8,16],// 不支持退款 不支持换货 不支持退货 
      afterSaleType:[], //支持售后的数组 
      types:['退款','换货','退货','退换'],
      returnTypeArr: ['', '退款', '退货', '换货'],
      hasData:true,
      imgSrcUrl: Config.imgBaseUrl,
      logIcon: 'order-state-3-dark.png',
      isCancel: false,//是否取消订单
      isDelete: false, //是否删除订单
      secondArry: [],
      state: {
          status:'',
          left:'',
          right:'',
          middle:'',
          orderIcon: "order-state-1.png",
          info:'',
          time:'',
      },
      time: Object,
      countdown: '',
      detail: {},//详情信息
      orderId: '',//订单ID
      status: '',//订单状态
      payTypeArr: [1, 2, 4, 8, 16], // 平台支付 微信支付 微信支付 支付宝支付 银联支付
      payType: {
        1: '平台支付',
        2: '微信支付',
        4: '微信支付',
        8: '支付宝支付',
        16: '银联支付'
      },
    },
    onLoad: function (options) {
        this.setData({
          orderId: options.orderId,
          status: options.status,
          num: options.num || ''
        });
        Tool.isIPhoneX(this)
        if(options.status==4){
            this.addressType=2
        }
        Event.on('getDetail', this.getDetail,this)
        this.getDetail();//获取详情  
    },
    cancelOrder(){},
    //获取详情
    getDetail() {
      API.getOrderDetail({
        orderNo:this.data.orderId
      }).then((res) => {
        let datas = res.data || {}
        datas.addressInfo = datas.province + datas.city + datas.area + datas.address
        let warehouseOrderDTOList = datas.warehouseOrderDTOList ||[]
        let showProducts =[]
        let showOutStatus = warehouseOrderDTOList[0].status
        warehouseOrderDTOList.forEach((item, index) => {
          item.products.forEach((item1) => {
            showProducts.push(item1)
            item1.specValues = (item1.specValues || '').split('@').join('-')
          })
        })
        let showPriceList = ''
        if (showOutStatus != 1 && showOutStatus != 5 ){
          showPriceList=datas
        } else {
          showPriceList= warehouseOrderDTOList[0]
        }
        warehouseOrderDTOList[0].showCreateTime = Tool.formatTime(warehouseOrderDTOList[0].createTime)
        warehouseOrderDTOList[0].showPayTime = Tool.formatTime(datas.payTime)
        warehouseOrderDTOList[0].showDeliverTime = Tool.formatTime(warehouseOrderDTOList[0].deliverTime)
        warehouseOrderDTOList[0].showFinishTime = Tool.formatTime(warehouseOrderDTOList[0].finishTime)
        warehouseOrderDTOList[0].showCancelTime = Tool.formatTime(warehouseOrderDTOList[0].cancelTime)
        this.setData({
          detail:datas,
          showProducts: showProducts,
          showPriceList: showPriceList,
          state: this.orderState(showOutStatus),
          status: showOutStatus
        })
        if (showOutStatus == 3 || showOutStatus == 1) {
          let name = showOutStatus == 1 ? "cancelTime" : "autoReceiveTime"
          this.data.countDownSeconds = Math.floor((warehouseOrderDTOList[0][name] - warehouseOrderDTOList[0].nowTime) / 1000)
          this.countdown(this)
        }
        let expressList = this.getExpressList()
        if (expressList.length == 1) {
          this.getDelivery(expressList.expressList[0].expressNo)
        } else if (expressList.length > 1) {
          let state = this.orderState(showOutStatus)
          state.info = `该订单已拆成${expressList.length}个包裹发出，点击“查看物流”可查看详情`
          this.setData({
            state: state
          })
        }
        // 渲染按钮状态
        this.middleBtn()
      }).catch((res) => {
        console.log(res)
      })
      //       detail.cancelTime = detail.cancelTime ? Tool.formatTime(detail.cancelTime) : '';
      //       detail.showOrderTotalPrice = Tool.add(detail.totalPrice,detail.freightPrice)
      //       detail.showFinishTime = detail.deliverTime? Tool.formatTime(detail.deliverTime) : Tool.formatTime(detail.finishTime)
      //       detail.deliverTime = Tool.formatTime(detail.deliverTime)
      //       detail.showShutOffTime = Tool.formatTime(detail.shutOffTime)
      //       let address = {}
      //       address.receiver = detail.receiver;
      //       address.recevicePhone = detail.recevicePhone;
      //       address.addressInfo = detail.province + detail.city + detail.area + detail.address;
      //       if(detail.sendTime!=''&&detail.sendTime!=null){
      //           detail.sendTime=Tool.formatTime(detail.sendTime);
      //           this.data.state.time= detail.sendTime?detail.sendTime:'';
      //       }else{
      //           detail.sendTime=''
      //       }
      //   detail.orderPayRecord = detail.orderPayRecord || {}
      //   detail.payWay = Tool.bitOperation(this.data.payTypeArr,detail.orderPayRecord.type)
      //   if (detail.payWay.includes(this.data.payTypeArr[0])){
      //     detail.showPlatformTime = Tool.formatTime(detail.platformPayTime)
      //   }
      //   if (detail.payWay.length > 1 || (detail.payWay.length == 1 && !detail.payWay.includes(this.data.payTypeArr[0]))){
      //     detail.isUsedThirdPay = true
      //   }
      //   detail.showProductList = (detail.orderType == 5 || detail.orderType == 98) ? detail.orderProductList[0].orderProductPriceList : detail.orderProductList
      //       if (detail.orderType == 5 || detail.orderType == 98){
      //         detail.orderProductList[0].orderProductPriceList.forEach((item)=>{
      //           item.num = item.productNum
      //           item.price = item.originalPrice
      //         })
      //       }
    },
    onShow: function () {

    },
    //删除订单
    deleteItem() {
        let id = this.data.orderId;
        let status = this.data.detail.status;
        this.setData({
            isDelete: true,
            orderId:id,
            status:status
        });

    },
    dismissCancel() {
      //取消取消订单
      this.setData({
          isCancel: false,
          isDelete: false,
      })
    },
    deleteOrder(){
      API.deleteOrder({
        orderNo: this.data.orderId,
      }).then((res) => {
        this.setData({
          isDelete: false,
        })
        Tool.navigateTo('../my-order/my-order')
      }).catch((res) => {
        this.setData({
          isDelete: false,
        })
        console.log(res)
      })
    },
    cancelItem() {
        this.setData({
            isCancel: true,
        });
    },
    //确认收货
    confirmReceipt() {
      let content = '确认收货吗?'
      let list = this.data.showProducts
        // list.forEach((item,index)=>{
        //   let orderCustomerServiceInfo = item.orderCustomerServiceInfoDTO || {}
        //   console.log(orderCustomerServiceInfo.status)
        //   if (orderCustomerServiceInfo.status == 1) {
        //     content = '确认收货将关闭' + this.data.returnTypeArr[orderCustomerServiceInfo.type] + "申请，确认收货吗？"
        //   }
        // })
        let that=this;
        Tool.showComfirm(content, function () {
          API.confirmReceipt({
            orderNo: that.data.orderId,
          }).then((res) => {
            Tool.navigateTo('../my-order/my-order')
          }).catch((res) => {
            console.log(res)
          })
        })
    },
    //复制
    copy(e){
        let that=this;
        wx.setClipboardData({
            data: that.data.detail.orderNum,
            success: function(res) {
            }
        });

    },
    countdown: function (that) { // 倒计时
      clearTimeout(that.data.time);
      let distanceTime = Tool.showDistanceTime(that.data.countDownSeconds || 0)
      if (that.data.countDownSeconds <0) {
        let status = that.data.status==1? 5:4
        that.setData({
          status: status,
          state: that.orderState(status)
        })
        return
      }
      let time = setTimeout(function () {
        that.data.countDownSeconds--
        that.countdown(that);
      }, 1000)
      that.setData({
        distanceTime: distanceTime,
        time: time
      });
    },
    orderState(n) {
        //按钮状态 left right middle 分别是底部左边 右边 和订单详情中的按钮文案
        let stateArr = [
          { status: '其他', },
          { status: '等待买家付款', 
            bottomBtn: ['取消订单','继续支付'],
            bottomId:[1,2],
            orderIcon: "order-state-1.png", 
            info: '',
            time: ''
          },
          { status: '买家已付款',
            bottomBtn: ['', '订单退款'],
            bottomId: ['',3],
            orderIcon: "order-state-2.png.png", 
            info: '等待卖家发货...', 
            time: '' 
          },
          { status: '卖家已发货',
            bottomBtn: ['查看物流', '确认收货'], 
            bottomId: [5, 4],
            orderIcon: "order-state-3.png",
            info: '订单正在处理中...',
            time: ''
          },
          { status: '交易已完成',
            bottomBtn: ['删除订单', '再次购买'], 
            bottomId: [6,5],
            orderIcon: "order-state-5.png",
            info: '订单正在处理中...',
            time: ''
          },
          { status: '交易关闭',
            bottomBtn: ['删除订单', '再次购买'], 
            bottomId: [6, 5], 
            orderIcon: "order-state-6.png",
            info: '',
            time: ''
          }
        ]
        return stateArr[n]
    },
    continuePay() {
      let params = {
        payAmount: this.data.showPriceList.payAmount, //总价
        orderNo: this.data.showPriceList.platformOrderNo,  // 流水号
      }
      Storage.setPayOrderList(params)
      Tool.navigateTo('/pages/order-confirm/pay/pay?door=1&isContinuePay=' + true)
    },
    //再次购买
    continueBuy(){
      let list = []
      let warehouseOrderDTOList = this.data.detail.warehouseOrderDTOList
      warehouseOrderDTOList.forEach((item, index) => {
        item.products.forEach((item1) => {
          list.push({
            productCode: item1.prodCode,
            showCount: item1.quantity,
            skuCode: item1.skuCode,
          })
        })
      })
      if (list.length > 0) {
        Storage.setShoppingCart(list);
        Event.emit('continueBuy');
        Tool.switchTab('/pages/shopping-cart/shopping-cart')
      }
    },
    middleBtn(){
      let detail = this.data.detail
      let outOrderState = this.data.status // 外订单状态
      // let childrenList = detail.orderProductList
      let state = this.data.state
      let btnArr = []
      let now = detail.warehouseOrderDTOList[0].nowTime
      this.data.showProducts.forEach((item,index)=>{
        let middle = ''
        let orderCustomerServiceInfo = item.orderCustomerServiceInfo || {}
        let innerState = orderCustomerServiceInfo.status // 子订单状态
        let returnType = orderCustomerServiceInfo.type
        let finishTime = orderCustomerServiceInfo.finishTime
        // 不支持的售后种类
        // let arr = Tool.bitOperation(this.data.afterSaleTypeArr, item.restrictions)
        // 支持的售后种类
        // let afterSaleType = this.data.afterSaleTypeArr.filter(function (n) {
        //   return arr.indexOf(n) == -1
        // });
        // item.afterSaleType = afterSaleType
        if (outOrderState == 2){
          // if (afterSaleType.includes(4)) middle = {  id: 1, content: '退款' }
          middle = { id: 1, content: '退款' }
        }
        // 确认收货的状态的订单售后截止时间和当前时间比 (outOrderState == 4 && finishTime - now > 0)
        if (outOrderState == 3 || outOrderState == 4  ){
          middle = { id: 2, content: '退换' }
          // if (afterSaleType.length>1){
          //   middle = { id: 4, content: '退换' }
          // } else{
          //   let index = this.data.afterSaleTypeArr.indexOf(afterSaleType[0])
          //   if (index != -1) {
          //     let btnId = 0
          //     // [4, 8, 16],// 退款 换货 退货 
          //     btnId = afterSaleType[0] == 4 ? 1 : afterSaleType[0] == 16 ? 2:3
          //     middle = { id: btnId, content: this.data.types[index] }
          //   }
          // }
        }
        if (innerState<=4) {
          let arr = ["退款中",'退货中','换货中']
          middle = { id: 3, inner: innerState, content: arr[returnType-1],returnType: returnType } 
          // state.isHiddenComfirmBtn = true
        }

        if (innerState==5 && returnType) {
          let content = outOrderState == 2? "退款成功" :"售后完成"
          middle = { id: 0, inner: innerState, content: content, returnType: returnType}
        }
        item.middleBtn = middle
      })
      
      this.setData({
        showProducts: this.data.showProducts,
        state: state
      })
    },
    subBtnClicked(e){
      // returnProductStatus  1申请中 2已同意 3已拒绝 4买家发货中 5卖家云仓发货中 6已完成 7关闭 8超时

      // getReturnProductType 1退款 2退货 3换货 

      let btnTypeId = e.currentTarget.dataset.id 

      let index = e.currentTarget.dataset.index

      let list = this.data.showProducts[index]
      list.showCreateTime = this.data.detail.warehouseOrderDTOList[0].showCreateTime

      // 升级礼包不支持售后 售后时间超出等都要给提示
      if (this.data.detail.orderSubType == 3) {
        Tool.showAlert('该商品属于升级礼包产品，不存在售后功能')
        return
      }else if (list.afterSaleTime < this.data.detail.warehouseOrderDTOList[0].nowTime) {
        Tool.showAlert('该商品售后已过期')
        return
      }

      Storage.setInnerOrderList(list)

      // 跳转页面

      this.goPage(list, btnTypeId)
    },
    goPage(list,btnTypeId){
      let page = ''
      let orderCustomerServiceInfoDTO =list.orderCustomerServiceInfoDTO || {}
      let returnType = orderCustomerServiceInfoDTO.type || ''
      let serviceNo = orderCustomerServiceInfoDTO.serviceNo || ''
      // let returnProductStatus = list.returnProductStatus
      let params = "?serviceNo=" + serviceNo
      if (returnType == 1) {

        page = '/pages/after-sale/only-refund/only-refund-detail/only-refund-detail'

      } else if (returnType == 2) {

        page = '/pages/after-sale/return-goods/return-goods'

      } else if (returnType == 3) {

        page = '/pages/after-sale/exchange-goods/exchange-goods'

      } else if (btnTypeId ==1) {
        params = ''
        // 0为仅退款 1为退货退款  2为换货
        page = '/pages/after-sale/apply-sale-after/apply-sale-after?refundType=' + (btnTypeId - 1) + '&orderProductNo='+list.orderProductNo

      } else if (btnTypeId == 2) {   
        page = '/pages/after-sale/choose-after-sale/choose-after-sale' 
      }
      Tool.navigateTo(page + params)
    },
    productClicked(e){
      let id = e.currentTarget.dataset.productid
      Tool.navigateTo('/pages/product-detail/product-detail?prodCode=' + id)
      // if (this.data.detail.orderType == 5 || this.data.detail.orderType==98 ){
      //   Tool.navigateTo('/pages/product-detail/gift-bag-detail/gift-bag-detail?giftBagId=' + this.data.detail.orderProductList[0].activityCode)
      // } else {
        
      // }
    },
    orderRefund(){
      Tool.showAlert('目前只支持单件商品退款，请进行单件退款操作~')
    },
    seeLogistics(e){
      let express = this.getExpressList()
      if (express.length > 1) {
        Storage.setExpressInfo(express.expressList)
        Tool.navigateTo('/pages/logistics/logistics-list/logistics-list')
      } else if (express.length == 1) {
        Tool.navigateTo('/pages/logistics/logistics?id=' + express.expressList[0].expressNo)
      } 
    },
    getExpressList(){
      let warehouseOrderDTOList = this.data.detail.warehouseOrderDTOList || [];
      let expressList = warehouseOrderDTOList[0].expressList || []
      return { length: expressList.length, expressList}
    },
    // logisticsClicked(){
    //   // 跳转查看物流信息
    //   if (this.data.detail.expressNo){
    //     // let page = '/pages/logistics/logistics?orderId=' + this.data.orderId
    //     // Tool.navigateTo(page)
    //     this.seeLogistics()
    //   }
    // },
    getDelivery(expressNo) {
      // 查询物流信息最后一条数据
      API.getOrderDeliverInfo({
        expressNo: expressNo
      }).then((res) => {
        let datas = res.data || '{}'
        datas = JSON.parse(datas)
        let result = datas.result || {}
        if (datas.status==0){
          let list = result.list || []
          let state = this.orderState(this.data.status)
          state.info = list[0].status
          state.time = list[0].time
          this.setData({
            state: state
          })
        }
      }).catch((res) => {
        console.log(res)
      })
    },
    onUnload: function () {
      clearTimeout(this.data.time)
      Event.off('getDetail', this.getDetail)
    },
})