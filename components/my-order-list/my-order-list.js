let { Tool, RequestFactory, Storage, Event, Operation } = global;
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
    time:""
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
      let params = {
        size: this.data.pageSize,
        page: this.data.currentPage,
        status:index || '',
        orderNum:this.properties.condition || '',
        reqName: "获取我的订单列表"+index,
        url: Operation.queryOrderPageList
      }
      let list = this.data.list;
      this.setData({
        params: params
      });
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let datas = [];
        let secondMap = new Map();
        let key = this.data.key;
        
        for (let i in req.responseObject.data.data) {
          let item = req.responseObject.data.data[i];
          item.createTime = Tool.formatTime(item.createTime);
          item.finishTime = Tool.formatTime(item.finishTime);
          item.sendTime = Tool.formatTime(item.sendTime);
          item.payTime = Tool.formatTime(item.payTime);
          // item.createTime = Tool.formatTime(item.orderCreateTime);
          // 礼包不显示产品描述
          // if (item.orderProductList[0].orderType == 98) item.orderProduct[0].spec=''
          // 这块是倒计时 
          if (item.status == 1) {
            let now = Tool.timeStringForDate(new Date(), "YYYY-MM-DD HH:mm:ss");
            secondMap.set(key, 1);
          }
          key++;
          datas.push(item);
        }
        this.setData({
          list: list.concat(datas),
          totalPage: req.responseObject.data.totalPage,
          secondArry: secondMap,
          key: key
        });
        
        if (!req.responseObject.data.totalPage) {
          this.setData({
            tipVal: 2
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
      };
      Tool.showErrMsg(r)
      r.addToQueue();
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
      Tool.navigateTo('/pages/my/orderDetail/orderDetail?orderId=' + e.currentTarget.dataset.id + '&status=' + e.currentTarget.dataset.status)
    },
    //跳到物流页面
    logistics(e) {
      Tool.navigateTo('/pages/logistics/logistics?id=' + e.currentTarget.dataset.id)
    },
    //删除订单
    deleteItem(e) {
      let id = e.currentTarget.dataset.id;
      console.log(id)
      let status = e.currentTarget.dataset.status;
      this.setData({
        isDelete: true,
        orderId: id,
        status: status,
      });
      // this.deleteOrder()
    },
    dismissCancel() {
      //取消取消订单
      this.setData({
        isCancel: false,
        isDelete: false,
      })
    },
    deleteOrder() {
      let url = ''
      let reqName = ''
      if (this.data.status == 4 || this.data.status == 5 ) {//已完成订单/待确认
        url = Operation.deleteOrder
        reqName = '删除订单'
      } else {
        url = Operation.deleteClosedOrder
        reqName = '删除订单'
      }
      let params = {
        orderNum: this.data.orderId,
        url: url,
        reqName: reqName
      };
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        this.setData({
          list: []
        });
        this.getData(this.data.num);
      };
      r.completeBlock = (req) => {
        this.setData({
          isDelete: false,
        });
      }
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    cancelOrder() {
      this.setData({
        isCancel: false,
        list: []
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
      let id = e.currentTarget.dataset.id;
      let that = this;
      Tool.showComfirm('确认收货？', function () {
        let params = {
          orderNum: id,
          reqName: '确认收货',
          url: Operation.confirmReceipt,
        }
        let r = RequestFactory.wxRequest(params);
        r.successBlock = (req) => {
          that.setData({
            list: []
          });
          that.getData(that.data.num);
        };
        Tool.showErrMsg(r);
        r.addToQueue();
      })
    },
    //立即支付
    continuePay(e) {
      let item = e.currentTarget.dataset.item;
      let params = {
        totalAmounts: item.needPrice, //总价
        orderNum: item.orderNum, // 订单号
        outTradeNo: item.outTradeNo  // 流水号
      };
      Storage.setPayOrderList(params)
      Tool.navigateTo('/pages/order-confirm/pay/pay?isContinuePay=' + true + '&data=' + JSON.stringify(params))
    },
    //再次购买
    continueBuy(e) {
      let params = {
        orderId: e.currentTarget.dataset.id,
        reqName: '再次购买获取规格',
        url: Operation.orderOneMore,
      }
      let r = RequestFactory.wxRequest(params);
      // let r = RequestFactory.orderOneMore(params);
      r.successBlock = (req) => {
        let datas = req.responseObject.data;
        datas.forEach((item) => {
          item.sareSpecId = item.id;
          item.productNumber = item.num;
          item.isSelect = true
        });
        Storage.setShoppingCart(datas);
        Event.emit('continueBuy');
        Tool.switchTab('/pages/shopping-cart/shopping-cart')
      };
      Tool.showErrMsg(r);
      r.addToQueue();
    },
    /**
  * 倒计时
  */
    countdown: function (that) {
      clearTimeout(this.data.time);
      let mapArry = that.data.secondArry;
      let orderArry = that.data.list;
      for (let i = 0; i < orderArry.length; i++) {
        let order = orderArry[i];
        if (order.status == 1) {
          let second = mapArry.get(i);
          if (second) {//秒数>0
            // let countDownTime = Tool.timeStringForTimeCount(second);
            let endTime = Tool.formatTime(order.shutOffTime)
            let countdown = Tool.getDistanceTime(endTime, this,1)
            order.countDownTime = countdown + '后自动取消订单';
            mapArry.set(i, countdown);
          } else {
            //order.countDownTime = '交易关闭';
            clearTimeout(this.data.time);
            order.status = 8
            if(this.data.num==1){
              orderArry.splice(i,1)
            }
            if (orderArry.length==0){
              this.setData({
                tipVal:2
              })
            }
            this.setData({
              list: orderArry
            })
          }
        }
      }

      let time = setTimeout(function () {
        that.countdown(that);
      }, 1000)

      that.setData({
        list: orderArry,
        time: time
      });
    },
    onUnload(){
      clearTimeout(this.data.time);
    },
  },
  ready: function () {
    //this.getData(this.properties.num);
  }
})
