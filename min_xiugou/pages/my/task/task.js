let { Tool, RequestFactory, Storage, Event, Operation } = global
Page({
  data: {
    jobs: []
  },
  onLoad(options) {
  },
  getTask() {
    let params = {
      url: Operation.queryJobsByUserId,
      requestMethod: 'GET'
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let data = req.responseObject.data || [];
      this.setData({
        jobs: data
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  countdown() {
    this.getTask();
  },
  onReady() {

  },
  onShow () {
    this.getTask();
  },
  onShareAppMessage(e) {
    let data = e.target.dataset;
    return ({
      title: data.remark,
      path: `/pages/my/task/task-share/task-share?inviteId=${Storage.getterFor('userAccountInfo').id}&jobId=${data.id}`,
      imageUrl: 'https://mr-uat-sg.oss-cn-hangzhou.aliyuncs.com/xcx/fexian_img@3x.png'
    });
  }
})