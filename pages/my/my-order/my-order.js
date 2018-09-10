let { Tool, Storage, Event} = global;
Page({
  data: {
    num: 0,
    disabled:true
  },
  //获取列表数据
  getList(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
        num: index,
    });
    this.selectComponent("#orderList").getList();
  },
  // 上拉加载更多
  onReachBottom() {
    this.selectComponent("#orderList").onReachBottom()
  },
  onLoad: function (options) {
    if (options.index) {
      this.setData({
        num: options.index
      });
    }
    this.selectComponent("#orderList").getData(this.data.num);
  },
  searchOrder(){
    Tool.navigateTo('/pages/search/search?door=1')
  },
  
  onUnload: function () {
    //this.selectComponent("#orderList").onUnload();
  },
})