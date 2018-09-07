let { Tool } = global
Component({
  properties: {
    count: Number,
    countSize: Number,
    index: Number,
  },
  data: {
    innerCount:0
  },
  methods: {
    subClicked: function (e) {
      // 减
      let count = this.data.count - 1;
      if (count < 1 || count == undefined) {
        count = 1;
      }
      this.setData({
        innerCount: count,
      })
      this.trigger(e);
    },
    inputOnChange: function (e) {
      // 手动填写数字
      let innerCount = e.detail.value
      
      if (!innerCount || innerCount == 0) {
        return
      }
      if (innerCount > 200) {
        Tool.showAlert('最多只能购买200件')
        innerCount =200
      }
      this.setData({
        innerCount: parseInt(innerCount)
      })
      this.trigger(e);
    },
    addClicked: function (e) {
      // 加
      let innerCount = this.data.count
      if (this.data.count>=200){
        Tool.showAlert('最多只能购买200件')
        innerCount = 200
      } else {
        innerCount+=1
      }
      
      this.setData({
        innerCount: innerCount
      })
      this.trigger(e);
    },
    trigger(e){
      this.triggerEvent('countChange', { ...this.data, e });
    },
    inputOnblur(e){
      let innerCount = e.detail.value
      if (!innerCount || innerCount == 0) {
        this.setData({
          innerCount: 1
        })
        this.trigger(e);
      } 
    }
  },

  ready: function () {

  }
})
