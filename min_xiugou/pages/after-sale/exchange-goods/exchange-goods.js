let { Tool, API, Storage, Event } = global
Page({
  data: {
    addressType:1,
    src:'/img/address-icon-gray.png',
    // result:[ // 换货
    //   { state:"其他"},
    //   { state: "等待商家处理", info: "", time: '' },
    //   { state: "商家已同意", info: "请在规定时间内退货给卖家", time: ''},
    //   { state: "商家拒绝换货申请", info: "请联系客服" },
    //   { state: "请退货请商家", info: "等待商家确认" },
    //   { state: "等待商家确认", info: "",time:'' },
    //   { state: "换货完成", info: "" },
    //   { state: "换货申请已撤销", info: "" },
    //   { state: "订单异常", info: "请联系客服" }
    // ],
    // resultIndex:0,
    expressNo: { id: 0, content:"填写寄回的物流信息"},
    SaleExpressNo: { id:1, content: "暂无商家物流信息"}
  },
  onLoad: function (options) {
    this.setData({
      list: Storage.getInnerOrderList() || '',
      serviceNo: options.serviceNo
    })
    this.findReturnProductById(options.serviceNo)
    Event.on('updataExpressNo', this.updataExpressNo,this)
  },
  updataExpressNo(){
    this.setData({
      expressNo: { id: 2, content: Storage.getExpressNo() }
    })
    this.findReturnProductById(this.data.returnProductId)
  },
  findReturnProductById(returnProductId) {
    API.afterSaleDetail({
      serviceNo: this.data.serviceNo || this.data.list.serviceNo,
    }).then((res) => {
      let datas = res.data || {}
      let afterSaleInfo = datas.afterSaleInfo || {}
      let imgList = afterSaleInfo.imgList || ''
      afterSaleInfo.showImgList = imgList.split(',')
      if (datas.type==2){
        Tool.redirectTo('/pages/after-sale/return-goods/return-goods?serviceNo=' + serviceNo)
        return
      }
      let status = datas.status
      let expressNo = this.data.expressNo
      let SaleExpressNo = this.data.SaleExpressNo
      // 有结束时间 状态为2  并且没有物流单号的情况下 开始倒计时
      if (datas.countDownSeconds && status == 2 && !datas.address.expressCode) {
        this.countdown(this)
      }
      if (datas.address.expressCode){
        expressNo = { id: 2, content: datas.address.expressCode}
      }
      if (datas.refundAddress.expressCode) {
        SaleExpressNo = { id: 2, content: datas.refundAddress.expressCode }
      }
      this.setData({
        datas: datas,
        SaleExpressNo: SaleExpressNo,
        expressNo: expressNo,
      })
      Event.emit('getDetail')
    }).catch((res) => {
      console.log(res)
    })
  },
  countdown: function (that) { // 倒计时
    clearTimeout(that.data.time);
    let distanceTime = Tool.showDistanceTime(this.data.datas.countDownSeconds || 0)
    if (this.data.datas.countDownSeconds == 0) {
      that.findReturnProductById(this.data.serviceNo)
      return
    }
    let time = setTimeout(function () {
      this.data.datas.countDownSeconds--
      that.countdown(that);
    }, 1000)
    that.setData({
      distanceTime: distanceTime,
      time: time
    });
  },
  logClicked(e) {
    let express = e.currentTarget.dataset.express
    let types = e.currentTarget.dataset.type
    let page = ''
    if (express.id==0){
      page = '/pages/logistics/write-logistics/write-logistics?serviceNo=' + this.data.datas.serviceNo
    } else if (express.id == 1) {
      return
    } else {
      page = '/pages/logistics/logistics?id=' + express.content + '&door=1&type='+types
    }
    Storage.setAfterSaleList(this.data.datas)
    Tool.navigateTo(page)
  },
  onUnload: function () {
    Event.emit('getDetail')
    clearInterval(this.data.time)
    Event.off('updataExpressNo', this.updataExpressNo)
  },
})