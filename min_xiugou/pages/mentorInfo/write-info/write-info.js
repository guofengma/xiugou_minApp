let { Tool, RequestFactory, Event, Storage, API } = global;
Page({
  data: {
    count:0,
    disabled:true,
  },
  onLoad: function (options) {
    this.refreshMemberInfoNotice()
  },
  detailRemark(e){
    let code = e.detail.value
    this.setData({
      count:code.length,
      profile:code,
      disabled: code.length? false:true
    })
  },
  refreshMemberInfoNotice() { // 显示之前的简介
    Tool.getUserInfos(this)
    this.setData({
      profile: this.data.userInfos.profile || '',
      disabled: this.data.userInfos.profile? false : true
    })
  },
  formSubmit(){
    API.updateUserById({
      'type': 6,
      profile: this.data.profile
    }).then((res) => {
      let infos = Storage.getUserAccountInfo()
      infos.profile = this.data.profile
      Storage.setUserAccountInfo(infos)
      Event.emit('refreshMemberInfoNotice');//发出通知
      Tool.navigationPop()
    }).catch((res) => {
      console.log(res)
    });
  }
})