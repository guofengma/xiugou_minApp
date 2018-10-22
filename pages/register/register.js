let { Tool, RequestFactory, Storage, Operation,Event } = global;
const app = getApp()
Page({
  data: {
    getCodeBtEnable: true,
    second: '59',
    showSecond: false,
    time: Object,
    disabled:true,
    phone:'',
    pwd:'',
    code:'',
    isSee: false,
    id:'', // 保存邀请码（扫描分享和点击分享页面分享）
    userInfo:'', //用户头像等信息
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    invalidTips:{
      invalid:false,
      tips:''
    },
    isAgree:false
  },
  onLoad: function (options) {
    this.setData({
      codeId: options.inviteCode || '',
      userInfo: Storage.wxUserInfo() || false,
      openid: Storage.getWxOpenid() || '',
    })
    // if (options.inviteCode){
    //   let callBack = () => {
    //     this.sweepCode(options.inviteCode)
    //   }
    //   app.wxLogin(callBack)
    // }
  },
  onShow: function () {
    
  },
  sweepCode(id){ // 判断邀请码是否过期等
    let params = {
      code: id,
      identity: Storage.getd(),
      reqName: '邀请码是否过期',
      url: Operation.sweepCode
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      
    }
    r.failBlock = (req) => {
      let msg = req.responseObject.msg
      this.setData({
        invalidTips: {
          invalid: true,
          tips: msg
        }
      })
    }
    r.addToQueue();
  },
  isSeePwd() {
    this.setData({
      isSee: !this.data.isSee
    })
  },
  formSubmit(e) {
    if (!Tool.checkPhone(this.data.phone)) {
      Tool.showAlert("请输入正确的手机号");
      return
    }
    if (!Tool.checkPwd(this.data.pwd)) {
      Tool.showAlert("密码格式不正确");
      return
    }
    if (!this.data.isAgree) {
      Tool.showAlert("请阅读并接受用户协议");
      return
    }
    let params = {
      phone: this.data.phone,
      code: this.data.code,
      password: this.data.pwd,
      headImg: this.data.userInfo.avatarUrl,
      nickname: this.data.userInfo.nickName,
      openid: this.data.openid,
    }
    // this.verifyPhone(e.detail.value)  // 改动了 
    this.verifyPhone(params)
  },
  verifyPhone(params){
    params = {
      ...params,
      reqName: '判断手机号是否已经注册',
      url: Operation.findMemberByPhone,
      hasCookie: false
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let callBack = () => {
        Storage.setMemberId(req.responseObject.data.id)
        Tool.loginOpt(req)
        Tool.switchTab('/pages/index/index')
      }
      Tool.showSuccessToast('注册成功', callBack)
    }
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  changeInput(e){
    let n = parseInt(e.currentTarget.dataset.index)
    switch (n) {
      case 1:
        this.setData({
          phone: e.detail.value
        });
        break;
      case 2:
        this.setData({
          code: e.detail.value
        });
        break;
      case 3:
        this.setData({
          pwd: e.detail.value
        });
        break;
    }
    this.isBtnDisabled()
  },
  isBtnDisabled: function(){
    if(!(Tool.isEmptyStr(this.data.phone) || Tool.isEmptyStr(this.data.pwd) || Tool.isEmptyStr(this.data.code))){
      this.setData({
        disabled: false
      });
    } else {
      this.setData({
        disabled: true
      });
    }
  },
  getCodeTap: function () { // 获取验证码
    if (!Tool.checkPhone(this.data.phone)){
      Tool.showAlert("请输入正确的手机号");
      return
    }
    let tempEnable = this.data.getCodeBtEnable;
    if (!tempEnable) {
      return;
    }
    this.setData({
      getCodeBtEnable: !tempEnable,
      showSecond: true
    });
    this.countdown(this);
    let params = {
      phone: this.data.phone,
      reqName: '发送短信',
      url: Operation.sendMessage,
      requestMethod: 'GET',
      hasCookie: false
    }
    let r = RequestFactory.wxRequest(params);
    // let r = RequestFactory.sendMessage(params);
    r.successBlock= (req) => {
      wx.showToast({
        title: '验证码已发送',
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  countdown: function (that) { // 倒计时
    let second = that.data.second;
    clearTimeout(this.data.time);
    if (second == 0) {
      that.setData({
        second: '59',
        getCodeBtEnable: true,
        showSecond: false
      });
      return;
    }
    let time = setTimeout(function () {
      that.setData({
        second: second - 1,
        getCodeBtEnable: false,
        showSecond: true,
      });
      that.countdown(that);
    }, 1000)
    that.setData({
      time: time
    });
  },
  agreeGetUser(e) {
    if (!this.data.canIUse) {
      this.getUserInfo()
    }
    if (e.detail.userInfo !== undefined) {
      this.setData({
        userInfo: e.detail.userInfo
      })
      Storage.setWxUserInfo(e.detail.userInfo)
      this.formSubmit()
    } 
  },
  getUserInfo() {
    wx.getUserInfo({
      success: res => {
        this.setData({
          userInfo: e.detail.userInfo
        })
        Storage.setWxUserInfo(e.detail.userInfo)
        this.formSubmit()
      },
      fail: function () {
       
      }
    })
  },
  toPage(){
    Tool.navigateTo('/pages/register/agreement/agreement')
  },

  agreeCilcked() {
    this.setData({
      isAgree: !this.data.isAgree
    })
  }
})