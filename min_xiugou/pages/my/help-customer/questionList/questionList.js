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
    },
    toDetail(e){
      let id = e.currentTarget.dataset.id
      Tool.navigateTo('/pages/my/help-customer/questionDetail/questionDetail?id='+id)
    },
    onLoad: function (options) {
      this.queryHelpQuestionList(options.id)
    },
    onUnload: function () {
    }
})