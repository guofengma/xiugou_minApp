let { Tool, Storage, API, Event } = global;
Page({
  data: {
    disabled:false
  },
  onLoad: function (options) {
    this.setData({
      datas:Storage.getMentorProfile() || ''
    })
  },
  mentorBind() { // 绑定导师
    if (this.data.disabled) return
    this.setData({
      disabled: true
    })
    API.mentorBind({
      code: this.data.datas.code
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
  choose(){
    // Event.emit('updateMentor')
    this.dismiss()
  },
  dismiss(){
    API.givePackage({}).then((res) => {
      let datas = res.data || []
      Storage.setFirstRegistration(datas.give)
      this.toast()
    }).catch((res) => {

    })
  },
  toast(){
    let callBack = () => {
      Tool.switchTab('/pages/index/index')
    }
    Tool.showSuccessToast('注册成功', callBack)
  }
})