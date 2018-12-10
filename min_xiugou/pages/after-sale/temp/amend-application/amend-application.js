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
      let num = this.data.list.maxRevokeTimes - this.data.list.hadRevokeTimes || 0;
      if (num == 0){
        Tool.showComfirm('平台售后操作已到上限')
        return
      }
      Tool.showComfirm(`确定撤销本次申请吗?剩余申请${num}次`, callBack)
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
      Tool.redirectTo('/pages/after-sale/apply-sale-after/apply-sale-after?serviceNo=' + this.data.list.serviceNo + '&refundType=' + types+'&orderProductNo=' + this.data.list.orderProductNo)
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
