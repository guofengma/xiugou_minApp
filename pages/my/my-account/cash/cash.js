let { Tool, RequestFactory, Operation} = global;
Page({
    data: {
        account:'',
        params: {},
        totalPage: '', // 页面总页数
        currentPage: 1, // 当前的页数
        pageSize: 10, // 每次加载请求的条数 默认10
        list: [],
        hasNext: true//是否有下一页
    },
    //获取数据
    getData() {
        if (this.data.hasNext) {
          let params = {
            pageSize: this.data.pageSize,
            page: this.data.currentPage,
            reqName: '现金账户',
            url: Operation.queryDetailBalanceListAPP
          }
          this.setData({
              params: params
          });
          let r = RequestFactory.wxRequest(params);
          // let r = global.RequestFactory.queryDetailBalanceListAPP(params);
          let list = this.data.list;
          r.successBlock = (req) => {
              let datas = [];
              for (let i in req.responseObject.data.data) {
                  let item = req.responseObject.data.data[i];
                  item.create_time = Tool.formatTime(item.create_time);
                  if (item.use_type == 5) {
                      item.add = false
                  } else {
                      item.add = true
                  }
                  datas.push(item)
              }
              this.setData({
                  list: list.concat(datas),
                  totalPage: req.responseObject.data.total,
              });
              if (this.data.totalPage > this.data.currentPage) {
                  this.setData({
                      currentPage: ++this.data.currentPage
                  })
              } else {
                  this.data.hasNext = false
              }
            };
            Tool.showErrMsg(r)
            r.addToQueue();
        }

    },

    // 上拉加载更多
    onReachBottom() {
        this.getData();
    },
    //提现
    beCash(){
        Tool.navigateTo('../../../download-app/download-app')
    },
    onLoad: function (options) {
        this.getData();
        this.setData({
            account:options.account
        })
    },
    onShow: function () {

    },

})