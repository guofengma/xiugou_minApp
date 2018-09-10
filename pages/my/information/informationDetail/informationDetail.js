// pages/my/account.js
let { Tool, RequestFactory, Storage, Event, Operation  } = global;
Page({
    data: {
      status:8,
      refuseDetail:'',
      detail:{}
    },
    onLoad: function (options) {
      Tool.getUserInfos(this)
      this.getDetail(options.id,options.type);
      this.setData({
        status:options.type
      })
    },
    onShow: function () {

    },
    getDetail(id,types){
      let params = {
        id: id,
        'type': types,
        reqName: '消息详情',
        url: Operation.findMessageDetail
      }
      let r = RequestFactory.wxRequest(params); 
        // let r = RequestFactory.findMessageDetail(params);
        r.finishBlock = (req) => {
            if(types==8){
                let refuseDetail=req.responseObject.data;
                this.setData({
                    refuseDetail: refuseDetail
                })
            } else{
                let detail=req.responseObject.data;
                if(types==7){
                  detail.total = detail.actual_amounts + detail.actual_balance + detail.actual_token_coin
                }
                detail.pay_time = detail.pay_time ? Tool.formatTime(detail.pay_time ):'';
                detail.create_time = detail.create_time ? Tool.formatTime(detail.create_time) : '';
                this.setData({
                    detail: detail
                })
            }
        };
        Tool.showErrMsg(r);
        r.addToQueue();
    },
    //订单疑问
    order(){
        if (!this.didLogin()) return;
        Tool.navigateTo('../../help-customer/help-customer')
    },
    //投诉
    feedback(){
        if (!this.didLogin()) return;
        Tool.navigateTo('../../help-customer/questionFeedback/questionFeedback')
    },
    didLogin(){
      if (!Tool.didLogin(this)){
        Tool.navigateTo('/pages/login/login-wx/login-wx');
        return false
      }
      return true
    },

    onUnload: function () {

    },
})