let { Tool, RequestFactory, Event, Storage, Operation} = global

Page({
  data: {
    ysf: { title: '收货地址管理' },
    addressType:1,
    addressList:[]
  },
  onLoad: function (options) {
    Tool.isIPhoneX(this)
    this.queryUserAddressList()
    Event.on('updateAdressList', this.queryUserAddressList, this)
    this.setData({
      door: options.door || ''
    })
  },
  onShow: function () {

  },
  addressClicked(e) {
   if(this.data.door==1){
     let index = e.currentTarget.dataset.index
     Storage.setOrderAddress(this.data.addressList[index])
     Event.emit('updateOrderAddress')
     Tool.navigationPop()
   }
  },
  queryUserAddressList(){
    let params = {
      reqName: '获取地址列表',
      url: Operation.queryUserAddressList
    }
    let r = RequestFactory.wxRequest(params);
    // let r = RequestFactory.queryUserAddressList();
    r.finishBlock = (req) => {
      let data = req.responseObject.data
      data.forEach((item) => {
        item.addressInfo = item.province + item.city + item.area + item.address
        item.hasData = true
      })
      if (req.responseObject.data.length>0){
        this.setData({
          addressList: req.responseObject.data
        })
      }
    };
    r.addToQueue();
  },
  setDefault(e){
    // let id = this.getAddressId(e).id
    // let r = RequestFactory.setDefaultAddress({id:id});
    let params = {
      id: this.getAddressId(e).id,
      reqName: '设置默认地址',
      url: Operation.setDefaultAddress
    }
    let r = RequestFactory.wxRequest(params);
    r.finishBlock = (req) => {
      this.queryUserAddressList()
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  getAddressId(e){
    let index = e.currentTarget.dataset.index
    let id = this.data.addressList[index].id
    return {index,id}
  },
  deleteAddress(e){
    let item = this.getAddressId(e)
    let callBack = ()=>{
      // let r = RequestFactory.deleteUserAddress({ id: item.id });
      let params = {
        id: item.id,
        reqName: '删除地址',
        url: Operation.deleteUserAddress
      }
      let r = RequestFactory.wxRequest(params);
      r.finishBlock = (req) => {
        let list = this.data.addressList
        list.splice(item.index, 1)
        this.setData({
          addressList: list
        })
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    }
    Tool.showComfirm('是否确认删除此地址', callBack)
  },
  editAddress(e){
    let index = this.getAddressId(e).index
    let list = this.data.addressList[index]
    this.newAddress(list,1)
  },
  newAddress(list,types){
    let page = '/pages/address/new-address/new-address'
    if(types == 1){
      page = page+'?address=' + JSON.stringify(list)
    }
    Tool.navigateTo(page)
  },
  onUnload: function () {
    Event.off('updateAdressList', this.queryUserAddressList);
  },
})