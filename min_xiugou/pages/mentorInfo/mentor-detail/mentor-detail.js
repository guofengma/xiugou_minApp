let { Tool,Storage, API } = global;
Page({
  data: {

  },
  onLoad: function (options) {
    this.findLeader()
  },
  findLeader() {
    API.findLeader({
      
    }).then((res) => {
      this.setData({
        datas:res.data
      })
    }).catch((res) => {
      
    });
  }
})