// components/alert/alert.js
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
    //   show:false,//显示属性
    // coupon: ""
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
  attached(){
    
  },
  ready() {
    Tool.isIPhoneX(this);
    // ready里面setData异步原因 在安卓不同步 通过设置延迟处理
    setTimeout(() => {
        switch (this.data.coupon.type) {
          case 1:
            this.setData({
              typeName: "满减"
            });
            break;
          case 2:
            this.setData({
              typeName: "抵价"
            });
            // typeName = "抵价";
            break;
          case 3:
            this.setData({
              typeName: "折扣"
            });
            // typeName = "折扣";
            break;
          case 4:
            this.setData({
              typeName: "抵扣"
            });
            // typeName = "抵扣";
            break;
          default:
            break;
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
