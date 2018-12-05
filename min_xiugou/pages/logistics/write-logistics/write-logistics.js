let { Tool, API, Storage, Event } = global

Page({
  data: {
    code:'',//物流单号
    phone:'', //手机号
    company:{id:"",name:''},
    ysf: { title: '填写物流信息' },
  },
  onLoad: function (options) {
    Tool.isIPhoneX(this) 
    this.setData({
      list: Storage.getAfterSaleList() || ''
    })
    Event.on('updateCompany', this.updateCompany,this)
  },
  updateCompany(){
    this.setData({
      company: Storage.getExpressCom()
    })
  },
  fillInExpressInfoById() {
    let params = {
      serviceNo: this.data.list.serviceNo,
      expressName: this.data.company.name || '无',
      expressNo:this.data.code || '0000000000000',
    }
    API.afterSaleExpress(params).then((res) => {
      let datas = res.data
      Storage.setExpressNo(this.data.code)
      Event.emit('updataExpressNo')
      Tool.navigationPop()
    }).catch((res) => {
      console.log(res)
    });
  },
  onCodeClickListener: function () {
    // 扫二维码
    wx.scanCode({
      success: (res) => {
        let result = res.result;
        if (result.length > 0) {
         this.setData({
           code: result
         })
        }
      }
    })
  },
  inputOnchange(e){
    this.setData({
      code: e.detail.value
    })
  },
  logLineClicked(){
    Tool.navigateTo('/pages/logistics/choose-logistics/choose-logistics')
  },
  onUnload: function () {
    Event.off('updateCompany', this.updateCompany)
  },
})