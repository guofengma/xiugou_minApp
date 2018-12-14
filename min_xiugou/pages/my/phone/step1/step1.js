let { Tool, API, Event } = global
Page({
  data: {
    getCodeBtEnable: true,
    second: '59',
    showSecond: false,
    time: Object,
    disabled: true,
    code:"",
  },
  onLoad: function (options) {
    this.refreshMemberInfoNotice()
    Event.on('refreshMemberInfoNotice', this.refreshMemberInfoNotice, this);
  },
  refreshMemberInfoNotice() {
    Tool.getUserInfos(this)
  },
  onUnload: function () {
    Event.off('refreshMemberInfoNotice', this.refreshMemberInfoNotice);
  },
  changeInput(e){
    this.setData({
      code: e.detail.value
    })
  },
  getCodeTap () {
    let callBack = ()=>{
      API.sendMessage({
        code: 'MOBILE_VERIFYAULDPHONE_CODE',
        phone: this.data.userInfos.phone
      }).then((res) => {
        wx.showToast({
          title: '验证码已发送',
        })
      }).catch((res) => {
        console.log(res)
      });
    }
    Tool.codeEnable(this, callBack)
  },
  next(){
    if (Tool.isEmptyStr(this.data.code)) {
      Tool.showAlert("请输入验证码");
      return
    }
    API.updateDealerPhoneById({
      verificationCode: this.data.code,
      phone: this.data.userInfos.phone,
    }).then((res) => {
      // Tool.redirectTo('/pages/my/phone/phone?phone=' + this.data.userInfos.phone)
      Tool.navigateTo('/pages/my/phone/phone?phone=' + this.data.userInfos.phone + '&code=' + this.data.code)
    }).catch((res) => {
      console.log(res)
    });
  }
})