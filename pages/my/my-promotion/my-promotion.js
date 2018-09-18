let { Tool, RequestFactory, Storage, Event, Operation } = global

Page({
  data: {
    userLevelInfo:{}
  },
  onLoad: function (options) {
    Tool.isIPhoneX(this)
    this.getUserLevelInfo()
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
      datas.width = datas.experience / datas.levelExperience *100+"%"
      this.setData({
        userLevelInfo:datas
      })
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