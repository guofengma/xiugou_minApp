let { Tool, API, Storage, Event } = global

Page({
  data: {
    page:1,
    pagesize:10,
    stauts:{
      0:'未推广',
      1:'已推广',
      2:'已结束',
      3:'已取消',
    },
    list:[]
  },
  onLoad: function (options) {
    Tool.isIPhoneX(this)
    this.queryUserBuyPromotionPromoter()
  },
  bottomBtnClicked(){
    Tool.navigateTo('/pages/my/extension/extension-type/extension-type')
  },
  itemClicked(e){
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    let endTime = this.data.list[index].endTime
    let status = this.data.list[index].status
    // Tool.navigateTo('/pages/my/extension/pay/pay?num=')
    Tool.navigateTo('/pages/my/extension/extension-detail/extension-detail?packageId=' + id + '&endTime=' + endTime + '&status=' +status)
  },
  goPage() {
    Tool.navigateTo('/pages/web-view/web-view?webType=1')
  },
  onShow: function () {

  },
  queryUserBuyPromotionPromoter(){
    let params = {
      page:this.data.page,
      pageSize: this.data.pagesize,
      // reqName: '分页查询用户购买信息列表',
      // url: Operation.queryUserBuyPromotionPromoter
    };
    API.queryUserBuyPromotionPromoter(params).then((res) => {
      let datas = res.data || {}
      datas.data.forEach((item,index)=>{
        item.showRemianPrice = Tool.mul(item.price || 0, item.remain || 0)
        item.createTime = Tool.formatTime(item.createTime)
      })
      this.setData({
        list: this.data.list.concat(datas.data),
        totalPage: datas.totalPage
      })
    }).catch((res) => {
      console.log(res)
    })
  },
  onReachBottom() {
    this.data.page++;
    if (this.data.page > this.data.totalPage) {
      return
    }
    this.setData({
      page:this.data.page,
    })
    this.queryUserBuyPromotionPromoter()
  },
  onUnload: function () {

  },
  
})