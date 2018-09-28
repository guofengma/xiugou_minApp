let { Tool } = global;
// status 0.删除 1.未开始 2.进行中 3.已售完 4.时间结束 5.手动结束
Component({
  properties: {
    prop: {
      type: Object,
      value: {}
    },
    promotionDesc:{
      type: Object,
      value: ''
    },
  },
  data: {
    countdownTime: '00:00:00:00',
    interval: null,
    endTime: 0,
  },
  methods: {
    // 倒计时 到毫秒
    countdown() {
      let time = this.data.endTime;
      if (typeof time !== 'number' || time <= 0) {
        return time;
      }
      let now = new Date().getTime();
      let diff = time - now;
      if( diff <= 90) {
        clearInterval(this.data.interval)
        this.setData({
          countdownTime: '00:00:00:00'
        });
        this.triggerEvent('countdown',true);
        return;
      } else {
        this.setData({
          endTime: this.data.endTime - 90,
          countdownTime: this.formatTime(diff).join(':')
        })
      }
    },
    formatTime(c) {
      let d = parseInt(c / 1000 / 60 / 60 / 24); 
      let h = parseInt(c / 1000 / 60 / 60 - (24 * d)); 
      let m = parseInt(c / 1000 / 60 - (24 * 60 * d) - (60 * h));
      let s = parseInt(c / 1000 - (24 * 60 * 60 * d) - (60 * 60 * h) - (60 * m)); //
      let ms = Math.floor((c - (24 * 60 * 60 * 1000 * d) - (60 * 60 * 1000 * h) - (60 * 1000 * m) - (s * 1000)) / 10);
      return ([h, m, s, ms]).map(Tool.formatNumber);
    },
    
  },
  ready() {
    let prop = this.data.prop;
    this.setData({
      endTime: prop.endTime
    });

    if([1,2,3].includes(prop.status)){
      this.data.interval = setInterval( () => {
        this.countdown(this.data.endTime);
      },90)
    }
  }
})
