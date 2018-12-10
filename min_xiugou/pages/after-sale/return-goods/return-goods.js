let { Tool, API, Storage, Event } = global
Page({
  data: {
    addressType:1,
    // result: [ // 退货
    //   { state: "其他" },
    //   { state: "等待商家处理", info: "商家已同意退货退款申请，请尽快发货", time: '' },
    //   { state: "商家已通过", info: "请在规定时间内退货给卖家", tips: "退款中", time: '' },
    //   { state: "商家拒绝退货退款申请", info: "" },
    //   { state: "请退货请商家", info: "等待商家确认" },
    //   { state: "等待商家确认", info: "", time: '' },
    //   { state: "退货完成", info: "", time: '' },
    //   { state: "退货申请已撤销", info: "已撤销退货退款申请，申请已关闭，交易将正常进行，请关注交易" },
    //   { state: "退货时间超时", info: "请" },
    // ],
    // resultIndex: 0,
    time:'',
    datas:'',
    expressNo: { id: 0, content: "请填写寄回的物流信息" },
  },
  onLoad: function (options) {
    this.setData({
      list: Storage.getInnerOrderList() || '',
      serviceNo: options.serviceNo
    })
    this.findReturnProductById(options.serviceNo)
    Event.on('updataExpressNo', this.updataExpressNo, this)
  },
  updataExpressNo() {
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
      let imgList = datas.imgList || ''
      datas.showImgList = imgList.split(',')
      let status = datas.status
      datas.createTime = Tool.formatTime(datas.createTime)
      let refundAddress = datas.refundAddress || {}
      refundAddress.addressInfo = refundAddress.province + refundAddress.city + refundAddress.area + refundAddress.address
      let orderRefundExpress = datas.orderRefundExpress || {}
      if (status>1 && !orderRefundExpress.expressNo) {
        datas.countDownSeconds = Math.floor((datas.cancelTime-datas.nowTime)/1000)
        // console.log(datas.cancelTime,datas.nowTime)
        this.countdown(this)
        // if (!datas.expressNo) {
        //   datas.endTime = Tool.formatTime(datas.cancelTime)
        //   time = setInterval(function () { Tool.getDistanceTime(datas.endTime, self); }, 1000);
        // }
      }
      let expressNo = this.data.expressNo
      if (orderRefundExpress.expressCode) {
        expressNo = {
          id: 2, content: orderRefundExpress.expressNo }
      }
      this.setData({
        expressNo: expressNo,
        datas: datas
      })
      Event.emit('getDetail')
    }).catch((res) => {
      console.log(res)
    })
  },
  countdown (that) { // 倒计时
    clearTimeout(that.data.time);
    let distanceTime = Tool.showDistanceTime(that.data.datas.countDownSeconds || 0)
    if (that.data.datas.countDownSeconds == 0) {
      that.findReturnProductById(that.data.serviceNo)
      return
    }
    let time = setTimeout(function () {
      that.data.datas.countDownSeconds--
      that.countdown(that);
    }, 1000)
    that.setData({
      distanceTime: distanceTime,
      time: time
    });
  },
  logClicked(e){
    let express = e.currentTarget.dataset.express
    let page = ''
    if (express.id == 0) {
      page = '/pages/logistics/write-logistics/write-logistics?serviceNo=' + this.data.datas.serviceNo
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