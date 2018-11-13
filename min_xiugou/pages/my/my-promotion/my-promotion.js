let { Tool, RequestFactory, Storage, Event, Operation } = global
import WxParse from '../../../libs/wxParse/wxParse.js';
import { levelName } from '../../../tools/common.js'
Page({
  data: {
    userLevelInfo:{},
    levelName: levelName
  },
  onLoad: function (options) {
    Tool.isIPhoneX(this)
    this.getUserLevelInfo()
    this.getNextLevelInfo()
  },
  getUserLevelInfo() {
    let params = {
      isShowLoading: false,
      reqName: '获取我的晋升',
      requestMethod: 'GET',
      url: Operation.getUserLevelInfo
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let datas = req.responseObject.data
      datas.surpluslExperience = Tool.sub(datas.levelExperience, datas.experience)
      datas.surpluslExperience = datas.surpluslExperience>0 ? datas.surpluslExperience:0
      datas.width = datas.experience / datas.levelExperience *100+"%"
      this.setData({
        userLevelInfo:datas
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  getNextLevelInfo(){
    let params = {
      isShowLoading: false,
      reqName: '获取我的晋升',
      requestMethod: 'GET',
      url: Operation.getNextLevelInfo
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let datas = req.responseObject.data
      let html = datas.content || ''
      WxParse.wxParse('article', 'html', html, this, 5);
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  goPage(e){
    let index = e.currentTarget.dataset.index
    if(index==0){
      Tool.navigateTo('/pages/my/invite/invite')
    } else {
      Tool.switchTab('/pages/index/index')
    }
  },
  onUnload: function () {
    
  }
})