let { Tool } = global;
Component({
  properties: {
    date: {
      type: Number,
      default: 0
    }
  },

  data: {
    showCard: false,    
    countdownTime: '00:00:00:00',
    showDetail: false,
    delay: 90,
    cardType: 'loading'
  },
  methods: {
    toggleShowDetail() {
      this.setData({
        showDetail: !this.data.showDetail
      })
    },
    countdown() {
      let time = this.data.date;
      let delay = this.data.delay;
      if (typeof time !== 'number' || time <= 0 || !time) {
        return time;
      }
      time -= delay;
      if (time <= delay) {
        this.setData({
          countdownTime: '00:00:00:00'
        });
        // this.triggerEvent('countdown', true);
        return;
      } else {
        this.setData({
          countdownTime: this.formatTime(time),
          date: time
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
    }
  },
  ready() {
    this.countdown();
  }
})
