let { Tool, RequestFactory,Operation } = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
      list:''
    },
    queryHelpQuestionList(id) {
      let params = {
        id: id,
        reqName: '根据ID查询问题详情',
        url: Operation.findHelpQuestionById
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
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