let { Tool, RequestFactory, Storage, Operation } = global;
Page({
  data: {
    ysf: { title: '授权码录入' },
    invite:[0,1,2,3,4,5,6,7,8,9],
    inviteId:'',
    code:'',
    userInfo:'',
    openid:'',
    num:4, // 请求推荐人的个数
    disabled:true,
    itemId:0,
    activeIndex:2,
    current:1,
  },
  onLoad: function (options) {
    this.setData({
      accoutInfo: options,
      userInfo: Storage.wxUserInfo() || false,
      openid: Storage.getWxOpenid() || '',
      urlFrom: options.from || null
    })
    this.queryInviterList() // 请求邀请者
    // if (!options.id){
    //   this.queryInviterList() // 请求邀请者
    // } else {
    //   this.initInputValue() // 初始化input的值
    // }
  },
  onShow: function () {

  },
  bindchange(e){ // 设置中间那项active
    let activeIndex = e.detail.current +1
    if (activeIndex>=this.data.invite.length){
      activeIndex -=10
    }
    this.setData({
      activeIndex: activeIndex
    })
  },
  initInputValue(){
    this.setData({
      code: this.data.accoutInfo.id,
      disabled:true,
      inviteId: this.data.accoutInfo.id
    })
  },
  inputChange(e){
    this.setData({
      code:e.detail.value
    })
  },
  requetSignMember() {
    let params = {
      "phone": this.data.accoutInfo.phone,
      'password': this.data.accoutInfo.password,
      'inviteId': this.data.accoutInfo.id || '', // 邀请者id 
      'headImg': this.data.userInfo.avatarUrl,
      'nickname': this.data.userInfo.nickName,
      'openid': this.data.openid,
      reqName: '注册',
      url: Operation.signMember,
    }
    // 如果不是被邀请的 那么就取授权码
    if (!this.data.accoutInfo.id) {
      params.code = this.data.code
    }
    let r = RequestFactory.wxRequest(params);
    r.finishBlock = (req) => {
      Storage.setMemberId(req.responseObject.data.id)
      Tool.loginOpt(req)
      Tool.redirectTo('/pages/real-name/real-name')
    }
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  itemClicked(e){ // 点击的头像的效果
    let index = e.currentTarget.dataset.index
    let current = index -1>=0? index-1:this.data.invite.length-1
    this.setData({
      activeIndex:index,
      current: current
    })
  },
  formSubmit(e){
    if(Tool.isEmptyStr(e.detail.value.id)){
      Tool.showAlert('请输入会员ID或选择一个邀请者')
      return
    }
    // if (!this.data.isAgree){
    //   Tool.showAlert('请勾选用户协议')
    //   return
    // }
    this.requetSignMember()
  },
  // agreeCilcked(){
  //   this.setData({
  //     isAgree:!this.data.isAgree
  //   })
  // },
  queryInviterList(){
    let params = {
      amount: this.data.num,
      reqName: '获取邀请者列表',
      url: Operation.queryInviterList,
    }
    let r = RequestFactory.wxRequest(params);
    // let r = RequestFactory.queryInviterList({ });
    r.finishBlock = (req) => {
      this.setData({
        invite: req.responseObject.data
      })
    }
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  inviterClicked(e){
    let id = e.currentTarget.dataset.key
    this.setData({
      code: id || ''
    })
  },
  dismiss(){
    let callBack = () => {
      if(this.data.urlFrom){
        Tool.redirectTo(decodeURIComponent(this.data.urlFrom))
      } else {
        Tool.switchTab('/pages/index/index')
      }
    }
    Tool.showSuccessToast('注册成功', callBack)
  },
  goPage(){
    Tool.navigateTo('/pages/register/write-invite-code/write-invite-code?from' + this.data.redirectTo)
  }
})