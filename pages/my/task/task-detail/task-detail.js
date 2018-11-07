let { Tool, RequestFactory, Storage, Event, Operation, Config } = global
Page({
  data: {
    detail: {},
    jobId: '',
    statsus: ''
  },
  onLoad (options) {
    console.log(options)
    this.setData({
      jobId: options.jobId,
      status: options.status || ''
    })
    this.getTaskDetail(options.jobId)
  },
  getTaskDetail(jobId) {
    let params = {
      url: Operation.findByJobId,
      jobId: jobId,
      requestMethod: 'GET'
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let data = req.responseObject.data || {};
      this.setData({
        detail: data
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  onShareAppMessage () {
    return ({
      title: this.data.detail.remarks,
      path: `/pages/my/task/task-share/task-share?inviteId=${Storage.getterFor('userAccountInfo').id || ''}&jobId=${this.data.jobId}`,
      imageUrl: 'https://dnlcrm.oss-cn-beijing.aliyuncs.com/xcx/task_detail_bg.png'
    });
  }
})