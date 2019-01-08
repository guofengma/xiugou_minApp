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
    switch (this.operatorDetail.type){

        case 1:
            this.operatorDetail.typeName ='满减劵';
            break;
        case 2:
            this.operatorDetail.typeName ='抵价劵';
            break;
        case 3:
            this.operatorDetail.typeName ='折扣劵';
            break;
        case 4:
            this.operatorDetail.typeName ='抵扣劵'
            break;
    }
    // this.setData({
    //   coupon: this.data.operatorDetail.coupon.coupon
    // });
  }
});
