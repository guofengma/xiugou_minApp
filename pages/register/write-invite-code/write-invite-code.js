let { Tool, RequestFactory, Storage, Operation } = global;
Page({
  data: {
    disabled:true
  },
  onLoad: function (options) {
  
  },
  changeInput(e){
    if (e.detail.value.length>=11){
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
  }
})