let { Tool, Storage, Event, API } = global

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
    API.findAllExpress({}).then((res) => {
      let datas = res.data || {}
      let arr = []
      for (let i in datas) {
        if (i !=='hotVo' && i!=="*"){
          arr.push({name:i,list:datas[i]})
        }
      }
      arr.unshift({ name: '常用物流', list: datas.hotVo})
      arr.push({
        name: '*', list: datas['*']
      })
      this.setData({
        lists:arr
      })
    }).catch((res) => {
      console.log(res)
    })
  }
})
