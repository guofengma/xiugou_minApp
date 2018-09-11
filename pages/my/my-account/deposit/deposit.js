let { Tool, RequestFactory, Event, Operation } = global;

Page({
    data: {
      account:'',
      add:false,
      isExplain:false,
      isLevel:false,
      iconArr: [
        { name: "推广提成", icon:"/img/tixian-icon-1.png"},
        { name: "销售提成", icon: "/img/tixian-icon-2.png" }
      ],
      totalPage: '', // 页面总页数
      currentPage: 1, // 当前的页数
      pageSize: 10, // 每次加载请求的条数 默认10 
      list:[]   
    },
    //兑换代币
    change(){
      Tool.navigateTo('../../../download-app/download-app')
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
        pageSize: this.data.pageSize,
        reqName: '分页查询待提现账户',
        url: Operation.settlementTotalByDealerId
      }
      let r = RequestFactory.wxRequest(params);
      // let r = global.RequestFactory.settlementTotalByDealerId(params);
      let list = this.data.list;
      r.successBlock = (req) => {
        let datas = req.responseObject.data
        if (datas.total>0){
          datas.data.forEach((item)=>{
            item.createTime = Tool.formatTime(item.createTime);
            if(item.calcType==4){
              item.iconIndex = 1
            } else if(item.calcType == 8) {
              item.iconIndex = 0
            }
            item.add = item.type ==2?  true:false
            item.showName = item.add ? "" : "退款"
            item.showName = item.status == 2? "已冻结":item.showName
          })
          this.setData({
            list: list.concat(datas.data),
            totalPage: datas.total,
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
      this.setData({
        account:options.account
      })
      this.getData()
    },
    onShow: function () {

    },

})