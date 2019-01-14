let {Tool, API, Storage, Event, Config} = global
Page({
    data: {
        jobs: []
    },
    onLoad(options) {
    },
    getTask() {
        API.queryJobsByUserId({}).then((res) => {
            let data = res.data || {};
            this.setData({
                jobs: data
            })
        }).catch((res) => {
            console.log(res)
        })
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
            imageUrl: `${Config.imgBaseUrl}fexian_img@3x.png`
        });
    }
})