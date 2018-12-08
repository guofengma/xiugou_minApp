let { Tool, API, Storage, Event, Operation } = global;
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
      let reqName = this.properties.condition ? "searchOrder" :"queryOrderPageList"
      API[reqName](params).then((res) => {
        let datas = res.data || {}
        let secondMap = new Map()
        let key = this.data.key
        let orderInfoArr = []
        let warehouseOrderDTOList = datas.data.warehouseOrderDTOList || []
        datas.data.forEach((item, index) => {
          let warehouseOrderDTOList = item.warehouseOrderDTOList || []
          let outStatus = item.warehouseOrderDTOList[0].status
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
            let now = Tool.timeStringForDate(new Date(), "YYYY-MM-DD HH:mm:ss");
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
        // 这块是倒计时 暂时取消不做了
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
      
      // let params = {
      //   size: this.data.pageSize,
      //   lastPageCreateTime: lastOrder.createTime || '',
      //   status:index || '',
      //   condition:this.properties.condition || '',
      //   reqName: "获取我的订单列表"+index,
      //   url: Operation.queryOrderPageList
      // }
      // let list = this.data.list;
      // this.setData({
      //   params: params
      // });
      // let r = RequestFactory.wxRequest(params);
      // r.successBlock = (req) => {
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
      //   this.setData({
      //     list: list.concat(datas),
      //     totalPage: req.responseObject.data.totalPage,
      //     secondArry: secondMap,
      //     key: key
      //   });
      //   if (!req.responseObject.data.totalPage) {
      //     this.setData({
      //       tipVal: 7
      //     });
      //   } else {
      //     this.setData({
      //       tipVal: ''
      //     });
      //   }
      //   // 这块是倒计时 暂时取消不做了
      //   if (secondMap.size > 0) {
      //     this.countdown(this);
      //   }
      // };
      // Tool.showErrMsg(r)
      // r.addToQueue();
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
      Tool.navigateTo('/pages/logistics/logistics?id=' + e.currentTarget.dataset.id)
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
      list.orderProductList.forEach((item,index)=>{
        let returnProductStatus = item.returnProductStatus || 99999
        // returnProductStatus < 6 && returnProductStatus!=3
        if (returnProductStatus ==1){
          content = '确认收货将关闭' + this.data.returnTypeArr[item.returnType]+"申请，确认收货吗？"
        }
      })
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
      let item = e.currentTarget.dataset.item;
      let params = {
        payAmount: item.needPrice, //总价
        orderNo: item.orderNo  // 流水号
      };
      Storage.setPayOrderList(params)
      Tool.navigateTo('/pages/order-confirm/pay/pay?door=1&isContinuePay=true')
    },
    //再次购买
    continueBuy(e) {
      let list = []
      let products = this.data.list.showProducts
      products.forEach((item,index)=>{
        list.push({
          productCode: item.prodCode,
          amount: item.quantity,
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
      if (order.status == 1) {
        let second = mapArry.get(i);
        if (second) {//秒数>0
          let countdown = Tool.showDistanceTime(this.data.datas.countDownSeconds || 0)
          order.countDownTime = countdown + '后自动取消订单';
          mapArry.set(i, countdown);
        } else {
          //order.countDownTime = '交易关闭';
          clearTimeout(this.data.time);
          order.status = 8
          if (this.data.num == 1) {
            orderArry.splice(i, 1)
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
