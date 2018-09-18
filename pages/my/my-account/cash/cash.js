let { Tool, RequestFactory, Operation, Config} = global;
Page({
    data: {
      account:'',
      params: {},
      totalPage: '', // 页面总页数
      currentPage: 1, // 当前的页数
      pageSize: 10, // 每次加载请求的条数 默认10
      list: [],
      types:[
        { name:"其他"},
        { name: "用户收益", icon: "yhsy-icon.png"},
        { name: "提现支出", icon: "txzc-icon.png" },
        { name: "消费支出", icon: "xdxf-icon.png" },
        { name: "店主分红", icon: "yhsy-icon.png" },
        { name: "店员分红", icon: "yhsy-icon.png" },
        { name: "销售提成", icon: "tixian-icon-2.png" },
        { name: "推广提成", icon: "tg_03-04@2x.png" },
      ]
    },
    //获取数据
    getData() {
      let params = {
        page: this.data.currentPage,
        size: this.data.pageSize,
        requestMethod: 'GET',
        reqName: '分页查询现金账户',
        'type':2,
        url: Operation.getuserBalance
      }
      this.setData({
        params: params
      });
      let r = RequestFactory.wxRequest(params);
      let list = this.data.list;
      r.successBlock = (req) => {
        let datas = req.responseObject.data
        if (datas.totalPage > 0) {
          datas.data.forEach((item) => {
            item.createTime = Tool.formatTime(item.createTime);
            item.add = item.biType == 1 ? true : false
          })
          this.setData({
            list: list.concat(datas.data),
            totalPage: datas.totalPage,
          })
        }
      };
      Tool.showErrMsg(r)
      r.addToQueue();
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
      Tool.navigateTo('/pages/download-app/oldUser-downLoad/oldUser-downLoad')
    },
    onLoad: function (options) {
      this.getData();
      this.setData({
        account: options.query || '',
        imgBaseUrl: Config.imgBaseUrl
      })
    },
    onShow: function () {

    },

})