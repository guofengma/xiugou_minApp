let { Tool, RequestFactory, Operation } = global;
Component({
  properties: {
    show: Boolean,
    operatorDetail: Object,
    coupon: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    typeName: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changgeState(e) {
      this.setData({
        show: false
      });
      this.triggerEvent("hiddenTips");
    }
  },
  attached() {},
  ready() {
    Tool.isIPhoneX(this);
    // ready里面setData异步原因 在安卓不同步 通过设置延迟处理
    setTimeout(() => {
      if (this.data.coupon) {
        switch (this.data.coupon.type) {
          case 1:
            this.setData({
              typeName: "满减劵"
            });
            break;
          case 2:
            this.setData({
              typeName: "抵价劵"
            });
            break;
          case 3:
            this.setData({
              typeName: "折扣劵"
            });
            break;
          case 4:
            this.setData({
              typeName: "抵扣劵"
            });
            break;
          default:
            break;
        }
      }
    }, 1000);
    // this.setData({
    //   typeName: typeName
    // });
    // this.setData({
    //   coupon: this.data.operatorcoupon.coupon
    // });
  }
});
