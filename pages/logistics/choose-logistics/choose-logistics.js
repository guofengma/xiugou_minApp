let { Tool, RequestFactory, Storage, Event, Operation } = global

Page({
  data: {
    ysf: { title: '选择物流公司' },
  },
  onLoad: function (options) {
    this.findAllExpress()
  },
  logLineClicked(e){
    let datas = {
      id: e.currentTarget.dataset.code,
      name: e.currentTarget.dataset.name
    }
    Storage.setExpressCom(datas)
    Event.emit('updateCompany')
    Tool.navigationPop()
  },
  findAllExpress(){
    let params = {
      reqName: '物流公司选择',
      url: Operation.findAllExpress
    }
    let r = RequestFactory.wxRequest(params);
    // let r = RequestFactory.findAllExpress();
    r.successBlock = (req) => {
      let datas = req.responseObject.data
      let arr = []
      for (let i in datas) {
        if (i !=='hot' && i!=="*"){
          arr.push({name:i,list:datas[i]})
        }
      }
      arr.unshift({ name:'常用物流', list:datas.hot})
      arr.push({
        name: '*', list: datas['*']
      })
      this.setData({
        lists:arr
      })
    };
    Tool.showErrMsg(r);
    r.addToQueue();
  }
})
