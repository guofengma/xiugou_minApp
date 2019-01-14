let { Tool, API, Storage, Event, Config } = global
Page({
  data: {
    detail: {},
    jobId: '',
    status: '',
    id: ''
  },
  onLoad (options) {
    this.setData({
      id: options.id || '',
      jobId: options.jobId || '',
      status: options.status || ''
    })
    this.getTaskDetail(options.jobId)
  },
  getTaskDetail(jobId) {
    API.findByJobId({
      jobId: jobId
    }).then((res) => {
      let data = res.data || {};
      this.setData({
        detail: data
      })
    }).catcsh((res) => {
      console.log(res)
    })
  },
  onShareAppMessage () {
    return ({
      title: this.data.detail.remarks,
      path: `/pages/my/task/task-share/task-share?inviteId=${Storage.getterFor('userAccountInfo').id || ''}&jobId=${this.data.id}`,
      imageUrl: `${Config.imgBaseUrl}fexian_img@3x.png`
    });
  }
})