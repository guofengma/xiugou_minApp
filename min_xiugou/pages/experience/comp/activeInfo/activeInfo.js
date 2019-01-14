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
    typeName: "",
    valueType: "",
    contents: ""
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
      // 处理文案里面对换行
      this.setData({
        contents: Tool.htmlEscape(this.data.operatorDetail.contents)
      });
      if (this.data.coupon) {
        const { name, type, useConditions } = this.data.coupon || {};
        switch (type) {
          case 1:
            this.setData({
              typeName: "满减劵",
              valueType:
                useConditions > 0
                  ? `满${useConditions || ""}可用`
                  : "无金额门槛"
            });
            break;
          case 2:
            this.setData({
              typeName: "抵价劵",
              valueType: "无金额门槛"
            });
            break;
          case 3:
            this.setData({
              typeName: "折扣劵",
              valueType:
                useConditions > 0
                  ? `满${useConditions || ""}可用`
                  : "无金额门槛"
            });
            break;
          case 4:
            this.setData({
              typeName: "抵扣劵",
              valueType: "限制定商品可用"
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
