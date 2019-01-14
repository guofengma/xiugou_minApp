let { Tool, API} = global;

Page({
    data: {
      list:''
    },
    onLoad: function (options) {
      this.queryHelpQuestionList()
    },
    queryHelpQuestionList(){
      API.queryHelpQuestionList({}).then((res) => {
        let datas = res.data || []
        this.setData({
          list: datas
        })
      }).catch((res) => {
        console.log(res)
      })
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