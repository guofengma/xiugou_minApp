let { Tool, RequestFactory, Operation } = global;
Component({
  properties: {
    show: Boolean,
    type: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false, //显示属性
    infoList: [
        /**
        * 下标对应状态（0：删除1：未开始 2：进行中3：已结束）
        */
      "商品已走丢，暂无活动商品~",
      "活动尚未开始，尽情期待~",
      "商品已走丢，暂无活动商品~",//补充活动进行中但暂无商品问题
      "活动已结束,下次再来哦~"
    ], //错误提示
    title: "商品已走丢，暂无活动商品~"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goBack() {
      this.setData({
        show: false
      });
    }
  },
  ready: function() {
    Tool.isIPhoneX(this);
    this.setData({
      title: this.data.infoList[this.data.type]
    });
    console.log(this.data.isIPhoneX);
  }
});
