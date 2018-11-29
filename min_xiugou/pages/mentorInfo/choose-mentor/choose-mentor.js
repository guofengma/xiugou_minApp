let { Tool, Storage, API, Event } = global;
Page({
  data: {

  },
  onLoad: function (options) {
    this.setData({
      datas:Storage.getMentorProfile() || ''
    })
  },
  choose(){
    Event.emit('updateMentor')
    this.dismiss()
  },
  dismiss(){
    Tool.navigationPop()
  }
})