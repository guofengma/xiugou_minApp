// pages/my/account.js
let { Tool, RequestFactory, Storage, Event, Operation } = global
Page({
    data: {
        params: {},
        totalPage: '', // 页面总页数
        currentPage: 1, // 当前的页数
        pageSize: 10, // 每次加载请求的条数 默认10
        list: [],
        hasNext: true,//是否有下一页
        title:{
          100: ['支付成功', '/pages/my/information/informationDetail/informationDetail','allItem'],
          101: ['退款成功', '/pages/my/information/informationDetail/informationDetail','allItem'],
          102: ['获得秀豆'],
          103: ['身份认证驳回'],
          104: ['订单超时', '/pages/my/orderDetail/orderDetail?orderId=','orderId'],
          105: ['优惠券提醒','/pages/my/coupon/my-coupon/my-coupon'],
          106: ['反馈问题回复'],
          107: ['秒杀活动', '/pages/product-detail/seckill-detail/seckill-detail?code=','param'],
          108: ['降价拍活动', '/pages/product-detail/discount-detail/discount-detail?code=','param'],
          109: ['待提现账户入账提醒'],
          110: ['订单发货', '/pages/my/orderDetail/orderDetail?orderId=','orderId'],
          120: ['售后服务(退款申请)', '/pages/after-sale/only-refund/only-refund-detail/only-refund-detail?returnProductId=','returnProductId'],
          121: ['售后服务(退货申请)', '/pages/after-sale/return-goods/return-goods?returnProductId=','returnProductId'],
          122: ['售后服务(换货申请)', '/pages/after-sale/exchange-goods/exchange-goods?returnProductId=', 'returnProductId']
        },
        // payType:['平台支付','微信支付','支付宝支付','银联支付'],
        payTypeArr:[1,2,4,8,16],
        payType: {
        1: '平台支付',
        2: '微信支付',
        4: '微信支付',
        8: '支付宝支付',
        16: '银联支付'},
    },
    //获取数据
    getData() {
        if (this.data.hasNext) {
          let params = {
            pageSize: this.data.pageSize,
            page: this.data.currentPage,
            'type':100,
            reqName: '消息',
            url: Operation.queryMessage
          }
          this.setData({
            params: params
          });
          let r = RequestFactory.wxRequest(params);
          let list = this.data.list;
          r.successBlock = (req) => {
            let datas = [];
            for (let i in req.responseObject.data.data) {
                let item = req.responseObject.data.data[i];
                item.createTime = Tool.formatTime(item.createdTime);
                // item.pushTime = Tool.formatTime(item.pushTime);
                // item.title=this.data.title[item.type-1];
              if(Tool.isJson(item.param)){
                item.param = JSON.parse(item.param)
              } else {
                item.param = { param: item.param}
              }
              if (item.paramType == 101 || item.paramType==100){
                let arr = Tool.bitOperation(this.data.payTypeArr,item.param.payType)
                item.payName = []
                arr.forEach((item0,index)=>{
                  item.payName.push(this.data.payType[item0])
                })
                item.payName = item.payName.join('/')
                item.orderNum = item.param.orderNum
              }
              item.payStyle=this.payStyle(item.payType);
                datas.push(item)
            }
            this.setData({
              list: list.concat(datas),
              totalPage: req.responseObject.data.totalPage,
            });
            if (this.data.totalPage > this.data.currentPage) {
                this.setData({
                  currentPage: ++this.data.currentPage
                })
            } else {
                this.data.hasNext = false
            }
            Event.emit('queryPushNum')
        };
        r.addToQueue();
        }

    },

    // 上拉加载更多
    onReachBottom() {
        this.getData();
    },
    //支付方式
    payStyle(num){
        let result='';
        let that=this;
        switch (num){
            case 1:
                result=that.data.payType[0];
                break;
            case 2:
                result=that.data.payType[1];
                break;
            case 4:
                result=that.data.payType[1];
                break;
            case 8:
                result=that.data.payType[2];
                break;
            case 16:
                result=that.data.payType[3];
                break;
        }
        return result
    },
    //跳到详情页
    informationDetail(e){
      let paramType=e.currentTarget.dataset.type;
      let param = e.currentTarget.dataset.param;
      let page = this.data.title[paramType][1];
      let index = e.currentTarget.dataset.index
      Storage.setPayInfoList(this.data.list[index])
      let query = ''
      if (this.data.title[paramType][2]!='allItem'){
       query = param[this.data.title[paramType][2]]
      } else {
        
      }
      Tool.navigateTo(page+query)
    },
    onLoad: function (options) {
        this.getData()

    },
    onShow: function () {


    },

    didLogin(){
        if (!Tool.didLogin(this)){
            Tool.navigateTo('/pages/login/login-wx/login-wx')
            return false
        }
        return true
    },

    onUnload: function () {

    },
})