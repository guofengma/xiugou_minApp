let { Tool, RequestFactory, Storage, Event, Operation } = global
Page({
  data: {
    ysf: { title: '退货退款详情' },
    addressType:1,
    result: [ // 退货
      { state: "其他" },
      { state: "等待商家处理", info: "商家已同意退货退款申请，请尽快发货", time: '' },
      { state: "商家已通过", info: "请在规定时间内退货给卖家", tips: "退款中", time: '' },
      { state: "商家拒绝退货申请", info: "" },
      { state: "请退货请商家", info: "等待商家确认" },
      { state: "等待商家确认", info: "", time: '' },
      { state: "退货完成", info: "", time: '' },
      { state: "退货申请已撤销", info: "已撤销退货退款申请，申请已关闭，交易将正常进行，请关注交易" },
      { state: "退货时间超时", info: "请" },
    ],
    time:'',
    datas:'',
    expressNo: { id: 0, content: "请填写寄回的物流信息" },
    resultIndex:0,
  },
  onLoad: function (options) {
    this.setData({
      list: Storage.getInnerOrderList() || '',
      returnProductId: options.returnProductId
    })
    this.findReturnProductById(options.returnProductId)
    Event.on('updataExpressNo', this.updataExpressNo, this)
  },
  updataExpressNo() {
    this.setData({
      expressNo: { id: 2, content: Storage.getExpressNo() }
    })
    this.findReturnProductById(this.data.returnProductId)
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
      let time = ''
      let status = datas.status
      let expressNo = this.data.expressNo
      let resultIndex=0
      if (status == 2) {
        let self = this
        if (!datas.expressNo) {
          datas.endTime = Tool.formatTime(datas.outTime)
          time = setInterval(function () { Tool.getDistanceTime(datas.endTime, self); }, 1000);
        }
      }
      if (status == 1) {
        this.data.result[status].time = Tool.formatTime(datas.applyTime)
      }
      if (datas.expressNo) {
        expressNo = { id: 2, content: datas.expressNo }
      }
      if (status == 6) {
        this.data.result[status].time = Tool.formatTime(datas.orderReturnAmounts.refundTime)
      }
      if (status == 3) {
        this.data.result[status].info = datas.refusalReason
        this.data.result[status].time = Tool.formatTime(datas.refuseTime)
      }
      this.setData({
        expressNo: expressNo,
        time:time,
        datas: datas,
        resultIndex: status,
        result: this.data.result
      })
      Event.emit('getDetail')
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  logClicked(e){
    let express = e.currentTarget.dataset.express
    let page = ''
    if (express.id == 0) {
      page = '/pages/logistics/write-logistics/write-logistics?id=' + this.data.datas.id
    } else {
      page = '/pages/logistics/logistics?id=' + express.content + '&door=1&type=1'
    }
    Storage.setAfterSaleList(this.data.datas)
    Tool.navigateTo(page)
  },
  onUnload: function () {
    clearInterval(this.data.time)
    Event.off('updataExpressNo', this.updataExpressNo)
  },
})