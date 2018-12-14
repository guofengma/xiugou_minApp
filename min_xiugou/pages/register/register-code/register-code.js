let { Tool, Storage, API, Event } = global;
Page({
  data: {
    ysf: { title: '授权码录入' },
    invite:[0,1],
    userInfo:'',
    openid:'',
    disabled:false,
    activeIndex:2,
    current:1,
    multiple:3
  },
  onLoad: function (options) {
    // Event.on('updateMentor', this.updateMentor,this)
    this.setData({
      accoutInfo: options,
      userInfo: Storage.wxUserInfo() || false,
      openid: Storage.getWxOpenid() || '',
      urlFrom: options.from || null
    })
    this.queryInviterList() // 请求邀请者
  },
  onShow: function () {

  },
  changeClicked(){ // 换一换
    this.queryInviterList()
  },
  // updateMentor(){
  //   this.setData({
  //     current: this.data.current,
  //   })
  // },
  bindchange(e){ // 设置中间那项active
    if (this.data.isAjax){
      this.setData({
        isAjax:false
      })
      return
    }
    this.setActive(e.detail.current)
    // let activeIndex = e.detail.current +1
    // if (activeIndex>=this.data.invite.length){
    //   activeIndex -= this.data.invite.length
    // }
    // this.setData({
    //   activeIndex: activeIndex
    // })
  },
  itemClicked(e) { // 点击的头像的效果
    let index = e.currentTarget.dataset.index
    let current = index - 1 >= 0 ? index - 1 : this.data.invite.length - 1
    this.setData({
      current: current,
    })
    this.setActive(current)
    Storage.setMentorProfile(this.data.invite[index])
    Tool.navigateTo("/pages/mentorInfo/choose-mentor/choose-mentor")
  },
  setActive(current){
    let activeIndex = current + 1
    if (activeIndex >= this.data.invite.length) {
      activeIndex -= this.data.invite.length
    }
    this.setData({
      activeIndex: activeIndex
    })
  },
  mentorBind() { // 绑定导师
    if (this.data.disabled) return
    this.setData({
      disabled: true
    })
    API.mentorBind({
      code: this.data.invite[this.data.activeIndex].code
    }).then((res) => {
      let datas = res.data || {}
      Storage.setFirstRegistration(datas.give)
      this.toast()
    }).catch((res) => {
      this.setData({
        disabled: false
      })
    })
  },
  queryInviterList(){ // 获取导师的列表
    API.queryInviterList({
      
    }).then((res) => {
      let datas = res.data || []
      this.data.multiple = datas.length >= 3 ? 3 : datas.length
      let current = datas.length > 3 ? 1:0
      let activeIndex = datas.length > 3 ? 2 : datas.length ==3? 1:0
      this.setData({
        activeIndex: activeIndex,
        current: current,
        invite: datas,
        multiple: this.data.multiple,
        disabled: datas.length>0? false:true,
        isAjax:true
      })
    }).catch((res) => {
      
    })
  },
  toast(){
    let callBack = () => {
      Tool.switchTab('/pages/index/index')
    }
    Tool.showSuccessToast('注册成功', callBack)
  },
  dismiss(){
    API.givePackage({}).then((res) => {
      let datas = res.data || {}
      Storage.setFirstRegistration(datas.give)
      this.toast()
    }).catch((res) => {

    })
  },
  goPage(){
    Tool.navigateTo('/pages/register/write-invite-code/write-invite-code?from' + this.data.redirectTo)
  },
  onUnload(){
    this.dismiss()
    // Event.off('updateMentor', this.updateMentor)
  }
})