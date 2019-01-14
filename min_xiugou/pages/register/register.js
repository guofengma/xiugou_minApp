let { Tool, Storage, Event, API } = global;
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
    isAgree:false,
    urlFrom: null,
  },
  onLoad: function (options) {
    // Tool.navigateTo('/pages/register/register-code/register-code?from=' + this.data.urlFrom)
    let inviteId = options.inviteId
    if (options.inviteId == 'null' || options.inviteId == 'undefined' || !options.inviteId) {
      inviteId = ''
    }
    app.deleteInviteId()
    let upUserId = Storage.getUpUserId() || {}
    // Tool.showAlert(upUserId.id)
    this.setData({
      inviteCode: options.inviteCode || '',
      inviteId: Number(inviteId) || Number(upUserId.id) || '',
      userInfo: Storage.wxUserInfo() || false,
      openid: Storage.getWxOpenid() || '',
      urlFrom: options.from || null,
      phone: options.phone || ''
    })

    if (options.inviteCode){
      let callBack = () => {
        this.sweepCode(options.inviteCode)
      }
      app.wxLogin(callBack)
    }
    if (inviteId){
      app.wxLogin()
    }
  },
  onShow: function () {

  },
  sweepCode(id){ // 判断邀请码是否过期等
    let params = {
      code: id,
      identity: Storage.getWxOpenid(),
    }
    API.sweepCode(params).then((res) => {

    }).catch((res) => {
      let msg = res.msg
      this.setData({
        invalidTips: {
          invalid: true,
          tips: msg
        }
      })
    })
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
      openid: this.data.openid || Storage.getWxOpenid() || '',
      upUserCode: this.data.inviteId+"" || "", // 邀请者id 非必填
      upUserId: this.data.inviteId+"" || "", // 邀请者id 非必填
      inviteCode: this.data.inviteCode || "",//邀请码 非必填
    }
    this.verifyPhone(params)
  },
  verifyPhone(params){
    API.findMemberByPhone(params).then((res) => {
      let datas = res.data || {}
      Storage.setMemberId(datas.id)
      Tool.loginOpt(res)
      Storage.setUpUserId(null)
      Storage.setFirstRegistration(datas.give)
      // 被邀请的人不走选择导师的页面
      if (this.data.urlFrom && this.data.inviteId) {
        Tool.navigateTo(decodeURIComponent(this.data.urlFrom))
      } else if (this.data.inviteCode || this.data.inviteId) {
        let callBack = () => {
          Tool.switchTab('/pages/index/index')
        }
        Tool.showSuccessToast('注册成功', callBack)
      } else {
        Tool.redirectTo('/pages/register/register-code/register-code?from=' + this.data.urlFrom)
      }
      // if (this.data.urlFrom){
      //   Tool.navigateTo(decodeURIComponent(this.data.urlFrom))
      // } else{
      //   Tool.navigateTo(decodeURIComponent(this.data.urlFrom))
      // }
      // else if (!datas.upUserid){ 
      //   领取红包功能 取消了
      //   Tool.navigateTo('/pages/register/red-envelopes/red-envelopes')
      // } 
      // else{
      //   let callBack = ()=>{
      //     Tool.switchTab('/pages/index/index')
      //   }
      //   Tool.showSuccessToast('注册成功', callBack)
      // }
    }).catch((res) => {
       console.log(res)
    })
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
    API.sendMessage({
      phone: this.data.phone,
    }).then((res) => {
      wx.showToast({
        title: '验证码已发送',
      })
    }).catch((res) => {
      console.log(res)
    });
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
    Tool.navigateTo('/pages/web-view/web-view?webType=2')
  },
  agreeCilcked() {
    this.setData({
      isAgree: !this.data.isAgree
    })
  }
})
