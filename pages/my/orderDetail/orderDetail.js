let { Tool, RequestFactory, Storage, Event, Operation} = global;

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
      afterSaleTypeArr:[1,2,4,8,16],// 不支持优惠卷  不支持1元劵  不支持退款 不支持换货 不支持退货 
      types:['退款','换货','退货','退换'],
      hasData:true,
      imgSrcUrl: 'https://dnlcrm.oss-cn-beijing.aliyuncs.com/xcx/',
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
    },
    onLoad: function (options) {
        this.setData({
            orderId: options.orderId,
            status: options.status,
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
      let params = {
        id: this.data.orderId,
        reqName: '订单详情',
        url: Operation.getOrderDetail
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
            let detail=req.responseObject.data;
            detail.createTime=detail.createTime?Tool.formatTime(detail.createTime):'';
            detail.sysPayTime=detail.sysPayTime?Tool.formatTime(detail.sysPayTime):'';
            detail.payTime=detail.payTime?Tool.formatTime(detail.payTime):'';
            detail.cancelTime = detail.cancelTime ? Tool.formatTime(detail.cancelTime) : '';
            detail.showOrderTotalPrice = Tool.add(detail.totalPrice,detail.freightPrice)
            let address = {}
            address.receiver = detail.receiver;
            address.recevicePhone = detail.recevicePhone;
            address.addressInfo = detail.province + detail.city + detail.area + detail.address;
            if(detail.sendTime!=''&&detail.sendTime!=null){
                detail.sendTime=Tool.formatTime(detail.sendTime);
                this.data.state.time= detail.sendTime?detail.sendTime:'';
            }else{
                detail.sendTime=''
            }
            
            if (detail.status == 1 || detail.status == 3) { // 开始倒计时
              let that = this
              let time = setInterval(function () { that.time() }, 1000)
              this.setData({
                time: time
              })
            } 
            this.setData({
                detail: detail,
                address: address,
                state: this.orderState(detail.status)//订单状态相关信息this.data.state
            })
            if (detail.expressNo) {
              this.getDelivery(detail)
            }
            if (detail.orderType != 5){
              this.middleBtn()
            }
        };
        Tool.showErrMsg(r)
        r.addToQueue();
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
      let url = ''
      let reqName = ''
      if (this.data.status == 4 || this.data.status == 5 ){//已完成订单     
        url = Operation.deleteOrder
        reqName = '删除订单'
      } else if (this.data.status == 7 || this.data.status == 8 || this.data.status == 6){
        url = Operation.deleteClosedOrder
        reqName = '删除订单'
      }
      let params = {
        orderNum: this.data.detail.orderNum,
        reqName: reqName,
        url: url
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        this.setData({
          isDelete: false,
        });
        Tool.navigateTo('../my-order/my-order')
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    cancelItem() {
        this.setData({
            isCancel: true,
        });
    },
    //确认收货
    confirmReceipt() {
        let id = this.data.orderId;
        let that=this;
        Tool.showComfirm('确认收货？', function () {
          let params = {
            orderNum: that.data.detail.orderNum,
            reqName: '确认收货',
            url: Operation.confirmReceipt
          }
          let r = RequestFactory.wxRequest(params);
          r.successBlock = (req) => {
            Tool.navigateTo('../my-order/my-order')
          };
          Tool.showErrMsg(r)
          r.addToQueue();
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
    time() {
      //待付款订单 倒计时处理
      let detail = this.data.detail
      let time = ''
      if (detail.status==3){
        time = detail.autoReceiveTime
      } else {
        time = detail.shutOffTime
      }
      let endTime = Tool.formatTime(time) 
      let countdown = Tool.getDistanceTime(endTime, this)
      if (countdown ==0){
        detail.status = detail.status==1? 8:4
        clearTimeout(this.data.time);
        this.setData({
          detail: detail,
          state: this.orderState(detail.status)//订单状态相关信息
        })
      }
    },
    orderState(n) {
        //按钮状态 left right middle 分别是底部左边 右边 和订单详情中的按钮文案
        let stateArr = [
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
            info: '仓库正在扫描出仓...',
            time: ''
          },
          { status: '交易已完成',
            bottomBtn: ['删除订单', '再次购买'], 
            bottomId: [6,5],
            orderIcon: "order-state-5.png",
            info: '仓库正在扫描出仓...',
            time: ''
          },
          {
            status: '交易已完成',
            bottomBtn: ['删除订单', '再次购买'],
            bottomId: [6, 5],
            orderIcon: "order-state-5.png",
            info: '仓库正在扫描出仓...',
            time: ''
          },
          { status: '退换货完成',
            bottomBtn: ['删除订单', '再次购买'],
            bottomId: ['', 5], 
            orderIcon: "order-state-5.png", 
            info: '仓库正在扫描出仓...',
            time: '' 
          },
          { status: '交易关闭',
            bottomBtn: ['删除订单', '再次购买'], 
            bottomId: [6, 5], 
            orderIcon: "order-state-6.png",
            info: '',
            time: ''
          },
          {
            status: '交易关闭',
            bottomBtn: ['删除订单', '再次购买'],
            bottomId: [6, 5],
            orderIcon: "order-state-6.png",
            info: '',
            time: ''
          }
        ]
        return stateArr[n-1]
    },
    continuePay() {
      let params = {
        totalAmounts: this.data.detail.needPrice, //支付的钱
        orderNum: this.data.detail.orderNum,// 订单号
        outTradeNo: this.data.detail.outTradeNo||'', // 是否继续支付
      }
      Storage.setPayOrderList(params)
      Tool.navigateTo('/pages/order-confirm/pay/pay?isContinuePay=' + true)
    },
    //再次购买
    continueBuy(){
      let params = {
        id: Number(this.data.orderId),
        reqName: '再次购买获取规格',
        url: Operation.orderOneMore
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let datas = req.responseObject.data;
        let orderProducts = datas.orderProducts || []
        let list = []
        orderProducts.forEach((item) => {
          list.push({
            productId: item.productId,
            priceId: item.priceId,
            amount: item.num,
            showCount: item.num,
            isSelect: true
          })
        });
        if (list.length > 0) {
          Storage.setShoppingCart(list);
          Event.emit('continueBuy');
          Tool.switchTab('/pages/shopping-cart/shopping-cart')
        }
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    test(arr){
      let afrerSaleType = []
      this.data.afterSaleTypeArr.forEach((item)=>{
        if (arr.includes(item)){
          afrerSaleType.push(false)
        } else{
          afrerSaleType.push(true)
        }
      })
      let arr2 = afrerSaleType.slice(2)
      let num = 0;
      arr2.forEach((item)=>{
        if(item){
          num++
        }
      })
      arr2.push(num)
      return arr2
    },
    middleBtn(){
      let detail = this.data.detail
      let outOrderState = detail.status // 外订单状态
      let childrenList = detail.orderProductList 
      let state = this.data.state
      let btnArr = []
      childrenList.forEach((item,index)=>{
        let middle = ''
        let innerState = item.status // 子订单状态
        let returnType = item.returnType
        let finishTime = item.finishTime
        let now = new Date().getTime()
        let arr = this.data.afterSaleTypeArr.filter((item0)=>{
          return item0 & item.restrictions == item0
        })
        let btnArr = this.test(arr)
        if (outOrderState == 2){
          if (btnArr[0]) middle = {  id: 1, content: '退款' }
        }
        // 确认收货的状态的订单售后截止时间和当前时间比
        if (outOrderState == 3 || (outOrderState == 4 && finishTime - now > 0) ){
          if (btnArr[btnArr.length-1]>1){
            middle = { id: 4, content: '退换' }
          } else{
            let index = btnArr.indexOf(true)
            if(index!=-1){
              middle = { id: index+1, content: this.data.types[index] }
            }
          }
          
        }
        if (innerState == 4) {
          let arr = ["退款中",'退货中','换货中']
          middle = { id: 3, inner: innerState, content: arr[returnType-1],returnType: returnType } 
          state.isHiddenComfirmBtn = true
        }

        if (innerState==6 && returnType) {
          middle = { id: 0, inner: innerState, content: '售后完成', returnType: returnType}
        }
        item.middleBtn = middle
      })
      
      this.setData({
        detail: detail,
        state: state
      })
    },
    subBtnClicked(e){
      // returnProductStatus  1申请中 2已同意 3已拒绝 4买家发货中 5卖家云仓发货中 6已完成 7关闭 8超时

      // getReturnProductType 1退款 2退货 3换货 

      let btnTypeId = e.currentTarget.dataset.id 

      let index = e.currentTarget.dataset.index

      let list = this.data.detail.orderProductList[index]

      list.orderNum = this.data.detail.orderNum

      list.createTime = this.data.detail.createTime

      list.showRefund = list.price * list.num

      list.address = this.data.address

      Storage.setInnerOrderList(this.data.detail.orderProductList[index])

      // 跳转页面

      this.goPage(list, btnTypeId)
    },
    goPage(list,btnTypeId){
      let page = ''
      let returnType = list.returnType
      let returnProductStatus = list.returnProductStatus
      let params = "?id=" + list.returnProductId
      console.log(list)
      if (returnType == 1) {

        page = '/pages/after-sale/only-refund/only-refund-detail/only-refund-detail'

      } else if (returnType == 2) {

        page = '/pages/after-sale/return-goods/return-goods'

      } else if (returnType == 3) {

        page = '/pages/after-sale/exchange-goods/exchange-goods'

      } else if (btnTypeId == 1) {
        params = ''
        page = '/pages/after-sale/apply-sale-after/apply-sale-after?refundType=0'

      } else if (btnTypeId == 4) {   
        page = '/pages/after-sale/choose-after-sale/choose-after-sale'
      }
      Tool.navigateTo(page + params)
    },
    productClicked(e){
      let id = e.currentTarget.dataset.productid
      Tool.navigateTo('/pages/product-detail/product-detail?productId=' + id)
    },
    orderRefund(){
      Tool.showAlert('目前只支持单件商品退款，请进行单件退款操作~')
    },
    seeLogistics(e){
      let id = this.data.detail.expressNo;
      Tool.navigateTo('/pages/logistics/logistics?id='+id)
    },
    logisticsClicked(){
      // 跳转查看物流信息
      if (this.data.detail.expressNo){
        // let page = '/pages/logistics/logistics?orderId=' + this.data.orderId
        // Tool.navigateTo(page)
        this.seeLogistics()
      }
    },
    getDelivery(detail) {
      // 查询物流信息最后一条数据
      let params = {
        expNum: this.data.detail.expressNo,
        requestMethod: 'GET',
        reqName: '物流查看',
        url: Operation.findLogisticsDetail
      }
      let state = this.orderState(detail.status)
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let datas = req.responseObject.data;
        if (datas) {
          if (datas.showapi_res_body && datas.showapi_res_body.data) {
            let list = datas.showapi_res_body.data;
            let tempList = [];
            if (list.length) {
              state.info = list[0].context
              state.time = list[0].time
            } 
          }
        }
        this.setData({
          state: state
        })
      };
      Tool.showErrMsg(r);
      r.addToQueue();
    },
    onUnload: function () {
      clearTimeout(this.data.time)
      Event.off('getDetail', this.getDetail)
    },
})