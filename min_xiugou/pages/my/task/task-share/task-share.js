let { Tool, API, Storage, Event} = global
const app = getApp();
Page({

  data: {
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
    API.jobIncrHits({
      userJobId: this.data.jobId
    }).then((res) => {
      let data = res.data || {};
      this.setData({
        scratchCode: data.scratchCode,
        tableId: data.id,
      });
      this.checkScratchCodeStatus();
    }).catch((res) => {
      console.log(res)
    })
  },
  checkScratchCodeStatus() {
    let params = {
      // url: Operation.checkScratchCodeStatus,
      openid: this.data.userInfos.openid,
      scratchCardCode: this.data.scratchCode,
      tableId: this.data.tableId,
      type: 1 // 1.秀值
    };
    API.checkScratchCodeStatus(params).then((res) => {
      let data = res.data || {};
      this.setData({
        scratchCard: data,
        deadline: this.getDate(data.updateTime) + ' - ' + this.getDate(data.endTime)
      })
    }).catch((res) => {
      console.log(res)
    })
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
    Tool.navigateTo(`/pages/register/register?from=${from}&inviteId=${this.data.userInfos.id}&phone=${this.data.phone}`)
  },
  didLogin() {
    Tool.didLogin(this)
    this.getUserInfo();
    this.jobIncrHits();    
  },
  checkUserExist() { // 查询用户是否已注册
    let params = {
      openid: Storage.getterFor('openid'),
      phone: this.data.phone,
      source: 1, // 1. 小程序 2. H5
      // reqName: '查询用户是否已注册',
      // url: Operation.userExtVerify,
      // requestMethod: 'GET'
    }
    API.userExtVerify(params).then((res) => {
      let data = res.data;
      if(!data) {
        this.toRegister();
      } else {
        this.getAward();
      }
    }).catch((res) => {
      console.log(res)
    })
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
      // url: Operation.getScratchCard,
      tableId: this.data.tableId,
      type: 1,
      // reqName: '获取刮刮卡',
    }
    API.getScratchCard(params).then((res) => {
      let data = res.data || {};
      this.setData({
        scratchCard: data
      })
    }).catch((res) => {
      console.log(res)
    })
  },
  // 获取奖励
  getAward() {
    console.log('get award');
    let _ = this;
    let params = {
      // url: Operation.getScratchAward,
      id: _.data.scratchCard.id,
      phone: _.data.userInfos.phone || _.data.phone,
      // requestMethod: 'GET'
    }
    API.getScratchAward(params).then((res) => {
      this.setData({
        showPhoneModal: false,
        inputFocus: false
      })
      if(res.code == 10000) {
        _.checkScratchCodeStatus();
      }
    }).catch((res) => {
      console.log(res)
    })
  },
  toIndex() {
    Tool.switchTab('/pages/index/index')
  },
  
  seesese() {
    if (this.data.userInfos.phone) {
      Tool.switchTab('/pages/index/index');

    } else {
      API.existedUserByOpenId({
        openid: Storage.getterFor('openid')
      }).then((res) => {
        if (res.data) {
          Tool.switchTab('/pages/index/index');
        } else {
          Tool.navigateTo('/pages/register/register');
        }
      }).catch((res) => {
        console.log(res)
      })
    }
  }
})