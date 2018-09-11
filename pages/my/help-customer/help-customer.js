let { Tool, RequestFactory, Operation} = global;

Page({
    data: {
      list:''
    },
    onLoad: function (options) {
      Tool.isIPhoneX(this)
      Tool.getUserInfos(this)
      this.queryHelpQuestionList()
    },
    queryHelpQuestionList(){
      let params = {
        reqName: '根据ID查询问题详情',
        url: Operation.queryHelpQuestionList
      }
      let r = RequestFactory.wxRequest(params);
      // let r = RequestFactory.queryHelpQuestionList();
      r.successBlock = (req) => {
        let data = req.responseObject.data ? req.responseObject.data : {}
        let typeList = req.responseObject.data.typeList
        let list = req.responseObject.data.list
        let listArr =[]
        for (let i = 0; i < typeList.length;i++){
          typeList[i].list=[]
          //let arr = []
          for (let j = 0; j < list.length; j++) {
            if (list[j].name == typeList[i].name){
              //arr.push(list[j])
              typeList[i].list.push(list[j])
            }
          }
          // if(arr.length>0){
          //   listArr.push({ name: typeList[i].name, list: arr, typeid: typeList[i].id})
          // }         
        }
        this.setData({
          //list: listArr,
          list: data.typeList
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