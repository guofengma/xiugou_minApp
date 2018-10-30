let { Tool, RequestFactory, Storage, Operation, Event } = global;
Page({
  data: {
    isShow:true
  },
  onLoad: function (options) {

  },
  goPage(){
    Tool.navigateTo('/pages/register/write-invite-code/write-invite-code') 
  },
  isShow(){
    this.setData({
      isShow: !this.data.isShow
    })
  }
})