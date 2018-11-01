let { Tool, RequestFactory, Storage, Event, Operation, Config } = global
const app = getApp();
Page({

  data: {
    imgUrl: Config.imgBaseUrl,
    showPhoneModal: false,
    inputFocus: false,
    phone: '',
    inviteId: '',
    isNewUser: false,
    scratchCard: {
      status: 1, //是否领取 1. 是 2.否
      typeStatus: 1
    },//刮刮卡信息
  },
  onLoad (options) {
    // 现获取用户openid
    let inviteId = options.inviteId || '';
    this.setData({
      inviteId: inviteId
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
    Tool.navigateTo('/pages/register/register?inviteId=' + this.data.inviteId)
  },
  didLogin() {
    Tool.didLogin(this)
    this.getUserInfo();
    // this.checkUserExist();    
  },
  checkUserExist() {
    let params = {
      openid: Storage.getterFor('openid'),
      reqName: '根据openid判断用户是否存在',
      url: Operation.userExistByOpenid
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let data = req.responseObject.data || {}; 
      if(data.phone) {
        this.setData({
          phone: data.phpne,
          isNewUser: true
        })
      }
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  getUserInfo() {
    Tool.getUserInfos(this);
  },
  phoneInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 显示手机号填写弹窗
  toggleModalShow() {
    let phone = this.data.userInfos.phone || this.data.phone;
    // 如果开始获取到手机了就不需要填了
    if(phone) {
      this.getAward();
      return;
    }
    this.setData({
      showPhoneModal: !this.data.showPhoneModal,
      inputFocus: !this.data.inputFocus
    })
  },
  // 验证手机并领取奖励
  checkAwardPhone() {
    let phone = this.data.phone;
    if(!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!Tool.checkPhone(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    this.checkUserExist();
  },
  // 刮刮卡
  getScratchCard() {
    let params = {
      code: 'GGK1810270002',
      openid: Storage.getterFor('openid'),
      url: Operation.getScratchCard,
      reqName: '获取刮刮卡',
      requestMethod: 'GET'
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let data = req.responseObject.data || {};
      this.setData({
        scratchCard: data
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  // 获取奖励
  getAward() {

  }
})