let { Tool, RequestFactory, Storage, Event, Operation } = global;
Component({
  properties: {
    visiable: Boolean,
    door:Number, // 1注册页面领取 2 产品页面
  },
  data: {

  },
  methods: {
    close() {
      this.triggerEvent('isShow')
    },
    goPage(){
      Tool.navigateTo('/pages/my/coupon/my-coupon/my-coupon')
    },
    btnClick(){
      let params = {
        url: Operation.userReceivePackage,
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    }
  }
})
