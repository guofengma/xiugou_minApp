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
    this.setData({
      num: options.query || ''
    });
    // this.selectComponent("#orderList").getData(this.data.num);
  },
  onShow(){
    this.selectComponent("#orderList").getData(this.data.num);
  },
  searchOrder(){
    Tool.navigateTo('/pages/search/search?door=1')
  },
  
  onUnload: function () {
    //this.selectComponent("#orderList").onUnload();
  },
})