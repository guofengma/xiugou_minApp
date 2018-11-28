Component({
  properties: {
    visiable: Boolean,
  },
  data: {

  },
  methods: {
    close(){
      this.triggerEvent('isShowCoupon')
    }
  }
})
