// components/alert/alert.js
let { Tool, RequestFactory, Operation } = global
Component({
  properties: {
    show: Boolean,
    paramList: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false //显示属性
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changgeState(e) {
      this.setData({
        show: false
      });
    }
  },
  ready: function () {
    Tool.isIPhoneX(this)
    console.log(this.data.isIPhoneX)
  }
});
