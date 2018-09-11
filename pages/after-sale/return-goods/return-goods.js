let { Tool, RequestFactory, Storage, Event, Operation } = global
Page({
  data: {
    ysf: { title: '退货退款详情' },
    addressType:1,
    result: [ // 退货
      { state: "商家已通过", info: "请在规定时间内退货给卖家",tips:"退款中",time: '倒计时' },
      { state: "退货中", info: "等待商家确认",tips: "退款中" },
      { state: "退货成功", info: "",tips: "已退款",time: '完成的时间' },
      { state: "商家拒绝您的申请", info: "请联系客服" , tips: "", time: '' },
    ],
    time:'',
    datas:'',
    expressNo: { id: 0, content: "请填写寄回的物流信息" },
    resultIndex:0,
  },
  onLoad: function (options) {
    this.setData({
      list: Storage.getInnerOrderList() || ''
    })
    this.findReturnProductById(options.returnProductId)
    Event.on('updataExpressNo', this.updataExpressNo, this)
  },
  updataExpressNo() {
    this.setData({
      expressNo: { id: 2, content: Storage.getExpressNo() }
    })
  },
  findReturnProductById(returnProductId) {
    let list = this.data.list
    let params = {
      returnProductId: returnProductId || this.data.list.returnProductId,
      reqName: '查看退款退货换货情况',
      url: Operation.findReturnProductById
    }
    let r = RequestFactory.wxRequest(params);
    // let r = RequestFactory.findReturnProductById(params)
    r.successBlock = (req) => {
      Tool.findReturnProductById(req)
      let datas = req.responseObject.data
      datas.receive.recevicePhone = datas.receive.recevice_phone
      let time = ''
      let status = datas.returnProduct.status
      let expressNo = this.data.expressNo
      let resultIndex=0
      if (datas.returnProduct.status == 1 ) {
        let self = this
        if (!datas.returnProduct.express_no){
          datas.endTime = Tool.formatTime(datas.returnProduct.out_time)
          time = setInterval(function () { Tool.getDistanceTime(datas.endTime, self); }, 1000);
        }
      }

      if (datas.returnProduct.express_no) {
        if (status == 1) resultIndex = 1
        expressNo = { id: 2, content: datas.returnProduct.express_no }
      }
      if (status == 4){
        resultIndex = 2
      }
      if (status == 3){
        resultIndex = 3
      }
      this.setData({
        expressNo: expressNo,
        time:time,
        datas: datas,
        resultIndex: resultIndex
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
      page = '/pages/logistics/write-logistics/write-logistics?id=' + this.data.datas.returnProduct.id
    } else {
      page = '/pages/logistics/logistics?orderId=' + this.data.datas.returnProduct.id + '&door=1&type=1'
    }
    Storage.setAfterSaleList(this.data.datas)
    Tool.navigateTo(page)
  },
  onUnload: function () {
    clearInterval(this.data.time)
    Event.off('updataExpressNo', this.updataExpressNo)
  },
})