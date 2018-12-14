let { Tool, API, Storage } = global;
Page({
  data: {
    disabled:true
  },
  onLoad: function (options) {
    this.setData({
      urlFrom: options.from || null
    })
  },
  mentorBind() { // 绑定导师
    this.setData({
      disabled: true
    })
    API.mentorBind({
      code: this.data.code
    }).then((res) => {
      let datas = res.data || {}
      Storage.setFirstRegistration(datas.give)
      // this.dismiss()
      this.next()
    }).catch((res) => {
      this.setData({
        disabled: false
      })
    })
  },
  changeInput(e){
    if (e.detail.value.length>=1){
      this.setData({
        code: e.detail.value,
        disabled:false
      })
    }
  },
  next(){
    let callBack = () => {
      Tool.switchTab('/pages/index/index')
    }
    Tool.showSuccessToast('注册成功', callBack)
  },
  dismiss(){
    Tool.navigationPop()
  },
  onUnload(){
    // Tool.showSuccessToast('注册成功')
  }
})