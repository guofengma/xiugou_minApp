let { Tool } = global
Component({
  properties: {
    count: Number,
    countSize: Number,
    index: Number,
    commodityType: Number, // 1 普通商品 2 秒杀 3 降价拍 4礼包
  },
  data: {
    innerCount:0,
    canClicked:true
  },
  methods: {
    canClicked(){ // 是否可以点击
      if (this.data.commodityType == 3 || this.data.commodityType ==2){
        this.setData({
          canClicked:false
        })
        return false
      }
      this.setData({
        canClicked: true
      })
      return true
    },
    subClicked: function (e) {
      if (!this.canClicked()) return
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
      if (!this.canClicked()) return
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
      if (!this.canClicked()) return
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
      if (!this.canClicked()) return
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
    this.canClicked()
  }
})
