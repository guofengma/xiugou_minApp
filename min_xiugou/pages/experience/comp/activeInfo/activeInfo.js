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
  },

  /**
   * 组件的方法列表
   */
  methods: {
    btnClicked(e) {
      this.data.prodParms = false;
      //   let index = e.currentTarget.dataset.index;
      //   this.triggerEvent("subClicked", { index });
    },
    changgeState(e) {
      this.setData({
        show: false
      });
    },
    subClicked(e) {}
  },
  ready: function() {
    Tool.isIPhoneX(this);
    // this.setData({
    //   coupon: this.data.operatorDetail.coupon.coupon
    // });
  }
});
