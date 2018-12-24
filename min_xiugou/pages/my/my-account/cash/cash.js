let { Tool, API, Config, Storage} = global;
Page({
    data: {
      account:'',
      imgBaseUrl: Config.imgBaseUrl,
      params: {},
      totalPage: '', // 页面总页数
      currentPage: 1, // 当前的页数
      pageSize: 10, // 每次加载请求的条数 默认10
      list: [],
      types:[
        { name:"其他"},
        { name: "用户收益", icon: "xjhb-icon.png"},
        { name: "提现支出", icon: "txzc-icon.png" },
        { name: "消费支出", icon: "xfzc-icon.png" },
        { name: "导师管理费", icon: "dzfh-icon.png" },
        { name: "品牌分红奖", icon: "dpfh-icon.png" },
        { name: "品牌推广奖励", icon: "xstc-icon.png" },
        { name: "现金红包", icon: "tg_03-04@2x.png" },
        { name: "任务奖励", icon: "xwjl-icon.png" },
        { name: "消费退款", icon: "xstc-icon.png" },
      ]
    },
    //获取数据
    getData() {
      let params = {
        page: this.data.currentPage,
        size: this.data.pageSize,
        'type':1,
      }
      this.data.params = params
      API.getuserBalance(params).then((res) => {
        let datas = res.data || {}
        if (datas.totalPage > 0) {
          datas.data.forEach((item) => {
            item.createTime = Tool.formatTime(item.createTime);
            item.add = item.biType == 1 ? true : false
            item.balance = Tool.formatNum(item.balance || 0)
          })
          this.setData({
            list: this.data.list.concat(datas.data),
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
    //提现
    beCash(){
      Tool.navigateTo('/pages/web-view/web-view?webType=3')
    },
    onLoad: function (options) {
      this.getData();
      let account = Storage.getUserAccountInfo().availableBalance || 0
      account = Tool.formatNum(account)
      this.setData({
        account: account,
      })
    },
    onShow: function () {

    },

})