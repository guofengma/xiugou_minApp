let { Tool, RequestFactory, Storage, Event, Operation, Config } = global
Page({
  data: {
    detail: {},
    jobId: '',
    status: '',
    id: ''
  },
  onLoad (options) {
    console.log(options)
    this.setData({
      id: options.id || '',
      jobId: options.jobId || '',
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
    console.log(`/pages/my/task/task-share/task-share?inviteId=${Storage.getterFor('userAccountInfo').id || ''}&jobId=${this.data.id}`);
    return ({
      title: this.data.detail.remarks,
      path: `/pages/my/task/task-share/task-share?inviteId=${Storage.getterFor('userAccountInfo').id || ''}&jobId=${this.data.id}`,
      imageUrl: 'https://mr-uat-sg.oss-cn-hangzhou.aliyuncs.com/xcx/fexian_img@3x.png'
    });
  }
})