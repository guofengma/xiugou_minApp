let { Tool } = global
Component({
  properties: {
    count: Number,
    countSize: Number,
    index: Number,
    disabled: {
      type: Boolean,
      value:false
    },
  },
  data: {
    innerCount:0,
    canClicked:true
  },
  methods: {
    subClicked: function (e) {
      if (this.data.disabled) return
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
      if (this.data.disabled) return
      // if (!this.canClicked()) return
      // 手动填写数字
      let innerCount = e.detail.value
      
      if (!innerCount || innerCount == 0) {
        return
      }
      if (innerCount > 200) {
        innerCount =200
      }
      this.setData({
        innerCount: parseInt(innerCount)
      })
      this.trigger(e);
    },
    addClicked: function (e) {
      if (this.data.disabled) return
      // 加
      let innerCount = this.data.count
      if (this.data.count>=200){
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
      if (this.data.disabled) return
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
    // this.canClicked()
  }
})
