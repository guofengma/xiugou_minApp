let { Tool, Storage, API } = global;
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
  },
  onShow: function () {

  },
  changeClicked(){ // 换一换
    this.queryInviterList()
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
  itemClicked(e) { // 点击的头像的效果
    let index = e.currentTarget.dataset.index
    let current = index - 1 >= 0 ? index - 1 : this.data.invite.length - 1
    this.setData({
      activeIndex: index,
      current: current
    })
    Tool.navigateTo("/pages/mentorInfo/mentor-detail/mentor-detail?id=" + this.data.inviteId)
  },
  mentorBind() { // 绑定导师
    API.mentorBind({

    }).then((res) => {
      this.dismiss()
    }).catch((res) => {
      
    })
  },
  queryInviterList(){ // 获取导师的列表
    API.queryInviterList({
      
    }).then((res) => {
      this.setData({
        invite: res.data
      })
    }).catch((res) => {
      
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