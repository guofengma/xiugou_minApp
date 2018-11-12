let { Tool, RequestFactory, Storage, Event, Operation } = global

Page({
  data: {
    page: 1,
    pagesize: 10,
    list:[],
    stautsArr: {
      0: '未推广',
      1: '已推广',
      2: '已结束',
      3: '已取消',
    },
  },
  onLoad: function (options) {
    this.setData({
      packageId: options.packageId,
      endTime: options.endTime,
      status: options.status,
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
      if (this.data.status == 1) { // 开始倒计时
        let that = this
        let time = setInterval(function () { that.time() }, 1000)
        this.setData({
          time: time
        })
      } 
      this.setData({
        list: this.data.list.concat(datas.data),
        totalPage: datas.totalPage
      })
    }
    Tool.showErrMsg(r)
    r.addToQueue();
  }, 
  time() {
    let endTime = Tool.formatTime(Number(this.data.endTime))
    let countdown = Tool.getDistanceTime(endTime, this)
    if (countdown == 0) {
      clearTimeout(this.data.time);
      this.setData({
        detail: 3,
      })
    }
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
      title: '秀购随机红包',
      path: `/pages/index/index?type=100&id=${this.data.packageId}`,
      // path: '/pages/web-view/web-view?id=' + this.data.packageId,
    }
  },
  onUnload: function () {
    clearTimeout(this.data.time)
  },
})