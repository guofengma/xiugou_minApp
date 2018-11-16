let { Tool, RequestFactory, Storage, Event, Operation } = global

Page({
  data: {
    ysf: { title: '仅退款详情' },
    list:{},
    state:'',
    datas:[],
    stateInfo:[
      "", "商家审核中", "商家已同意您的退款请求", "商家拒绝退款", '商家退款中', '商家退款中','退款成功','已关闭','超时处理'
    ]
  },
  onLoad: function (options) {
    this.setData({
      list: Storage.getInnerOrderList() || '',
      returnProductId: options.returnProductId
    })
    this.findReturnProductById()
  },
  findReturnProductById(returnProductId) {
    let list = this.data.list
    let params = {
      returnProductId: this.data.returnProductId || this.data.list.returnProductId,
      reqName: '查看退款退货换货情况',
      url: Operation.findReturnProductById
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      Tool.findReturnProductById(req)
      let datas = req.responseObject.data
      let orderReturnAmounts = datas.orderReturnAmounts || {}
      if (orderReturnAmounts.actualTokenCoin) {
        let index = orderReturnAmounts.actualTokenCoin.indexOf('.')
        if(index!=-1){
          orderReturnAmounts.actualTokenCoin = orderReturnAmounts.actualTokenCoin.slice(0, index)
        }
       
      }

      datas.statusName = this.data.stateInfo[datas.status]
      if (datas.status ==6){
        datas.showRefundTime = Tool.formatTime(datas.orderReturnAmounts.refundTime)
      } else if (datas.status == 3){
        datas.statusName = '商家拒绝你的请求' 
        datas.showRefundTime = Tool.formatTime(datas.refuseTime)
      } else if (datas.status == 1) {
        datas.showRefundTime = datas.applyTime
      }
      this.setData({
        datas: datas
      })
      Event.emit('getDetail')
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
})