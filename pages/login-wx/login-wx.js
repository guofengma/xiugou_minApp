let { Tool, RequestFactory, Storage, Operation } = global

const app = getApp()

Page({
  data: {
    userInfo:'',
    visiable:false,
    isAgree:false,
    encryptedData:'',
    iv:'',
    openid:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isBack:false
  },
  onLoad: function (options) {
    this.setData({
      openid: Storage.getWxOpenid() || '',
      userInfo: Storage.wxUserInfo() || '',
      isBack: options.isBack || false,
      inviteCode: options.inviteCode || '',
    })
    if (!this.data.openid){
      app.wxLogin()
    }
  },
  onShow: function () {
  
  },
  getPhoneNumber(e){  // 获取手机号
    if (e.detail.errMsg == 'getPhoneNumber:ok'){
      this.setData({
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      })
      if (!this.data.userInfo){
        this.setData({
          visiable: !this.data.visiable
        })
      } else if (this.data.userInfo) {
        this.requetLogin()
      }
    } 
  },
  agreeGetUser(e){ // 获取用户信息
    if (!this.data.canIUse){
      this.getUserInfo()
    }
    this.setData({
      visiable: false
    })
    if (e.detail.userInfo !== undefined){
      this.getLogin(e.detail.userInfo)
    } else {
      this.tips()
    }
  },
  requetLogin(){
    let params = {
      encryptedData: this.data.encryptedData,
      iv: this.data.iv,
      openid: Storage.getWxOpenid() || '',
      nickname: this.data.userInfo.nickName,
      headImg: this.data.userInfo.avatarUrl,
      reqName: '用户微信登陆',
      url: Operation.wechatLogin,
      // hasCookie: false
    };
    let r = RequestFactory.wxRequest(params);
    r.successBlock= (req) => {
      // 存相关信息
      Tool.loginOpt(req)
      if (this.data.isBack){
        Tool.navigationPop()
      } else {
        Tool.switchTab('/pages/index/index')
      }
    }
    r.failBlock = (req) => {
      if (req.responseObject.code == 34005){
        Tool.navigateTo('/pages/register/register?inviteCode=' + this.data.inviteCode)
      } else if (req.responseObject.code == 40000){
        Tool.navigateTo('/pages/download-app/download-app?door=1')
      } else {
        Tool.showAlert(req.responseObject.msg)
      }
    }
    r.addToQueue();
  },
  otherLogin(){
    Tool.navigateTo('/pages/login/login')
  },
  getUserInfo(){
    wx.getUserInfo({
      success: res => {
        this.getLogin(res.userInfo)
      },
      fail: function () {
        this.tips()
      }
    })
  },
  getLogin(userInfo){
    this.setData({
      userInfo: userInfo
    })
    Storage.setWxUserInfo(userInfo)
    this.requetLogin()
  },
  tips(){
    let that = this 
    wx.showModal({
      title: '用户未授权',
      content: '如需正常使用该小程序功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
      showCancel: false,
      success: function (resbtn) {
        if (resbtn.confirm) {
          wx.openSetting({
            success: function success(resopen) {
              //  获取用户数据
              that.getUserInfo()
            }
          });
        }
      }
    })
  }
})