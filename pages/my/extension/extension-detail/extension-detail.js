let { Tool, RequestFactory, Storage, Event, Operation } = global

Page({
  data: {
    page: 1,
    pagesize: 10,
    list:[]
  },
  onLoad: function (options) {
    this.setData({
      packageId: options.packageId
    })
    this.queryPromotionReceiveRecordPageList()
    Tool.isIPhoneX(this)
  },
  queryPromotionReceiveRecordPageList() {
    let params = {
      packageId: this.data.packageId,
      page: this.data.page,
      pageSize: this.data.pagesize,
      reqName: '分页查询用户领取红包记录列表',
      url: Operation.queryPromotionReceiveRecordPageList
    };
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let datas = req.responseObject.data || {}
      datas.data.forEach((item, index) => {
        item.createTime = Tool.formatTime(item.createTime)
        if (item.phone)
        item.showPhone = item.phone.slice(0, 3) + "*****" + item.phone.slice(7)
      })
      this.setData({
        list: this.data.list.concat(datas.data),
        totalPage: datas.totalPage
      })
    }
    Tool.showErrMsg(r)
    r.addToQueue();
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
  onShareAppMessage: function (res) {
    return {
      title: name,
      path: '/pages/my/extension/extension-detail/extension-detail',
      imageUrl: imgUrl
    }
  },
})