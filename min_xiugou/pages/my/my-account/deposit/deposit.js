let { Tool, API, Config, Storage } = global;

Page({
  data: {
    account: '',
    imgBaseUrl: Config.imgBaseUrl,
    add: false,
    isExplain: false,
    isLevel: false,
    types: [
      { name: "其他" },
      { name: "用户收益", icon: "xjhb-icon.png" },
      { name: "提现支出", icon: "txzc-icon.png" },
      { name: "消费支出", icon: "xfzc-icon.png" },
      { name: "导师管理费", icon: "dzfh-icon.png" },
      { name: "品牌分红奖", icon: "dpfh-icon.png" },
      { name: "品牌推广奖励", icon: "xstc-icon.png" },
      { name: "现金红包", icon: "tg_03-04@2x.png" },
      { name: "任务奖励", icon: "xwjl-icon.png" },
      { name: "消费退款", icon: "xstc-icon.png" },
    ],
    totalPage: '', // 页面总页数
    currentPage: 1, // 当前的页数
    pageSize: 10, // 每次加载请求的条数 默认10 
    list: []
  },
  //兑换代币
  change() {
    Tool.navigateTo('/pages/web-view/web-view?webType=3')
  },
  // 提现说明
  explain() {
    this.setData({
      isExplain: true,
    })
  },
  //备注受限
  limit() {
    this.setData({
      isLevel: true,
    })
  },
  getData() {
    let params = {
      page: this.data.currentPage,
      size: this.data.pageSize,
      'type': 2,
    }
    this.data.params = params
    API.getuserBalance(params).then((res) => {
      let datas = res.data || {}
      if (datas.totalPage > 0) {
        datas.data.forEach((item) => {
          item.createTime = Tool.formatTime(item.createTime);
          item.add = item.biType == 1 ? true : false
          item.balance = Tool.formatNum(item.balance || 0)
          item.realBalance0 = Tool.formatNum(item.realBalance || 0)
          // item.add = item.type ==1?  true:false
          // item.showName = item.add ? "" : "退款"
          // item.showName = item.status == 2? "已冻结":item.showName
        })
        this.setData({
          list: list.concat(datas.data),
          totalPage: datas.totalPage,
        })
      }
    }).catch((res) => {
      console.log(res)
    });
  },

  // 上拉加载更多
  onReachBottom() {
    let { currentPage, totalPage } = this.data
    currentPage++
    if (totalPage >= currentPage) {
      this.setData({
        currentPage: currentPage
      })
      this.getData();
    }
  },
  // 关闭弹窗
  closeMask() {
    this.setData({
      isExplain: false,
      isLevel: false,
    })
  },
  onLoad: function (options) {
    let account = Storage.getUserAccountInfo().blockedBalance || 0
    account = Tool.formatNum(account)
    this.setData({
      account: account
    })
    this.getData()
  },
  onShow: function () {

  },

})