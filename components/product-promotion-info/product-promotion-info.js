let { Tool } = global;
// status 0.删除 1.未开始 2.进行中 3.已售完 4.时间结束 5.手动结束
Component({
  properties: {
    time: {
      type: Number,
      value: new Date().getTime() + 3000
    },
    status: {
      type: Number,
      value: 2 
    }
  },
  data: {
    countdownTime: '00:00:00:00',
    interval: null
  },
  methods: {
      countdown() {
        let time = this.data.time;
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
            countdownTime: this.formatTime(diff).join(':')
          })
        }
      },
      formatTime(c) {
        let d = parseInt(c / 1000 / 60 / 60 / 24); //总毫秒除以一天的毫秒 得到相差的天数  
        let h = parseInt(c / 1000 / 60 / 60 - (24 * d)); //然后取完天数之后的余下的毫秒数再除以每小时的毫秒数得到小时 
        let m = parseInt(c / 1000 / 60 - (24 * 60 * d) - (60 * h)); //减去天数和小时数的毫秒数剩下的毫秒，再除以每分钟的毫秒数，得到分钟数 
        let s = parseInt(c / 1000 - (24 * 60 * 60 * d) - (60 * 60 * h) - (60 * m)); //得到最后剩下的毫秒数除以1000 就是秒数，再剩下的毫秒自动忽略即可
        let ms = Math.floor((c - (24 * 60 * 60 * 1000 * d) - (60 * 60 * 1000 * h) - (60 * 1000 * m) - (s * 1000)) / 10);
        return ([h, m, s, ms]).map(function (n) {
          n = n.toString();
          return n[1] ? n : '0' + n;
        });
      }
  },
  ready() {
    // 根据status判断是否需要倒计时
    if([1,2,3].includes(this.data.status)){
      this.data.interval = setInterval( () => {
        this.countdown(this.data.time);
      },90)
    }
  }
})
