// pages/my/account.js
let { Tool, RequestFactory, Storage, Event, Operation} = global
Page({
    data: {
        hasInf: false,
        time: ''
    },
    //获取数据
    getData() {
      let params = {
        page: 1,
        pageSize: 10,
        reqName: '拼店消息',
        url: Operation.queryStoreMessageList
      }
      let r = RequestFactory.wxRequest(params);
        // let r = global.RequestFactory.queryStoreMessageList(params);
      r.successBlock = (req) => {
          if (req.responseObject.data.resultCount > 0) {
              let datas = [];
              datas = req.responseObject.data.data;
              this.setData({
                  hasInf: true,
                  time: Tool.formatTime(datas[0].pushTime)
              })
          }
          Event.emit('queryPushNum')
        };
        Tool.showErrMsg(r)
        r.addToQueue();
    },

    onLoad: function (options) {
      this.getData()
    },
    onShow: function () {

    },

    didLogin() {
        if (!Tool.didLogin(this)) {
            Tool.navigateTo('/pages/login/login-wx/login-wx');
            return false
        }
        return true
    },

    onUnload: function () {

    },
})