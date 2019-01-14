let { Tool, API, Event, Storage} = global

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
    API.queryUserAddressList({}).then((res) => {
      let data = res.data || []
      data.forEach((item) => {
        item.addressInfo = item.province + item.city + item.area + item.address
        item.hasData = true
      })
      if (data.length > 0) {
        this.setData({
          addressList:data
        })
      }
    }).catch((res) => {
      console.log(res)
    });
  },
  setDefault(e){
    API.setDefaultAddress({
      id: this.getAddressId(e).id,
    }).then((res) => {
      this.queryUserAddressList()
    }).catch((res) => {
      console.log(res)
    });
  },
  getAddressId(e){
    let index = e.currentTarget.dataset.index
    let id = this.data.addressList[index].id
    return {index,id}
  },
  deleteAddress(e){
    let item = this.getAddressId(e)
    let callBack = ()=>{
      API.deleteAddress({
        id: item.id,
      }).then((res) => {
        let list = this.data.addressList
        list.splice(item.index, 1)
        this.setData({
          addressList: list
        })
      }).catch((res) => {
        console.log(res)
      });
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