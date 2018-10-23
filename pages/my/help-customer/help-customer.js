let { Tool, RequestFactory, Operation} = global;

Page({
    data: {
      list:''
    },
    onLoad: function (options) {
      Tool.isIPhoneX(this)
      // Tool.getUserInfos(this)
      this.queryHelpQuestionList()
    },
    queryHelpQuestionList(){
      let params = {
        reqName: '查询问题列表',
        requestMethod: 'GET',
        url: Operation.queryHelpQuestionList
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let data = req.responseObject.data? req.responseObject.data : {}
        let listArr = []
        for (let key in data) {
          listArr.push({ 
            name: key, 
            list:data[key], 
            typeid: data[key][0].typeId
          })
        }
        this.setData({
          list: listArr
        })
      }
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    
    //跳到详情页
    toDetail(e) {
      let id = e.currentTarget.dataset.id
      Tool.navigateTo('/pages/my/help-customer/questionDetail/questionDetail?id='+id)
    },
    //跳到问题反馈页面
    questionFeedback(){
        Tool.navigateTo('questionFeedback/questionFeedback')
    },
    //跳到问题列表页面
    questionList(e){
      let id = e.currentTarget.dataset.typeid
      Tool.navigateTo('questionList/questionList?id='+id)
    },
    makePhoneCall() {
      wx.makePhoneCall({
        phoneNumber: '13336092569',
        success: () => {
          console.log("成功拨打电话")
        }
      })
    },
    onUnload: function () {
      
    }
})