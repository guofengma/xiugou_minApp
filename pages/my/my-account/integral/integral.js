let { Tool, RequestFactory, Operation, Config, Storage} = global;
Page({
    data: {
      account:'',
      params: {},
      totalPage: '', // 页面总页数
      currentPage: 1, // 当前的页数
      pageSize: 10, // 每次加载请求的条数 默认10
      list: [],
      hasNext: true,//是否有下一页
      useTypeArr: [ // '注册赠送',"活动赠送","商品购买抵扣"
        { name: '其他', icon: '' },
        { name: '注册赠送', icon:'zczs-icon.png'},
        { name: '活动赠送', icon: 'hdzs-icon.png' },
        { name: '商品购买抵扣', icon: 'xdxf-icon.png' },
        { name: '兑换一元券', icon: 'xdxf-icon.png' },
        { name: '签到', icon: 'zczs-icon.png' },
      ]
    },
    //获取数据
    getData() {
      if (this.data.hasNext) {
        let params = {
          size: this.data.pageSize,
          page: this.data.currentPage,
          requestMethod: 'GET',
          reqName: '查询秀豆账户',
          url: Operation.getUserrScore
        }
        let r = RequestFactory.wxRequest(params);
        this.setData({
          params: params
        });
        let list = this.data.list;
        r.successBlock = (req) => {
          let datas=[];
          for (let i in req.responseObject.data.data) {
            let item = req.responseObject.data.data[i];
            item.createTime = Tool.formatTime(item.createTime);
            // item.useTypeName = this.data.useTypeArr[item.usType]
            if (item.usType ==1) {
              item.add = true
            } else {
              item.add = false
            }
            datas.push(item)
          }
          this.setData({
            list: list.concat(datas),
            totalPage: req.responseObject.data.totalPage,
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
    goPage(){
      Tool.navigateTo('/pages/signIn/signIn')
    },
    onLoad: function (options) {
      this.getData();
      this.setData({
        account: options.query || Storage.getUserAccountInfo().userScore || '0.00',
        imgBaseUrl: Config.imgBaseUrl
      })
    },
    onShow: function () {

    },

})