let { Tool, RequestFactory, Operation} = global;

import WxParse from '../../../../libs/wxParse/wxParse.js';

Page({
    data: {
      isClickedHelp:false,
      isClickedNoHelp:false
    },
    onLoad: function (options) {
      this.setData({
        id: options.id
      })
      this.findHelpQuestionById(options.id)
      this.findQuestionEffectById()
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
        this.findQuestionEffectById()
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
    findQuestionEffectById(){
      let params = {
        id: this.data.id,
        reqName: '获取帮助次数',
        requestMethod: 'GET',
        url: Operation.findQuestionEffectById
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let datas = req.responseObject.data
        if(datas.type==1){
          this.data.isClickedHelp = true
        } else if(datas.type===0){
          this.data.isClickedNoHelp = true
        }
        datas.notHelp = datas.notHelp > 10000 ? '9999+' : datas.notHelp
        datas.isHelp = datas.isHelp > 10000 ? '9999+' : datas.isHelp
        this.setData({
          isClickedHelp: this.data.isClickedHelp,
          isClickedNoHelp: this.data.isClickedNoHelp,
          datas: datas
        })
      }
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    onUnload: function () {

    }
})