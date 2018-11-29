let { Tool, Storage, API, Event } = global;
Page({
  data: {
    ysf: { title: '授权码录入' },
    invite:[],
    userInfo:'',
    openid:'',
    disabled:false,
    activeIndex:2,
    current:1,
  },
  onLoad: function (options) {
    Event.on('updateMentor', this.updateMentor,this)
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
  updateMentor(){
    this.setData({
      current: this.data.current,
    })
  },
  bindchange(e){ // 设置中间那项active
    // if(this.data.itemClicked){
    //   this.setData({
    //     itemClicked: false
    //   })
    //   return
    // }
    console.log(e)
    let activeIndex = e.detail.current +1
    if (activeIndex>=this.data.invite.length){
      activeIndex -= this.data.invite.length
    }
    this.setData({
      activeIndex: activeIndex
    })
  },
  itemClicked(e) { // 点击的头像的效果
    let index = e.currentTarget.dataset.index
    let current = index - 1 >= 0 ? index - 1 : this.data.invite.length - 1
    this.data.current = current
    // this.setData({
    //   current: current,
    // })
    Storage.setMentorProfile(this.data.invite[index])
    Tool.navigateTo("/pages/mentorInfo/choose-mentor/choose-mentor")
  },
  mentorBind() { // 绑定导师
    if (this.data.disabled) return
    this.setData({
      disabled: true
    })
    API.mentorBind({
      code: this.data.invite[this.data.activeIndex].code
    }).then((res) => {
      this.dismiss()
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
      this.setData({
        activeIndex: 2,
        current: 1,
        invite: datas,
        disabled: datas.length>0? false:true
        // mentorCode: res.data[2].code
      })
    }).catch((res) => {
      
    })
  },
  dismiss(){
    let callBack = () => {
      Tool.switchTab('/pages/index/index')
    }
    Tool.showSuccessToast('注册成功', callBack)
  },
  goPage(){
    Tool.navigateTo('/pages/register/write-invite-code/write-invite-code?from' + this.data.redirectTo)
  },
  onUnload(){
    Event.off('updateMentor', this.updateMentor)
  }
})