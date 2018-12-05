let { Tool, API, Storage, Event } = global

Page({
  data: {
    list:{},
    state:'',
    datas:[],
    // stateInfo:[
    //   "", "商家审核中", "商家已同意您的退款请求", "商家拒绝退款", '商家退款中', '商家退款中','退款成功','已关闭','超时处理'
    // ]
  },
  onLoad: function (options) {
    this.setData({
      list: Storage.getInnerOrderList() || '',
      serviceNo: options.serviceNo
    })
    this.findReturnProductById()
  },
  findReturnProductById(returnProductId) {
    // 1.待审核 2.待寄回 3.待仓库确认 4.待平台处理 5.售后完成 6.售后关闭
    let list = this.data.list
    let params = {
      serviceNo: this.data.serviceNo || this.data.list.serviceNo,
    }
    API.afterSaleDetail(params).then((res) => {
      let datas = res.data || {}
      if (datas.countDownSeconds){
        this.countdown()
      }
      let afterSaleInfo = datas.afterSaleInfo || {}
      let imgList = afterSaleInfo.imgList || ''
      afterSaleInfo.showImgList = imgList.split(',')
      this.setData({
        datas:datas
      })
      Event.emit('getDetail')
    }).catch((res) => {
      console.log(res)
    });
  }
})