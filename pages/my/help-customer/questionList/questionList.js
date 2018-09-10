let {Tool, RequestFactory } = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
      list:''
    },
    queryHelpQuestionList(params) {
      let r = RequestFactory.queryHelpQuestionList(params);
      r.finishBlock = (req) => {
        this.setData({
          list: req.responseObject.data
        })
      }
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    toDetail(e){
      let id = e.currentTarget.dataset.id
      Tool.navigateTo('/pages/my/help-customer/questionDetail/questionDetail?id='+id)
    },
    onLoad: function (options) {
      this.queryHelpQuestionList(options.id)
    },
    onUnload: function () {
    }
})