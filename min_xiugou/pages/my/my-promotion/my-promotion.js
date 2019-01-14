let { Tool, API, Storage, Event } = global
import WxParse from '../../../libs/wxParse/wxParse.js';
Page({
  data: {
    userLevelInfo:{}
  },
  onLoad: function (options) {
    Tool.isIPhoneX(this)
    this.getUserLevelInfo()
    this.getNextLevelInfo()
  },
  getUserLevelInfo() { // 获取我的晋升
    API.getUserLevelInfo({}).then((res) => {
      let datas = res.data || {}
      datas.surpluslExperience = Tool.sub(datas.levelExperience, datas.experience)
      datas.surpluslExperience = datas.surpluslExperience > 0 ? datas.surpluslExperience : 0
      datas.width = datas.experience / datas.levelExperience * 100 + "%"
      this.setData({
        userLevelInfo: datas
      })
    }).catch((res) => {
      console.log(res)
    })
  },
  getNextLevelInfo(){
    API.getNextLevelInfo({}).then((res) => {
      let datas = res.data || {}
      let html = datas.content || ''
      WxParse.wxParse('article', 'html', html, this, 5);
    }).catch((res) => {
      console.log(res)
    })
  },
  goPage(e){
    let index = e.currentTarget.dataset.index
    if(index==0){
      Tool.navigateTo('/pages/my/invite/invite')
    } else {
      Tool.switchTab('/pages/index/index')
    }
  },
  toExp() {
    const userLevelInfo = this.data.userLevelInfo;
    Tool.navigateTo(`/pages/my/my-exp/my-exp?experience=${userLevelInfo.experience || 0.00}&levelExperience=${userLevelInfo.levelExperience || 0.00}&surpluslExperience=${userLevelInfo.surpluslExperience || 0.00}`)
  },
  onUnload: function () {
    
  }
})