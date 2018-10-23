let { Tool, RequestFactory, Storage, Event, Operation } = global

Page({
  data: {
    ysf: { title: '仅退款详情' },
    list:{},
    state:'',
    datas:[]
  },
  onLoad: function (options) {
    this.setData({
      list: Storage.getInnerOrderList() || ''
    })
    this.findReturnProductById(options.returnProductId)
  },
  findReturnProductById(returnProductId) {
    let list = this.data.list
    let params = {
      returnProductId: returnProductId || this.data.list.returnProductId,
      reqName: '查看退款退货换货情况',
      url: Operation.findReturnProductById
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      Tool.findReturnProductById(req)
      let datas = req.responseObject.data
      if (datas.status ==6){
        datas.statusName = '退款成功'
        datas.showRefundTime = Tool.formatTime(datas.orderReturnAmounts.refundTime)
      } else if (datas.status == 3){
        datas.statusName = '商家拒绝你的请求' 
        datas.showRefundTime = Tool.formatTime(datas.refuseTime)
      } else if (datas.status == 1){
        datas.statusName = '申请中'
      } else {
        datas.statusName = '退款中'
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