let { Tool,API,Storage, Event } = global
Page({
  data: {
    page: 1,
    pagesize: 10,
    list:[]
  },
  onLoad: function (options) {
    this.queryPromotionReceiveRecordPageList()
  },
  queryPromotionReceiveRecordPageList() {
    let params = {
      page: this.data.page,
      pageSize: this.data.pagesize,
      // reqName: '推广红包列表',
      // url: Operation.queryPromotionPackagePageList
    };
    API.queryPromotionPackagePageList(params).then((res) => {
      let datas = res.data || {}
      this.setData({
        list: this.data.list.concat(datas.data),
        totalPage: datas.totalPage
      })
    }).catch((res) => {
      console.log(res)
    })
  },
  itemClicked(e){
    let index = e.currentTarget.dataset.index
    let num = this.data.list[index].count
    let total = this.data.list[index].total
    let price = this.data.list[index].price
    let hasStock = this.data.list[index].status==2? false:true
    let id = this.data.list[index].id
    if (this.data.list[index].userBuy & hasStock)
      Tool.navigateTo(`/pages/my/extension/pay/pay?num=${num}&total=${total}&price=${price}&id=${id}&hasStock=${hasStock}`)
    // Tool.navigateTo('/pages/my/extension/pay/pay?num=' + num + "&total=" + total + '&price=' + price+'&id='+id)
  },
  onReachBottom() {
    this.data.page++;
    if (this.data.page > this.data.totalPage) {
      return
    }
    this.setData({
      page: this.data.page,
    })
    this.queryPromotionReceiveRecordPageList()
  },
  onHide: function () {

  },
  onUnload: function () {

  },
})