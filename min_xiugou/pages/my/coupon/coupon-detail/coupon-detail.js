let { Storage } = global;
Page({
  data: {
    
  },
  onLoad: function (options) {
    this.setData({
      detail: Storage.getCoupon() || ""
    })
  },
  toDetail(){
    
  }
})