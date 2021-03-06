let { Tool, RequestFactory, Storage, Event, Operation, Config } = global
Component({
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },

  data: {
    imgUrl: Config.imgBaseUrl,
    showCard: false,    
    countdownTime: '00:00:00:00',
    showDetail: false,
    delay: 1000,
    cardType: 'loading',
    cardData: {},
    startTime: ''
  },
  methods: {
    toggleShowDetail() {
      this.setData({
        showDetail: !this.data.showDetail
      })
    },
    countdown() {
      let time = this.data.item.countDown;
      let delay = this.data.delay;
      if (typeof time !== 'number' || time <= 0 || !time) {
        return time;
      }
      time -= delay;
      if (time <= delay) {
        this.setData({
          countdownTime: '00:00:00:00'
        });
        this.triggerEvent('countdown', true);
        return;
      } else {
        this.setData({
          countdownTime: this.formatTime(time),
          "item.countDown": time
        })
      }
      setTimeout(()=> {
        this.countdown();
      },this.data.delay);
    },
    formatTime(c) {
      let d = parseInt(c / 1000 / 60 / 60 / 24);
      let h = parseInt(c / 1000 / 60 / 60) - (24 * d);
      let m = parseInt(c / 1000 / 60 - (24 * 60 * d) - (60 * h));
      let s = parseInt(c / 1000 - (24 * 60 * 60 * d) - (60 * 60 * h) - (60 * m)); //
      // let ms = Math.floor((c - (24 * 60 * 60 * 1000 * d) - (60 * 60 * 1000 * h) - (60 * 1000 * m) - (s * 1000)) / 10);
      return ([h + d * 24, m, s]).map(Tool.formatNumber).join(':');
    },
    close() {
      this.toggleCardShow();
    },
    toggleCardShow() {
      this.setData({
        showCard: !this.data.showCard
      })
    },
    // 开启奖励
    openAward(e) {
      let dataset = e.currentTarget.dataset;
      let params = {
        url: Operation.receiveJobMoney,
        id: dataset.id,
        requestMethod: 'GET'
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let data = req.responseObject.data || {};
        console.log(data);
        this.setData({
          cardType: 'success',
          cardData: data
        });
        this.toggleCardShow();
      };
      Tool.showErrMsg(r)
      r.addToQueue();
      
    },
    toDetail(e) {
      let data = e.currentTarget.dataset;
      Tool.navigateTo(`/pages/my/task/task-detail/task-detail?jobId=${data.jobid}&status=${data.status}&id=${data.id}`)
    },
  },
  onShareAppMessage() {
    let data = e.target.dataset;
    return ({
      title: data.remark,
      path: `/pages/my/task/task-share/task-share?inviteId=${Storage.getterFor('userAccountInfo').id || ''}&jobId=${data.id}&status=${data.status}`,
      imageUrl: 'https://mr-uat-sg.oss-cn-hangzhou.aliyuncs.com/xcx/fexian_img@3x.png'
    });
  },
  ready() {
    this.countdown();
    this.setData({
      startTime: Tool.formatTime(this.data.item.createTime).split(' ')[0] || ''
    })
  }
})
