let { Tool, API, Event, Storage} = global;
Page({
  data: {
    ysf: { title: '修改手机号' },
    isNext: false,
    isTime: false,
    phone: '',
    getCodeBtEnable: true,
    second: '59',
    showSecond: false,
    time: Object,
    disabled: true,
    code: "",
  },
  onLoad: function (options) {
    this.setData({
      oldCode: options.code
    })
  },
  //下一步
  next() {
    if (Tool.isEmptyStr(this.data.phone)){
      Tool.showAlert("手机号不能为空");
      return
    }
    if (!Tool.checkPhone(this.data.phone)) {
        Tool.showAlert("请输入正确的手机号");
        return
    }
    if (Tool.isEmptyStr(this.data.code)) {
        Tool.showAlert("请输入验证码");
        return
    }
    this.setData({
        isNext: true
    })
  },
  //确定
  sure() {
    let params = {
      verificationCode: this.data.code,
      oldVerificationCode: this.data.oldCode,
      phone: this.data.phone,
      // reqName: '修改手机账号',
      // url: Operation.updateDealerNewPhone
    }
    API.updateDealerNewPhone(params).then((res) => {
      this.cancel();
      let infos = Storage.getUserAccountInfo()
      infos.phone = this.data.phone
      Storage.setUserAccountInfo(infos)
      Event.emit('refreshMemberInfoNotice');
      Tool.redirectTo('../account/account')
    }).catch((res) => {
      this.cancel();
      console.log(res)
    })
    // let r = RequestFactory.wxRequest(params);
    // r.successBlock = (req) => {
    //   let infos = Storage.getUserAccountInfo()
    //   infos.phone = this.data.phone
    //   Storage.setUserAccountInfo(infos)
    //   Event.emit('refreshMemberInfoNotice');
    //   Tool.redirectTo('../account/account')
    // };
    // r.completeBlock = (req) => {
    //   this.cancel();
    // }
    // Tool.showErrMsg(r)
  },
  // 取消
  cancel() {
    this.setData({
        isNext: false
    })
  },
  changeInput(e) {
    this.setData({
        code: e.detail.value
    })
  },
  changePhone(e) {
      this.setData({
          phone: e.detail.value
      })
  },
  getCodeTap() {
    if (!Tool.checkPhone(this.data.phone)) {
        Tool.showAlert("请输入正确的手机号");
        return
    }
    
    let params = {
      code: 'MOBILE_VERIFYNEWPHONE_CODE',
      phone: this.data.phone,
      // reqName: '发送短信',
      // url: Operation.sendMessage
    }
    
    let callBack = () => {
      API.sendMessage(params).then((res) => {
        wx.showToast({
          title: '验证码已发送',
        })
      }).catch((res) => {
        console.log(res)
      });
      // let r = RequestFactory.wxRequest(params);
      // r.successBlock = (req) => {
      //   wx.showToast({
      //       title: '验证码已发送',
      //   })
      // };
      // Tool.showErrMsg(r)
    }
    Tool.codeEnable(this, callBack)
  },
})