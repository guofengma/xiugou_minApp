// components/alert/alert.js
Component({
  properties: {
    show:Boolean,
    props:Object,
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    btnClicked(e){
      let index = e.currentTarget.dataset.index
      this.triggerEvent('subClicked', {index});
    }
  }
})
