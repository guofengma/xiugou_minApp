let { Tool, RequestFactory, Storage, Event, Operation } = global
Page({
  data: {
    ysf: { title: '换货详情' },
    addressType:1,
    src:'/img/address-icon-gray.png',
    result:[ // 换货
      { state:"其他"},
      { state: "申请中", info: "等待商家通过", time: '' },
      { state: "商家已通过", info: "请在规定时间内退货给卖家", time: ''},
      { state: "商家拒绝您的请求", info: "请联系客服" },
      { state: "换货中", info: "等待商家确认" },
      { state: "换货中", info: "等待买家确认收货",time:'' },
      { state: "换货完成", info: "" },
      { state: "换货申请已撤销", info: "请联系客服" },
      { state: "换货时间超时", info: "请联系客服" }
    ],
    resultIndex:0,
    expressNo: { id: 0, content:"填写寄回的物流信息"},
    SaleExpressNo: { id:1, content: "暂无商家物流信息"}
  },
  onLoad: function (options) {
    this.setData({
      list: Storage.getInnerOrderList() || '',
    })
    this.findReturnProductById(options.returnProductId)
    Event.on('updataExpressNo', this.updataExpressNo,this)
  },
  updataExpressNo(){
    this.setData({
      expressNo: { id: 2, content: Storage.getExpressNo() }
    })
  },
  findReturnProductById(returnProductId) {
    console.log(returnProductId)
    let list = this.data.list
    let params = {
      returnProductId: Number(returnProductId) || this.data.list.returnProductId,
      reqName: '查看退款退货换货情况',
      url: Operation.findReturnProductById
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      Tool.findReturnProductById(req)
      let datas = req.responseObject.data
      if (datas.type==2){
        Tool.redirectTo('/pages/after-sale/return-goods/return-goods?returnProductId=' + returnProductId)
        return
      }
      let status = datas.status
      let expressNo = this.data.expressNo
      let SaleExpressNo = this.data.SaleExpressNo
      let time =''
      if (status == 2) {
        let self = this
        if (!datas.expressNo) {
          datas.endTime = Tool.formatTime(datas.outTime)
          time = setInterval(function () { Tool.getDistanceTime(datas.endTime, self); }, 1000);
        }
      }
      if (datas.expressNo){
        expressNo = { id: 2, content: datas.expressNo }
      }
      if (datas.ecExpressNo) {
        SaleExpressNo = { id: 2, content: datas.ecExpressNo }
      }
      
      if(status==6){
        this.data.result[status].time = Tool.formatTime(datas.backsendTime)
      }
      if (status == 3) {
        this.data.result[status].info = datas.refusalReason
      }
      this.setData({
        datas: datas,
        SaleExpressNo: SaleExpressNo,
        expressNo: expressNo,
        resultIndex: status,
        time: time,
        result: this.data.result
      })
      Event.emit('getDetail')
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  logClicked(e) {
    let express = e.currentTarget.dataset.express
    let types = e.currentTarget.dataset.type
    let page = ''
    if (express.id==0){
      page = '/pages/logistics/write-logistics/write-logistics?id=' + this.data.datas.id
    } else if (express.id == 1) {
      return
    } else {
      page = '/pages/logistics/logistics?id=' + express.content + '&door=1&type='+types
    }
    Storage.setAfterSaleList(this.data.datas)
    Tool.navigateTo(page)
  },
  onUnload: function () {
    clearInterval(this.data.time)
    Event.off('updataExpressNo', this.updataExpressNo)
  },
})