let { Tool, API} = global;

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
    isUseClicked(e) { // 解决问题是否有用
      let index = e.currentTarget.dataset.index
      let params = {
        id: this.data.list.id,
        hadHelp: index == 1 ? 0: 1,
      }
      API.updateHelpQuestion(params).then((res) => {
        Tool.showSuccessToast(res.data)
        this.findQuestionEffectById()
      }).catch((res) => {
        console.log(res)
      })
    },
    findHelpQuestionById(id) { //根据ID查询问题详情
      let params = {
        id: id,
      }
      API.findHelpQuestionById(params).then((res) => {
        this.setData({
          list: res.data
        })
        let html = res.data.content || ''
        WxParse.wxParse('article', 'html', html, this, 5);
      }).catch((res) => {
        console.log(res)
      })
    },
    findQuestionEffectById(){
      let params = {
        id: this.data.id,
      }
      API.findQuestionEffectById(params).then((res) => {
        let datas = res.data
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
      }).catch((res) => {
        console.log(res)
      })
    },
    onUnload: function () {

    }
})