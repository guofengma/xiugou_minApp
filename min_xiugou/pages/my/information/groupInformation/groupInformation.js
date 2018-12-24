let { Tool, API} = global
Page({
    data: {
        hasInf: false,
        time: ''
    },
    //获取拼店消息
    getData() {
      let params = {
        page: 1,
        pageSize: 10,
        'type':200,
      }
      API.queryMessage(params).then((res) => {
        let datas = res.data || {}
        if (datas.totalNum > 0) {
          let list = datas.data || [];
          this.setData({
            hasInf: true,
            time: Tool.formatTime(list[0].createdTime)
          })
        }
      }).catch((res) => {
        console.log(res)
      })
    },
    goPage(){
      Tool.navigateTo('/pages/web-view/web-view?webType=3')
    },
    onLoad: function (options) {
      this.getData()
    },
    onShow: function () {

    },
    onUnload: function () {

    },
})