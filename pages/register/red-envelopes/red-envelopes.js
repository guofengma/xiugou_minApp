let { Tool, RequestFactory, Storage, Operation, Event } = global;
Page({
  data: {
    isShow:false
  },
  onLoad: function (options) {

  },
  goPage(){
    Tool.navigateTo('/pages/register/write-invite-code/write-invite-code') 
  },
  btnClicked(){
    this.selectComponent('#redEnvelopes').btnClick();
  },
  dismiss(){
    let callBack = () => {
      Tool.switchTab('/pages/index/index')
    }
    Tool.showSuccessToast('注册成功', callBack)
  }
})