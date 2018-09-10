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
        title:['支付成功','订单发货','订单超时','退款申请','退货申请','换货申请','退款成功','提现申请驳回','提现申请成功','提交提现申请','余额提现到账','代币提现到账','身份认证成功','身份认证失败','优惠券'],
        payType:['平台支付','微信支付','支付宝支付','银联支付']
    },
    //获取数据
    getData() {
        if (this.data.hasNext) {
          let params = {
            pageSize: this.data.pageSize,
            page: this.data.currentPage,
            reqName: '消息',
            url: Operation.queryMessage
          }
          this.setData({
            params: params
          });
          let r = RequestFactory.wxRequest(params);
            // let r = global.RequestFactory.queryMessage(params);
            let list = this.data.list;
            r.finishBlock = (req) => {
                let datas = [];
                for (let i in req.responseObject.data.data) {
                    let item = req.responseObject.data.data[i];
                    item.creatTime = Tool.formatTime(item.creatTime);
                    item.pushTime = Tool.formatTime(item.pushTime);
                    item.title=this.data.title[item.type-1];
                    item.payStyle=this.payStyle(item.payType);
                    datas.push(item)
                }
                this.setData({
                    list: list.concat(datas),
                    totalPage: req.responseObject.data.total,
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
        let type=e.currentTarget.dataset.type;
        let id=e.currentTarget.dataset.id;
        let tdId=e.currentTarget.dataset.tdid;
        let page='';
        if (!this.didLogin()) return;
        switch (type){
            case 1:
                page='../informationDetail/informationDetail?id='+id+'&type='+type;//支付成功
                break;
            case 2:
                page='../../orderDetail/orderDetail?orderId='+tdId+'&status=3';//订单发货
                break;
            case 3:
                page='../../orderDetail/orderDetail?orderId='+tdId+'&status=10';//订单超时
                break;
            case 4:
                page = '/pages/after-sale/only-refund/only-refund-detail/only-refund-detail?returnProductId=' + tdId;//退款申请
                break;
            case 5:
                page = '/pages/after-sale/return-goods/return-goods?returnProductId=' + tdId;//退货申请
                break;
            case 6:
                page = '/pages/after-sale/exchange-goods/exchange-goods?returnProductId=' + tdId;//换货申请
                break;
            case 7:
                page='../informationDetail/informationDetail?id='+id+'&type='+type;//退款成功
                break;
            case 8:
                page='../informationDetail/informationDetail?id='+id+'&type='+type;//提现申请驳回
                break;
            case 15:
                page='/pages/my/coupon/my-coupon/my-coupon';//优惠券
                break;
        }
        Tool.navigateTo(page)
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