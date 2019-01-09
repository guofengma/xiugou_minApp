let { Tool, API, Storage, Event } = global
Page({
  data: {
    addressType:1,
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
      let status = datas.status
      let orderRefundExpress = datas.orderRefundExpress || {}
      let expressNo = this.data.expressNo
      if (orderRefundExpress.expressCode) {
        expressNo = {
          id: 2, content: orderRefundExpress.expressNo, name: orderRefundExpress.expressName }
      }
      this.setData({
        expressNo: expressNo,
        datas: datas
      })
      if (status > 1 && !orderRefundExpress.expressNo && status < 6) {
        datas.countDownSeconds = Math.floor((datas.cancelTime - datas.nowTime) / 1000)
        this.countdown(this)
      }
      Event.emit('getDetail')
    }).catch((res) => {
      console.log(res)
    })
  },
  countdown (that) { // 倒计时
    clearTimeout(that.data.time);
    console.log(that.data.datas.countDownSeconds)
    let distanceTime = Tool.showDistanceTime(that.data.datas.countDownSeconds || 0)
    if (that.data.datas.countDownSeconds == 0) {
      that.findReturnProductById(that.data.serviceNo)
      return
    }
    that.data.datas.countDownSeconds--
    let time = setTimeout(function () {
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
    clearTimeout(this.data.time)
    Event.off('updataExpressNo', this.updataExpressNo)
  },
})