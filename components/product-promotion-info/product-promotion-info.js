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
    promotionType: {
      type: String,
      value: ''
    },
    promotionBg: {
      type: String,
      value: 'comming'
    }
  },
  data: {
    countdownTime: '00:00:00:00',
    interval: null,
    endTime: 0,
    delay: 90 //倒计时间隔
  },
  methods: {
    // 倒计时 到毫秒
    countdown() {
      let time = this.data.endTime;
      let delay = this.data.delay;
      if (typeof time !== 'number' || time <= 0 || !time) {
        clearInterval(this.data.interval);
        return time;
      }
      time -= delay;
      if (time <= delay) {
        clearInterval(this.data.interval)
        this.setData({
          countdownTime: '00:00:00:00'
        });
        this.triggerEvent('countdown',true);
        return;
      } else {
        this.setData({
          countdownTime: this.formatTime(time),
          endTime: time
        })
      }
    },
    formatTime(c) {
      let d = parseInt(c / 1000 / 60 / 60 / 24); 
      let h = parseInt(c / 1000 / 60 / 60) - (24 * d);
      let m = parseInt(c / 1000 / 60 - (24 * 60 * d) - (60 * h));
      let s = parseInt(c / 1000 - (24 * 60 * 60 * d) - (60 * 60 * h) - (60 * m)); //
      let ms = Math.floor((c - (24 * 60 * 60 * 1000 * d) - (60 * 60 * 1000 * h) - (60 * 1000 * m) - (s * 1000)) / 10);
      return ([h+d*24, m, s, ms]).map(Tool.formatNumber).join(':');
    },
    checkPromotionInfo() {
      // 获取完数据再展示
      let prop = this.data.prop;
      let commingDesc = this.decorateTime(
        prop.beginTime,
        prop.date || (+new Date()),
        prop.notifyFlag
      )
      let countdownDesc = '距结束';

      if (prop.status === 1){
        console.log(11);
        countdownDesc = '距开抢';
      }
      //降价拍分多个阶段降价 展示文案不同
      if(this.data.promotionType == 2){

        if (prop.status === 2) {
          countdownDesc = '距下次降价'; // 距下次降价
        }
        // 当降价至最低时或已售空则进入最后阶段
        if ( (prop.status == 2 && prop.markdownPrice == prop.floorPrice) || prop.status === 3){
          countdownDesc = '距结束';
        }
      }

      let typeDesc = this.data.promotionDesc.typeDesc;

      if(this.data.promotionType == 1) {
        typeDesc = '秒杀价';
      }
      // 秒杀活动结束或已抢完时，'秒杀价'文案要改成'已抢X件'
      if ([3, 4, 5].includes(prop.status) && this.data.promotionType == 1) {
        typeDesc = `已抢${prop.totalNumber - prop.surplusNumber}件`;
      }
      // ==========
      this.setData({
        "promotionDesc.commingDesc": commingDesc,
        "promotionDesc.countdownDesc": countdownDesc,
        "promotionDesc.typeDesc": typeDesc
      })
    },
    // 未开始 未设置提醒时： X月X日X:00开拍
    // 未开始 已设置提醒时： 明天X点开拍
    decorateTime(beginDate, serverDate, isTip) {
      let str = '';
      let targetDate = new Date(beginDate);
      let targetM = targetDate.getMonth() + 1;
      let targetD = targetDate.getDate();
      let targetH = targetDate.getHours();
      let targetMi = targetDate.getMinutes();
      let diff = beginDate - serverDate;
      let diffHour = Math.floor(diff / 1000 / 60 / 60);
      let timeToTomorrow = 24 - new Date().getHours();

      let strHM = ([targetH, targetMi].map(Tool.formatNumber)).join(':') + '开拍'

      str = [targetM, '月', targetD, '日'].join('') + strHM;
      if (isTip) {
        if (diffHour - timeToTomorrow <= 0) {
          str = '今天' + strHM;
        }
        else if (diffHour - timeToTomorrow > 0 && diffHour - timeToTomorrow < 24) {
          str = '明天' + strHM;
        }
      }
      this.setData({
        "promotionInfo.commingDesc": str
      })
      console.log(str)
      return str;
    },
    init() {
      this.checkPromotionInfo();
      let prop = this.data.prop;
      console.log(prop);
      let t = prop.endTime;
      if (prop.status === 2 && this.data.promotionType == 2) {
        t = prop.activityTime;
        //如果拍卖价等于底价
        if (prop.markdownPrice == prop.floorPrice) {
          t = prop.endTime;
        }
      }
      if (prop.status === 1) {
        t = prop.beginTime;
      }
      let serverTime = prop.date || +new Date();//万一取不到就用当前时间
      this.setData({
        endTime: t - serverTime  //date为服务器时间 用new date()的话存在用户修改手机系统时间的情况
      });
      if ([1, 2, 3].includes(prop.status)) {
        this.data.interval = setInterval(() => {
          this.countdown();
        }, this.data.delay)
      }
    },
    clearInterval() {
      clearInterval(this.data.interval);
    }
  },
  ready() {
    // this.init();
  }
})
