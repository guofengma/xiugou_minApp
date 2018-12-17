let { Tool, API } = global;
Page({
    data: {
      list:''
    },
    queryHelpQuestionList(id) {
      API.queryHelpQuestionList({

      }).then((res) => {
        let datas = res.data || []
        datas.forEach((item,index)=>{
          if(item.id==id){
            this.setData({
              list: item.helpQuestionExtList || []
            })
          }
        })
      }).catch((res) => {
        console.log(res)
      })
      // let params = {
      //   reqName: '查询问题列表',
      //   requestMethod: 'GET',
      //   url: Operation.queryHelpQuestionList
      // }
      // let r = RequestFactory.wxRequest(params);
      // r.successBlock = (req) => {
      //   this.setData({
      //     list: req.responseObject.data[id]
      //   })
      // }
      // Tool.showErrMsg(r)
      // r.addToQueue();
    },
    toDetail(e){
      let id = e.currentTarget.dataset.id
      Tool.navigateTo('/pages/my/help-customer/questionDetail/questionDetail?id='+id)
    },
    onLoad: function (options) {
      console.log(options.id)
      this.queryHelpQuestionList(options.id)
    },
    onUnload: function () {
    }
})