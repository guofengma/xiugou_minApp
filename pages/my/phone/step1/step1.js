let { Tool, RequestFactory, Event, Operation } = global
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ysf: { title: '修改手机号' },
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
      let params = {
        code: 'MOBILE_VERIFYAULDPHONE_CODE',
        phone: this.data.userInfos.phone,
        reqName: '发送短信',
        url: Operation.sendMessage
      }
      let r = RequestFactory.wxRequest(params);
      // let r = RequestFactory.sendMessage(params);
      r.finishBlock = (req) => {
        wx.showToast({
          title: '验证码已发送',
        })
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    }
    Tool.codeEnable(this, callBack)
  },
  next(){
    if (Tool.isEmptyStr(this.data.code)) {
      Tool.showAlert("请输入验证码");
      return
    } 
    let params = {
      code: this.data.code,
      phone: this.data.userInfos.phone,
      reqName:'验证旧手机验证码是否正确',
      url: Operation.updateDealerPhoneById
    }
    let r = RequestFactory.wxRequest(params);
    // let r = RequestFactory.updateDealerPhone(params);
    r.finishBlock = (req) => {
      // Tool.redirectTo('/pages/my/phone/phone?phone=' + this.data.userInfos.phone)
      Tool.navigateTo('/pages/my/phone/phone?phone=' + this.data.userInfos.phone)
    };
    r.failBlock = (req) => {
      Tool.showAlert(req.responseObject.msg)
    }
    Tool.showErrMsg(r)
    r.addToQueue();
  }
})