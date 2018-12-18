let { Tool, API, Storage, Event } = global
Page({
  data: {
    addressType:1,
    src:'/img/address-icon-gray.png',
    // result:[ // 换货
    //   { state:"其他"},
    //   { state: "等待商家处理", info: "", time: '' },
    //   { state: "商家已同意", info: "请在规定时间内退货给卖家", time: ''},
    //   // { state: "商家拒绝换货申请", info: "请联系客服" },
    //   { state: "等待商家确认", info: "" },
    //   { state: "待平台处理 ", info: "",time:'' },
    //   { state: "换货完成", info: "" },
    //   { state: "换货申请已撤销或换货关闭", info: "" },
    //   // { state: "订单异常", info: "请联系客服" }
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
      let expressNo = this.data.expressNo
      let datas = res.data || {}
      if (datas.type==2){
        Tool.redirectTo('/pages/after-sale/return-goods/return-goods?serviceNo=' + this.data.serviceNo)
        return
      }
      // let imgList = datas.imgList || ''
      // console.log(imgList)
      // datas.showImgList = imgList.split(',')
      let status = datas.status
      // datas.createTime = Tool.formatTime(datas.createTime)
      // 平台地址
      // let refundAddress = datas.refundAddress || {}
      // refundAddress.addressInfo = refundAddress.province + refundAddress.city + refundAddress.area + refundAddress.address
      // let address = datas.refundAddress || {}
      datas.addressInfo = datas.province + datas.city + datas.area + (datas.street || '')  + datas.address
      this.setData({
        datas: datas,
        resultIndex: status
      })
      let orderRefundExpress = datas.orderRefundExpress || {}
      let SaleExpressNo = this.data.SaleExpressNo
      // 有结束时间 状态为2  并且没有物流单号的情况下 开始倒计时
      
      // let orderRefundExpress = datas.orderRefundExpress || {}
      if (orderRefundExpress.expressCode) {
        expressNo = {
          id: 2, content: orderRefundExpress.expressNo, name: orderRefundExpress.expressName
        }
      }
      if (datas.sendExpressNo) {
        SaleExpressNo = { id: 2, content: datas.sendExpressNo, name: datas.sendExpressName }
      }
      this.setData({
        datas: datas,
        SaleExpressNo: SaleExpressNo,
        expressNo: expressNo,
      })
      if (status > 1 && !orderRefundExpress.expressNo && !datas.sendExpressNo && status <6) {
        datas.countDownSeconds = Math.floor((datas.cancelTime - datas.nowTime) / 1000 )
        // console.log((datas.cancelTime - datas.nowTime) / 1000)
        this.countdown(this)
      }
      Event.emit('getDetail')
    }).catch((res) => {
      console.log(res)
    })
  },
  countdown(that) { // 倒计时
    clearTimeout(that.data.time);
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
    clearTimeout(this.data.time)
    Event.off('updataExpressNo', this.updataExpressNo)
  },
})