let { Tool, API, Storage, Event } = global;
Component({
  properties: {
    num:Number,
    condition:String,
  },
  data: {
    num: 0,
    params: {},
    totalPage: '', // 页面总页数
    currentPage: 1, // 当前的页数
    pageSize: 10, // 每次加载请求的条数 默认10
    list: [],
    tipVal: '',//是否暂无数据
    isCancel: false,//是否取消订单
    isDelete: false, //是否删除订单
    orderId: '',
    status: '',
    orderNum: '',
    key: 0,
    time:"",
    returnTypeArr:['','退款','退货','换货'],
  },
  methods: {
    //获取列表数据
    getList(e) {
      this.setData({
        num: this.properties.num,
        list: [],
        tipVal: '',
        key: 0,
        currentPage: 1
      });
      this.getData(this.properties.num);
    },
    //获取数据
    getData(index) {
      let list = this.data.list
      let lastOrder = list[list.length - 1] || {}
      let params = {
        size: this.data.pageSize,
        page: this.data.currentPage,
        status: index || '',
        keywords: this.properties.condition || '', // 关键字
      }
      API.queryOrderPageList(params).then((res) => {
        let datas = res.data || {}
        let secondMap = new Map()
        let key = this.data.key
        let orderInfoArr = []
        let warehouseOrderDTOList = datas.data.warehouseOrderDTOList || []
        datas.data.forEach((item, index) => {
          let warehouseOrderDTOList = item.warehouseOrderDTOList || []
          let outStatus = item.warehouseOrderDTOList[0].status
          item.countDownSeconds = Math.floor((warehouseOrderDTOList[0].cancelTime - item.nowTime) / 1000) 
          if (outStatus == 1) {
            let showOrderList = []
            warehouseOrderDTOList.forEach((item1, index1) => {
              item1.products.forEach((item2) => {
                showOrderList.push(item2)
              })
            })
            orderInfoArr.push({
              ...item,
              showStatus: 1,
              showNum: item.quantity,
              showOrderNo: item.platformOrderNo,
              showAmount: item.payAmount,
              showProducts: showOrderList,
              showName: '平台级订单'
            })
            secondMap.set(key, 1);
          } else {
            warehouseOrderDTOList.forEach((item1, index1) => {
              let showNum =0
              item1.products.forEach((item2) => {
                showNum += item2.quantity
              })
              orderInfoArr.push({
                ...item,
                showWarehouseInfo: {
                  ...item1,
                },
                showNum: showNum,
                showAmount: item1.payAmount,
                showStatus: item1.status,
                showOrderNo: item1.warehouseOrderNo,
                showProducts: item1.products,
                showName: '仓库级订单'
              })
            })
            delete orderInfoArr[index].showWarehouseInfo.products
          }
          key++;
        })
        
        if (!datas.totalPage) {
          this.setData({
            tipVal: 7
          });
        } else {
          this.setData({
            tipVal: ''
          });
        }
        // 这块是倒计时
        if (secondMap.size > 0) {
          this.countdown(this);
        }
        this.setData({
          list: list.concat(orderInfoArr),
          totalPage: datas.totalPage,
          secondArry: secondMap,
          key: key
        });
        console.log(this.data.list)
      }).catch((res) => {
        console.log(res)
      })
      
      //   let datas = [];
      //   let secondMap = new Map();
      //   let key = this.data.key;
      //   for (let i in req.responseObject.data.data) {
      //     let item = req.responseObject.data.data[i];
      //     item.createTime = Tool.formatTime(item.createTime);
      //     item.finishTime = Tool.formatTime(item.finishTime);
      //     item.showFinishTime = item.deliverTime ? Tool.formatTime(item.deliverTime) : item.finishTime;
      //     item.sendTime = Tool.formatTime(item.sendTime);
      //     item.payTime = Tool.formatTime(item.payTime);
      //     item.cancelTime = Tool.formatTime(item.cancelTime);
      //     item.payEndTime = Tool.formatTime(item.shutOffTime);
      //     // item.createTime = Tool.formatTime(item.orderCreateTime);
      //     // 礼包不显示产品描述
      //     // if (item.orderProductList[0].orderType == 98) item.orderProduct[0].spec=''
      //     // 这块是倒计时 
      //     if (item.status == 1) {
      //       let now = Tool.timeStringForDate(new Date(), "YYYY-MM-DD HH:mm:ss");
      //       secondMap.set(key, 1);
      //     }
      //     key++;
      //     datas.push(item);
      //   }
    },
    // 上拉加载更多
    onReachBottom() {
      let { currentPage, totalPage } = this.data
      currentPage++
      if (totalPage >= currentPage) {
        this.setData({
          currentPage: currentPage
        })
        this.getData(this.data.num);
      }

    },
    //跳到订单详情
    toOrderDetail(e) {
      Tool.navigateTo('/pages/my/orderDetail/orderDetail?orderId=' + e.currentTarget.dataset.id + '&status=' + e.currentTarget.dataset.status+'&num='+this.data.num)
    },
    //跳到物流页面
    logistics(e) {
      let index = e.currentTarget.dataset.index
      let expressList = this.data.list[index].showWarehouseInfo.expressList || []
      if (expressList.length>1){
        console.log('多物流')
        Storage.setExpressInfo(expressList)
        Tool.navigateTo('/pages/logistics/logistics-list/logistics-list')
      } else if (expressList.length== 1){
        Tool.navigateTo('/pages/logistics/logistics?id=' + expressList[0].expressNo)
      } 
    },
    //删除订单
    deleteItem(e) {
      let id = e.currentTarget.dataset.id;
      this.setData({
        isDelete: true,
        orderId: id,
      });
    },
    dismissCancel() {
      //取消取消订单
      this.setData({
        isCancel: false,
        isDelete: false,
      })
    },
    deleteOrder() {
      API.deleteOrder({
        orderNo: this.data.orderId,
      }).then((res) => {
        this.setData({
          list: [],
          isDelete: false,
        });
        this.getData(this.data.num);
      }).catch((res) => {
        this.setData({
          isDelete: false,
        })
        console.log(res)
      })
    },
    cancelOrder() {
      this.setData({
        isCancel: false,
        list: [],
        key:0
      });
      console.log(this.data.num)
      this.getData(this.data.num);
    },
    cancelItem(e) {
      let orderNum = e.currentTarget.dataset.ordernum;
      this.setData({
        isCancel: true,
        orderNum: orderNum,
      });
    },
    //确认收货
    confirmReceipt(e) {
      let content = '确认收货吗?'
      let index = e.currentTarget.dataset.index;
      let id = e.currentTarget.dataset.id;
      let list = this.data.list[index]
      // list.showProducts.forEach((item,index)=>{
      //   let orderCustomerServiceInfo = item.orderCustomerServiceInfoDTO || {}
      //   console.log(orderCustomerServiceInfo.status)
      //   if (orderCustomerServiceInfo.status == 1) {
      //     content = '确认收货将关闭' + this.data.returnTypeArr[orderCustomerServiceInfo.type] + "申请，确认收货吗？"
      //   }
      // })
      let that = this;
      Tool.showComfirm(content, function () {
        API.confirmReceipt({
          orderNo:id,
        }).then((res) => {
          that.setData({
            list: []
          })
          that.getData(that.data.num);
        }).catch((res) => {
          console.log(res)
        })
      })
    },
    //立即支付
    continuePay(e) {
      let index = e.currentTarget.dataset.index;
      let item = this.data.list[index]
      console.log(item)
      let params = {
        payAmount: item.payAmount, //总价
        orderNo: item.platformOrderNo  // 流水号
      };
      Storage.setPayOrderList(params)
      Tool.navigateTo('/pages/order-confirm/pay/pay?door=1&isContinuePay=true')
    },
    //再次购买
    continueBuy(e) {
      let list = []
      let index = e.currentTarget.dataset.index
      let products = this.data.list[index].showProducts
      products.forEach((item,index)=>{
        list.push({
          productCode: item.prodCode,
          showCount: item.quantity,
          skuCode: item.skuCode,
        })
      })
      if(list.length>0){
        Storage.setShoppingCart(list);
        Event.emit('continueBuy');
        Tool.switchTab('/pages/shopping-cart/shopping-cart')
      }
    },
    /**
  * 倒计时
  */
  countdown(that) { // 倒计时
    clearTimeout(that.data.time);
    let mapArry = that.data.secondArry;
    let orderArry = that.data.list;
    for (let i = 0; i < orderArry.length; i++) {
      let order = orderArry[i];
      if (order.showStatus == 1) {
        let second = mapArry.get(i);
        if (second) {//秒数>0
          let nowTime = order.nowTime
          let warehouseOrderDTOList = order.warehouseOrderDTOList
          let countdown = Tool.showDistanceTime(order.countDownSeconds || 0)
          order.countDownTime = countdown + '后自动取消订单';
          mapArry.set(i, countdown);
          order.countDownSeconds--
        } else {
          //order.countDownTime = '交易关闭';
          clearTimeout(this.data.time);
          order.showStatus = 5
          if (this.data.num == 1) {
            orderArry.splice(i, 1)
          } else {
            order.countDownTime=''
          }
          if (orderArry.length == 0) {
            this.setData({
              tipVal: 7
            })
          }
        }
      }
    }
    let time = setTimeout(function () {
      that.countdown(that);
    }, 1000)
    that.setData({
      list: orderArry,
      time: time
    })
  },
  onUnload(){
    clearTimeout(this.data.time);
  },
  },
  ready: function () {
    //this.getData(this.properties.num);
  },
  
})
