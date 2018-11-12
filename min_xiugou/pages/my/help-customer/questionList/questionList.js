let { Tool, RequestFactory,Operation } = global;
Page({
    data: {
      list:''
    },
    queryHelpQuestionList(id) {
      let params = {
        reqName: '查询问题列表',
        requestMethod: 'GET',
        url: Operation.queryHelpQuestionList
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        this.setData({
          list: req.responseObject.data[id]
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