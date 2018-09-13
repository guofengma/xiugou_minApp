let { Tool, RequestFactory, Event, Operation} = global

Page({
  data: {
    ysf: { title: '新增收货地址' },
    region: [],
    receiver:'',
    recevicePhone:'',
    address:'',
    addressList:{},
    id:'',
    hidden:false,
    isDefault:false
  },
  onLoad: function (options) {
    // 如果有参数 就编辑地址 无参数就创建地址
    let list = options.address
    if (list !== undefined){
      list = JSON.parse(options.address)
      let region = this.data.region
      region[0] = { name: list.province, code: list.provinceCode}
      region[1] = { name: list.city, code: list.cityCode }
      region[2] = { name: list.city, code: list.areaCode }
      this.setData({
        receiver: list.receiver,
        receiverPhone: list.receiverPhone,
        address: list.address,
        region: region,
        id:list.id
      })
      wx.setNavigationBarTitle({
        title: '编辑收货地址'
      })
    }
  },
  onShow: function () {

  },
  pickerClicked(e) {
    this.setData({
      region: e.detail.result,
      hidden: e.detail.hidden,
    })
  },
  formSubmit(e) {
    // 测试数据
      // this.setData({
      //   region: [{ zipcode: 110000 }, { zipcode: 110100 }, { zipcode: 110101 }]
      // })
      let params = e.detail.value;
      if (!(params.receiver.length >1 && params.receiver.length<17)) {
          Tool.showAlert("收货人姓名长度需在2-16位之间");
          return
      }
      if (!Tool.checkPhone(params.receiverPhone)) {
          Tool.showAlert("请输入正确的电话号码");
          return
      }
      if (this.data.region.length == 0) {
          Tool.showAlert("请选择你所在的省市区");
          return
      }
      if (Tool.isEmptyStr(params.address)) {
          Tool.showAlert("请输入详细地址");
          return
      }
      
      if (this.data.region[0]) {
        params.provinceCode = this.data.region[0].code;
      }
      if (this.data.region[1]) {
        params.cityCode = this.data.region[1].code;
      } else {
        params.cityCode = ''
      }
      if (this.data.region[2]) {
        params.areaCode = this.data.region[2].code;
      } else {
        params.areaCode = ''
      }
      this.requestAddUserAddress(params)
      
  },
  requestAddUserAddress(params) {
    params = {
      ...params,
      defaultStatus:this.data.isDefault? 1:2,
      reqName: '添加地址/修改地址',
      url: Operation.addUserAddress
    }
    if (this.data.id) params.id = this.data.id
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      //跳转到地址列表页面
      let tips = ''
      if (this.data.id){
        tips ='修改成功'
      } else {
        tips ='添加成功'
      }
      this.successCallBack(tips)
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  successCallBack(title){
    Event.emit('updateAdressList');//发出通知
    let  callBack  = () => {
      Tool.navigationPop()
    }  
    Tool.showSuccessToast(title, callBack)
  },
  setDefault(){
    this.setData({
      isDefault: !this.data.isDefault
    })
  }  
})