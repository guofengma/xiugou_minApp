let { Tool, RequestFactory, Event, Operation, Config, Storage} = global;

Page({
    data: {
      account:'',
      add:false,
      isExplain:false,
      isLevel:false,
      types: [
        { name: "其他" },
        { name: "用户收益", icon: "yhsy-icon.png" },
        { name: "提现支出", icon: "txzc-icon.png" },
        { name: "消费支出", icon: "xdxf-icon.png" },
        { name: "店主分红", icon: "yhsy-icon.png" },
        { name: "店员分红", icon: "yhsy-icon.png" },
        { name: "销售提成", icon: "tixian-icon-2.png" },
        { name: "推广提成", icon: "tg_03-04@2x.png" },
      ],
      totalPage: '', // 页面总页数
      currentPage: 1, // 当前的页数
      pageSize: 10, // 每次加载请求的条数 默认10 
      list:[]   
    },
    //兑换代币
    change(){
      Tool.navigateTo('/pages/web-view/web-view?webType=3')
    },
    // 提现说明
    explain(){
      this.setData({
          isExplain:true,
      })
    },
    //备注受限
    limit(){
      this.setData({
        isLevel:true,
      })
    },
    getData() {
      let params = {
        page: this.data.currentPage,
        size: this.data.pageSize,
        requestMethod: 'GET',
        'type': 2,
        reqName: '分页查询待提现账户',
        url: Operation.getuserBalance
      }
      let r = RequestFactory.wxRequest(params);
      let list = this.data.list;
      r.successBlock = (req) => {
        let datas = req.responseObject.data
        if (datas.totalPage>0){
          datas.data.forEach((item)=>{
            item.createTime = Tool.formatTime(item.createTime);
            item.add = item.biType == 1 ? true : false
            item.balance = Tool.formatNum(item.balance || '')
            item.realBalance = Tool.formatNum(item.realBalance || '')
            // item.add = item.type ==1?  true:false
            // item.showName = item.add ? "" : "退款"
            // item.showName = item.status == 2? "已冻结":item.showName
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
    // 关闭弹窗
    closeMask(){
      this.setData({
          isExplain:false,
          isLevel:false,
      })
    },
    onLoad: function (options) {
      let account = Storage.getUserAccountInfo().blockedBalance || 0
      account = Tool.formatNum(account)
      this.setData({
        account: account,
        imgBaseUrl: Config.imgBaseUrl
      })
      this.getData()
    },
    onShow: function () {

    },

})