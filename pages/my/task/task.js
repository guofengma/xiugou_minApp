let { Tool, RequestFactory, Storage, Event, Operation } = global
Page({
  data: {
    jobs: []
  },
  onLoad(options) {
    // this.getTask();
  },
  getTask() {
    let params = {
      url: Operation.queryJobsByUserId,
      requestMethod: 'GET'
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let data = req.responseObject.data || [];
      console.log(data);
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
  onHide () {

  },
  onUnload () {

  },
  onShareAppMessage(e) {
    let data = e.target.dataset;
    return ({
      title: data.remark,
      path: `/pages/my/task/task-share/task-share?inviteId=${Storage.getterFor('userAccountInfo').id}&jobId=${data.id}`,
      imageUrl: 'https://dnlcrm.oss-cn-beijing.aliyuncs.com/xcx/task_detail_bg.png'
    });
  }
})