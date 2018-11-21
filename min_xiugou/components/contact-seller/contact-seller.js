let { Tool } = global
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },
  data: {
    userInfos:{},
    ysf: { title: '售后页面' },
    phone:'400-9696-365'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    makePhoneCall () {
      wx.makePhoneCall({
        phoneNumber: this.data.phone,
        success: ()=>{
          console.log("成功拨打电话")
        }
      })
    },
    refreshMemberInfoNotice() {
      Tool.getUserInfos(this)
      console.log(this.data.userInfos)
    },
  },
  ready: function () {
    this.refreshMemberInfoNotice()
    Tool.isIPhoneX(this)
  },
})
