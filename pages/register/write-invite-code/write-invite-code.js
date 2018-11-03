let { Tool, RequestFactory, Storage, Operation } = global;
Page({
  data: {
    disabled:true
  },
  onLoad: function (options) {
  
  },
  updateUserCodeById(){
    let params = {
      upCode: productId,
      reqName: 'code绑定',
      url: Operation.activityByProductId,
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
  },
  dismiss(){
    this.next()
  },
  onUnload(){
    Tool.showSuccessToast('注册成功')
  }
})