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
      this.dismiss()
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
    let callBack = () => {
      Tool.switchTab('/pages/index/index')
    }
    Tool.showSuccessToast('注册成功', callBack)
  }
})