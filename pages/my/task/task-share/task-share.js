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
    tableId: '',
    scratchCard: {
      // status: 1, //是否领取 1. 是 2.否
      // typeStatus: 1
    },//刮刮卡信息
    scratchCode: '',
    deadline: ''
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
        scratchCode: data.scratchCode,
        tableId: data.id,
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
      scratchCardCode: this.data.scratchCode,
      tableId: this.data.tableId,
      type: 1 // 1.秀值
    };
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let data = req.responseObject.data || {};
      this.setData({
        scratchCard: data,
        deadline: this.getDate(data.updateTime) + ' - ' + this.getDate(data.endTime)
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  getDate(timestamp) {
    return Tool.formatTime(timestamp).split(' ')[0] || '';
  },
  onReady () {

  },
  onUnload () {
  },
  toRegister() {
    let from = encodeURIComponent(`/pages/my/task/task-share/task-share?inviteId=${this.data.userInfos.id}&jobId=${this.data.jobId}`);
    Tool.navigateTo(`/pages/register/register?from=${from}&inviteCode=${this.data.userInfos.id}&phone=${this.data.phone}`)
  },
  didLogin() {
    Tool.didLogin(this)
    this.getUserInfo();
    this.jobIncrHits();    
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
  toggleModalShow(e) {
    const dataset = e.currentTarget.dataset;
    if(dataset.status == 1) return;
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
    if (!this.data.scratchCode) return;
    let params = {
      scratchCardCode: this.data.scratchCode,
      openid: Storage.getterFor('openid'),
      url: Operation.getScratchCard,
      tableId: this.data.tableId,
      type: 1,
      reqName: '获取刮刮卡',
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
      this.setData({
        showPhoneModal: false,
        inputFocus: false
      })
      if(req.responseObject.code == 10000) {
        _.checkScratchCodeStatus(); 
      }
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  toIndex() {
    Tool.switchTab('/pages/index/index')
  }
})