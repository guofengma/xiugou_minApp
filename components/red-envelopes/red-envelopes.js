let { Tool, RequestFactory, Storage, Event, Operation } = global;
Component({
  properties: {
    // visiable: Boolean,
    door:Number, // 1注册页面领取 2 产品页面
  },
  data: {
    visiable:false,
    succ:false,
  },
  methods: {
    close() {
      this.setData({
        visiable:false
      })
    },
    givingPackageToUser(){
      let params = {
        id: this.data.datas.id,
        url: Operation.givingPackageToUser,
        requestMethod: 'GET',
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        this.setData({
          succ:true
        })
        Event.emit('getLevel') 
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    goPage(){
      Tool.navigateTo('/pages/my/my-account/cash/cash')
    },
    btnClick(){
      let params = {
        'type':this.data.door,
        url: Operation.userReceivePackage,
        requestMethod: 'GET',
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        this.setReqData(req)
      };
      //Tool.showErrMsg(r)
      r.addToQueue();
    },
    setReqData(req){
      let datas = req.responseObject.data
      if (datas.phone) {
        datas.showPhone = datas.phone.slice(0, 3) + "*****" + datas.phone.slice(7)
      }
      this.setData({
        visiable: true,
        datas: datas
      })
    }
  }
})
