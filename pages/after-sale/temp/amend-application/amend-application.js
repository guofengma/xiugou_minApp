let { Tool, RequestFactory, Operation, Storage } = global

Component({
  properties: {
    list:Object,
    applyType:String
  },
  data: {

  },
  methods: {
    revokeApply(){
      let callBack = ()=>{
        let params = {
          returnProductId: this.data.list.id,
          reqName: '查看退款退货换货情况',
          url: Operation.revokeApply
        }
        let r = RequestFactory.wxRequest(params);
        r.successBlock = (req) => {
          Tool.redirectTo('/pages/my/my-order/my-order')
        };
        Tool.showErrMsg(r)
        r.addToQueue();
      }
      Tool.showComfirm('确认撤销本次申请吗', callBack)
    },
    updateApply(){
      // Tool.redirectTo(this.data.pageArr[this.data.list.type] + '?returnProductId=' + this.data.list.id)
      this.data.list.address = {
        receiveAddress: this.data.list.receiveAddress,
        receiver: this.data.list.receiver,
        receivePhone: this.data.list.receivePhone,
      }
      this.data.list.returnProductId = this.data.list.id
      this.data.list.id = this.data.list.orderProductId
      Storage.setInnerOrderList(this.data.list)
      let types = this.data.list.type -1
      Tool.redirectTo('/pages/after-sale/apply-sale-after/apply-sale-after?returnProductId=' + this.data.list.returnProductId + '&&refundType=' + types)
    }
  }
})
