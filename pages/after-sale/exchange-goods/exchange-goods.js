let { Tool, RequestFactory, Storage, Event, Operation } = global
Page({
  data: {
    ysf: { title: '换货详情' },
    addressType:1,
    src:'/img/address-icon-gray.png',
    result:[ // 换货
      { state: "商家已通过", info: "请在规定时间内退货给卖家", time: ''},
      { state: "换货中", info: "等待商家确认" },
      { state: "等待买家确认收货", info: "",time:'' },
      { state: "换货完成", info: "" },
      { state: "商家拒绝您的请求", info: "请联系客服" },
      { state: "订单异常", info: "请联系客服" }
    ],
    resultIndex:0,
    expressNo: { id: 0, content:"填写寄回的物流信息"},
    SaleExpressNo: { id:1, content: "暂无商家物流信息"}
  },
  onLoad: function (options) {
    this.setData({
      list: Storage.getInnerOrderList() || ''
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
    let list = this.data.list
    let params = {
      returnProductId: returnProductId || this.data.list.returnProductId,
      reqName: '查看退款退货换货情况',
      url: Operation.findReturnProductById
    }
    let r = RequestFactory.wxRequest(params);
    // let r = RequestFactory.findReturnProductById(params)
    r.finishBlock = (req) => {
      Tool.findReturnProductById(req)
      let datas = req.responseObject.data
      if (datas.returnProduct.type==2){
        Tool.redirectTo('/pages/after-sale/return-goods/return-goods?returnProductId=' + returnProductId)
        return
      }
      datas.receive.recevicePhone = datas.receive.recevice_phone
      // datas.returnProduct.
      let resultIndex = 0
      let status = datas.returnProduct.status
      let expressNo = this.data.expressNo
      let SaleExpressNo = this.data.SaleExpressNo
      let time =''
      if (status == 1) {
        let self = this
        if (!datas.returnProduct.express_no) {
          datas.endTime = Tool.formatTime(datas.returnProduct.out_time)
          time = setInterval(function () { Tool.getDistanceTime(datas.endTime, self); }, 1000);
        }
      }
      if (datas.returnProduct.express_no){
        if (status == 1) resultIndex=1
        expressNo = { id: 2, content: datas.returnProduct.express_no }
      }
      if (datas.returnProduct.ec_express_no) {
        if (status == 1) resultIndex = 2
        SaleExpressNo = { id: 2, content: datas.returnProduct.ec_express_no }
      }
      if (status==4){
        resultIndex = 3
      } else if (status == 3 ){
        resultIndex = 4
      } else if (status == 6 || status == 5){
        resultIndex = 5
      }
      this.setData({
        datas: datas,
        SaleExpressNo: SaleExpressNo,
        expressNo: expressNo,
        resultIndex: resultIndex,
        time: time
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
      page = '/pages/logistics/write-logistics/write-logistics?id=' + this.data.datas.returnProduct.id
    } else if (express.id == 1) {
      return
    } else {
      page = '/pages/logistics/logistics?orderId=' + this.data.datas.returnProduct.id + '&door=1&type='+types
    }
    Storage.setAfterSaleList(this.data.datas)
    Tool.navigateTo(page)
  },
  onUnload: function () {
    clearInterval(this.data.time)
    Event.off('updataExpressNo', this.updataExpressNo)
  },
})