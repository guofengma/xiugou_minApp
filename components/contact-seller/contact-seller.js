let { Tool } = global
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    phone:String
  },
  data: {
    userInfos:{},
    ysf: { title: '售后页面' }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    makePhoneCall () {
      wx.makePhoneCall({
        phoneNumber: this.properties.phone,
        success: ()=>{
          console.log("成功拨打电话")
        }
      })
    },
    refreshMemberInfoNotice() {
      Tool.getUserInfos(this)
    },
  },
  ready: function () {
    this.refreshMemberInfoNotice()
  },
})
