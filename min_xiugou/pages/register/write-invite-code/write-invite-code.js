let { Tool, RequestFactory, Storage, Operation } = global;
Page({
  data: {
    disabled:true
  },
  onLoad: function (options) {
    this.setData({
      urlFrom: options.from || null
    })
  },
  updateUserCodeById(){
    let params = {
      upCode: this.data.code,
      reqName: 'code绑定',
      url: Operation.updateUserCodeById,
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let datas = req.responseObject.data
      this.next()
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  changeInput(e){
    if (e.detail.value.length>=3){
      this.setData({
        code: e.detail.value,
        disabled:false
      })
    }
  },
  next(){
    let callBack = () => {
      if (this.data.urlFrom) {
        Tool.redirectTo(decodeURIComponent(this.data.urlFrom))
      } else {
        Tool.switchTab('/pages/index/index')
      }
    }
    Tool.showSuccessToast('注册成功', callBack)
  },
  dismiss(){
    this.next()
  },
  onUnload(){
    Tool.showSuccessToast('注册成功')
  }
})