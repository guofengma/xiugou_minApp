let { Tool, Storage, Event} = global;
Page({
  data: {
    num: 0,
    disabled:true,
    isAjax:false,
  },
  //获取列表数据
  getList(e) {
    if(this.data.isAjax) return
    let index = e.currentTarget.dataset.index;
    this.setData({
      num: index,
      isAjax:true,
    });
    this.selectComponent("#orderList").getList();
  },
  // 上拉加载更多
  onReachBottom() {
    this.selectComponent("#orderList").onReachBottom()
  },
  isChange(){
    this.setData({
      isAjax: false
    })
  },
  onLoad: function (options) {
    Event.on('myOrderUpadate',this.myOrderUpadate,this)
    this.setData({
      num: options.query || ''
    })
    this.data.options = options
    this.selectComponent("#orderList").getData(this.data.num);
  },
  myOrderUpadate(){
    this.data.update = true
  },
  onShow(){
    if(this.data.update){
      this.getList({
        currentTarget:{dataset:{index:this.data.num}}
      })
      this.data.update = false
    }
  },
  searchOrder(){
    Tool.navigateTo('/pages/search/search?door=1')
  },
  
  onUnload: function () {
    Event.off('myOrderUpadate',this.myOrderUpadate)
    //this.selectComponent("#orderList").onUnload();
  },
})