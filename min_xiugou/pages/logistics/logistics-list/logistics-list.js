let { Tool, API, Storage, Event } = global
Page({
  data: {
    hasExpress:true
  },
  onLoad: function (options) {

  },
  getOrderDeliverInfo() {
    API.getOrderDeliverInfo({
      orderNo:'',
    }).then((res) => {
      
    }).catch((res) => {
      console.log(res)
    })
  },
})