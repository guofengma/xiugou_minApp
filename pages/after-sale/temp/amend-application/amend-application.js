let { Tool, RequestFactory, Operation } = global

Component({
  properties: {
    list:Object
  },
  data: {

  },
  methods: {
    revokeApply(){
      let callBack = ()=>{
        let params = {
          returnProductId: this.data.list.returnProductId,
          reqName: '查看退款退货换货情况',
          url: Operation.revokeApply
        }
        let r = RequestFactory.wxRequest(params);
        r.successBlock = (req) => {
          
        };
        Tool.showErrMsg(r)
        r.addToQueue();
      }
      Tool.showComfirm('确认撤销本次申请吗')
    },
    updateApply(){
      Tool.navigateTo('/pages/after-sale/apply-sale-after/apply-sale-after?returnProductId=' + this.data.list.returnProductId+'&&refundType=0')
    }
  }
})
