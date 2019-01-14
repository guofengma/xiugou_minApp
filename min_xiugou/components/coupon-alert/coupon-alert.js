Component({
  properties: {
    visiable: Boolean,
    imgSrc:String,
  },
  data: {

  },
  methods: {
    close(){
      this.triggerEvent('isShowCoupon')
    }
  }
})
