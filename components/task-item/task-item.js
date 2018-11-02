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
    delay: 90,
    cardType: 'loading',
    cardData: {}
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
      let ms = Math.floor((c - (24 * 60 * 60 * 1000 * d) - (60 * 60 * 1000 * h) - (60 * 1000 * m) - (s * 1000)) / 10);
      return ([h + d * 24, m, s, ms]).map(Tool.formatNumber).join(':');
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
      
    }
  },
  onShareAppMessage() {
    return ({
      title: '',
      path: '/pages/my/task/task-share/task-share?inviteId=' + Storage.userAccountInfo.id || '',
      imageUrl: 'https://dnlcrm.oss-cn-beijing.aliyuncs.com/xcx/task_detail_bg.png'
    });
  },
  ready() {
    this.countdown();
  }
})
