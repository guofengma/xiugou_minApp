let { Tool, RequestFactory, Storage, Event, Operation } = global
Page({
  data: {
    select:true,
    isShow:false,
    tipsContent:['系统将会在明天0点进行站内推广','每成功获取一个下级讲收到站内消息推送'],
    tipsBtn:['我的推广','站内分享推广'],
    result:false,
  },
  onLoad: function (options) {
    this.setData({
      num: options.num,
      price: options.price,
      total: options.total,
    })
  },
  selectIcon(){
    this.setData({
      select: !this.data.select
    })
  },
  showResult(bool){
    this.setData({
      result: bool,
      isShow:true,
    })
  },
  payResultClicked(e){
    let index = e.currentTarget.dataset.index
  },
  payClicked(){

  },
  onHide: function () {

  },
  onUnload: function () {

  },
})