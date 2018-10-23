let { Tool, RequestFactory, Operation} = global;

import WxParse from '../../../../libs/wxParse/wxParse.js';

Page({
    data: {
      
    },
    onLoad: function (options) {
      this.findHelpQuestionById(options.id)
    },
    isUseClicked(e){
      let index = e.currentTarget.dataset.index
      let params = {
        id: this.data.list.id,
        hadHelp: index == 1 ? 0: 1,
        reqName: '解决问题是否有用',
        url: Operation.updateHelpQuestion
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        Tool.showSuccessToast(req.responseObject.data)
      }
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    findHelpQuestionById(id) {
      let params = {
        id: id,
        reqName: '根据ID查询问题详情',
        requestMethod: 'GET',
        url: Operation.findHelpQuestionById
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        this.setData({
          list: req.responseObject.data
        })
        let html = req.responseObject.data.content || ''
        WxParse.wxParse('article', 'html', html, this, 5);
      }
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    onUnload: function () {

    }
})