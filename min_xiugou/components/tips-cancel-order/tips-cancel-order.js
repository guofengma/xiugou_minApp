let { Tool, API } = global
Component({
  properties: {
    isCancel: Boolean,
    orderNum:String,
    door:Number,
    num:Number,
  },
  data: {
    reason:'',
    content:''
  },
  methods: {
    queryDictionaryDetailsType() { //获取取消订单的理由
      API.queryDictionaryDetailsType({
        code: 'QXDD',
      }).then((res) => {
        this.setData({
          reasonArr: res.data || []
        })
      }).catch((res) => {
        console.log(res)
      });
    },
    reasonClicked(e) { // 选择取消订单的理由
      //取消订单的理由
      let content = e.currentTarget.dataset.content;
      let index = e.currentTarget.dataset.index;
      this.setData({
        content: content,
        reason: index
      });
    },
    dismissCancel(){
      this.triggerEvent('dismissCancel', {...this.data});
    },
    cancelOrder() { // 取消订单
      if (this.data.content == '') {
        Tool.showAlert('请选择取消理由！');
        return
      }
      API.cancelOrder({
        orderNo: this.data.orderNum,
        cancelType:'2',
        cancelReason: this.data.content || '无',
        platformRemarks: this.data.content || '无',
      }).then((res) => {
        if (this.data.door == 1) {
          this.triggerEvent('cancelOrder', { ...this.data });
        } else {
          let num = this.data.num || ''
          Tool.redirectTo('/pages/my/my-order/my-order?query='+num)
        }
      }).catch((res) => {
        console.log(res)
      })
    },
  },
  ready: function () {
    this.queryDictionaryDetailsType()
  }
})
