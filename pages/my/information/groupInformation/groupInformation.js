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
        'type':200,
        url: Operation.queryMessage
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        if (req.responseObject.data.totalNum > 0) {
          let datas = [];
          datas = req.responseObject.data.data;
          this.setData({
            hasInf: true,
            time: Tool.formatTime(datas[0].createdTime)
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
    onUnload: function () {

    },
})