let {Config, Tool, Event} = global;
const app = getApp();
Page({

  data: {
    imgUrl: Config.imgBaseUrl,
    showPhoneModal: false,
    inputFocus: false,
    phone: '',
    inviteCode: '',
  },
  onLoad (options) {
    // 现获取用户openid
    let inviteCode = options.inviteCode || '';
    this.setData({
      inviteCode: inviteCode
    })

    if (!app.globalData.systemInfo) {
      app.getSystemInfo()
    }
    app.wxLogin();
    Event.on('didLogin', this.didLogin, this);
  },

  onReady () {

  },

  onShow () {

  },

  onHide () {

  },

  onUnload () {
    Event.off('didLogin', this.didLogin);
  },
  toRegister() {
    Tool.navigateTo('/pages/register/register?inviteCode=' + this.data.inviteCode)
  },
  didLogin() {
    Tool.didLogin(this)
    if (this.data.didLogin) {
      this.getUserInfo();
    }
  },
  getUserInfo() {
    Tool.getUserInfos(this);
    console.log(this.data.userInfos)
  },
  phoneInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  toggleModalShow() {
    this.setData({
      showPhoneModal: !this.data.showPhoneModal,
      inputFocus: !this.data.inputFocus
    })
  },
  getAward() {
    if(!this.data.phone) {
      
    }
    this.toggleModalShow();
  }
})