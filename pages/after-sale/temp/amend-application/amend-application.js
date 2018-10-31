let { Tool, RequestFactory, Operation, Storage, Event } = global

Component({
  properties: {
    list:Object,
    applyType:String,
    returnProductId:Number
  },
  data: {

  },
  methods: {
    revokeApply(){
      let callBack = ()=>{
        this.findReturnProductById(1)
      }
      Tool.showComfirm('确认撤销本次申请吗', callBack)
    },
    revokeApplyReq(){
      let params = {
        returnProductId: this.data.list.id,
        reqName: '查看退款退货换货情况',
        url: Operation.revokeApply
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        Event.emit('getDetail')
        Tool.navigationPop()
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    updateApplyClicked(){
      this.findReturnProductById(2)
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
    },
    findReturnProductById(num) {
      let params = {
        returnProductId: this.data.returnProductId,
        reqName: '查看退款退货换货情况',
        url: Operation.findReturnProductById
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let datas = req.responseObject.data
        if (datas.status==1){
          num == 1 ? this.revokeApplyReq() : this.updateApply()
        } else {
          let content = num==1? "不能撤销本次申请":"不能修改本次申请"
          Tool.showAlert(content)
          this.triggerEvent('reloadPage');
        }
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
  }
})
