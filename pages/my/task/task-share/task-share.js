let { Tool, RequestFactory, Storage, Event, Operation, Config } = global
const app = getApp();
Page({

  data: {
    imgUrl: Config.imgBaseUrl,
    showPhoneModal: false,
    inputFocus: false,
    phone: '',
    inviteId: '',
    jobId: '',
    isNewUser: false,
    scratchCard: {
      status: 1, //是否领取 1. 是 2.否
      typeStatus: 1
    },//刮刮卡信息
    scratchCode: '',
  },
  onLoad (options) {
    // 现获取用户openid
    console.log(options);
    this.setData({
      inviteId: options.inviteId || '',
      jobId: options.jobId || ''
    })

    if (!app.globalData.systemInfo) {
      app.getSystemInfo()
    }
    app.wxLogin(()=> {
      this.didLogin();
    });
  },
  jobIncrHits() {
    let params = {
      url: Operation.jobIncrHits,
      openId: this.data.userInfos.openid,
      userJobId: this.data.jobId
    };
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let data = req.responseObject.data || {};
      this.setData({
        scratchCode: data.scratchCode
      });
      this.checkScratchCodeStatus();
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  checkScratchCodeStatus() {
    let params = {
      url: Operation.checkScratchCodeStatus,
      openid: this.data.userInfos.openid,
      code: this.data.scratchCode,
      requestMethod: 'GET'
    };
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
  onReady () {

  },
  onUnload () {
  },
  toRegister() {
    let from = encodeURIComponent(`/pages/my/task/task-share/task-share?inviteId=${this.data.inviteId}&jobId=${this.data.jobId}`);
    Tool.navigateTo(`/pages/register/register?from=${from}&inviteCode=${this.data.inviteId}&phone=${this.data.phone}`)
  },
  didLogin() {
    Tool.didLogin(this)
    this.getUserInfo();
    this.jobIncrHits();
    // this.checkUserExist();    
  },
  checkUserExist() {
    let params = {
      openid: Storage.getterFor('openid'),
      phone: this.data.phone,
      source: 1, // 1. 小程序 2. H5
      reqName: '查询用户是否已注册',
      url: Operation.userExtVerify,
      requestMethod: 'GET'
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let data = req.responseObject.data;
      if(!data) {
        this.toRegister();        
      } else {
        this.getAward();
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
    } else {
      this.setData({
        showPhoneModal: !this.data.showPhoneModal,
        inputFocus: !this.data.inputFocus
      })

    }
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
      code: this.data.scratchCode,
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
    console.log('get award');
    let _ = this;
    let params = {
      url: Operation.getScratchAward,
      id: _.data.scratchCard.id,
      phone: _.data.userInfos.phone,
      requestMethod: 'GET'
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      if(req.responseObject.code == 10000) {
        _.checkScratchCodeStatus(); 
      }
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  }
})