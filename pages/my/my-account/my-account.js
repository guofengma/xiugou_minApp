let { Tool, RequestFactory, Operation} = global;
Page({
    data: {
        available_balance:'',
        token_coin:'',
        user_score:'',
        blocked_balances:''
    },
    //页面跳转
    toPage(e) {
        let index = e.currentTarget.dataset.index;
        if (index == 0) {
            Tool.navigateTo('cash/cash?account='+this.data.available_balance)
        } else if (index == 1) {
            Tool.navigateTo('token/token?account='+this.data.token_coin)
        } else if (index == 2) {
            Tool.navigateTo('deposit/deposit?account=' + this.data.blocked_balances)
        } else if (index == 3) {
            Tool.navigateTo('integral/integral?account='+this.data.user_score)
        }
    },

    //获取数据
    getData() {
      let params = {
        reqName: '经销商账户',
        url: Operation.findDealerAccountByIdAPP
      }
      let r = RequestFactory.wxRequest(params);
        // let r = global.RequestFactory.findDealerAccountByIdAPP(params);
        r.finishBlock = (req) => {
            let data = req.responseObject.data;
            this.setData({
              available_balance: data.available_balance || '0.00',
              token_coin: data.token_coin || '0.00',
              user_score: data.user_score || '0.00',
                // blocked_balances: data.blocked_balances || 0,
            })
        };
        r.addToQueue();
    },
    //获取待提现账户
    getSettlementData() {
      let params = {
        reqName: '待提现账户',
        url: Operation.findSettlementTotalByBalance
      }
      let r = RequestFactory.wxRequest(params);
        // let r = global.RequestFactory.findSettlementTotalByBalance(params);
        r.finishBlock = (req) => {
            let data = req.responseObject.data;
            this.setData({
              blocked_balances: data || '0.00',
            })
        };
        r.addToQueue();
    },
    onLoad: function (options) {
        this.getData();
        this.getSettlementData();
    },

    onShow: function () {

    },

})