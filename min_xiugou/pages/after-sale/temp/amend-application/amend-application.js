let { Tool, API, Storage, Event } = global

Component({
  properties: {
    list:Object,
    applyType:String,
    serviceNo:String
  },
  data: {

  },
  methods: {
    revokeApply(){
      let callBack = ()=>{
        this.findReturnProductById(1)
      }
      Tool.showComfirm('您将撤销本次申请，如果有问题未解决，你还可以再次发起，确定继续吗？', callBack)
    },
    revokeApplyReq(){ // 撤销申请
      API.cancelAfterSale({
        serviceNo: this.data.list.serviceNo
      }).then((res) => {
        Event.emit('getDetail')
        Tool.navigationPop()
      }).catch((res) => {
        console.log(res)
      })
    },
    updateApplyClicked(){
      this.findReturnProductById(2)
    },
    updateApply(){
      this.data.list.address = {
        receiveAddress: this.data.list.receiveAddress,
        receiver: this.data.list.receiver,
        receivePhone: this.data.list.receivePhone,
      }
      this.data.list.returnProductId = this.data.list.id
      this.data.list.id = this.data.list.orderProductId
      Storage.setInnerOrderList(this.data.list)
      let types = this.data.list.type -1
      Tool.redirectTo('/pages/after-sale/apply-sale-after/apply-sale-after?serviceNo=' + this.data.list.serviceNo + '&&refundType=' + types)
    },
    findReturnProductById(num) {
      API.afterSaleDetail({
        serviceNo: this.data.list.serviceNo
      }).then((res) => {
        let datas = res.data || {}
        if (datas.status == 1) {
          num == 1 ? this.revokeApplyReq() : this.updateApply()
        } else {
          let content = num == 1 ? "不能撤销本次申请" : "不能修改本次申请"
          Tool.showAlert(content)
          this.triggerEvent('reloadPage');
        }
      }).catch((res) => {
        console.log(res)
      })
    },
  }
})
