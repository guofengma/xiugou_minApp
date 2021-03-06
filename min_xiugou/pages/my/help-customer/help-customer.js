let { Tool, RequestFactory, Operation} = global;

Page({
    data: {
      list:''
    },
    onLoad: function (options) {
      this.queryHelpQuestionList()
    },
    queryHelpQuestionList(){
      let params = {
        reqName: '查询问题列表',
        requestMethod: 'GET',
        url: Operation.queryHelpQuestionList
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let data = req.responseObject.data? req.responseObject.data : []
        this.setData({
          list: data
        })
      }
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    
    //跳到详情页
    toDetail(e) {
      let id = e.currentTarget.dataset.id
      Tool.navigateTo('/pages/my/help-customer/questionDetail/questionDetail?id='+id)
    },
    afterSaleClicked(){
      Tool.navigateTo('/pages/after-sale/my-after-sale/my-after-sale')
    },
    //跳到问题反馈页面
    questionFeedback(){
        Tool.navigateTo('questionFeedback/questionFeedback')
    },
    orderClicked(){
      Tool.navigateTo('/pages/my/my-order/my-order')
    },
    //跳到问题列表页面
    questionList(e){
      let id = e.currentTarget.dataset.typeid
      Tool.navigateTo('questionList/questionList?id='+id)
    },
    makePhoneCall() {
      wx.makePhoneCall({
        phoneNumber: '13336092569',
        success: () => {
          console.log("成功拨打电话")
        }
      })
    },
    onUnload: function () {
      
    }
})