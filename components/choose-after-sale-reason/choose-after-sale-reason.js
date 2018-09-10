// components/choose-after-sale-reason/choose-after-sale-reason.js
Component({
  properties: {
    hidden:Boolean,
    reason:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeIndex:'',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeClicked() {hidden
      let hidden = !this.properties.hidden
      this.triggerEvent('makeSureReason', { activeIndex: this.data.activeIndex, hidden});
    },
    reasonClicked(e) {
      let index = e.currentTarget.dataset.index
      this.setData({
        activeIndex: index
      })
    },
    makeSure(e) {
      if (this.data.activeIndex === '') {
        Tool.showAlert('请选择换货理由')
        return
      }
      this.closeClicked()
    },
  }
})
