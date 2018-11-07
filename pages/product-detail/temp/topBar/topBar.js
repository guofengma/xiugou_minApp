import ProductFac from '../product.js'
Component({
  properties: {
    imgUrl:String,
    msgShow:Boolean,
    floorstatus: Boolean,
  },
  data: {

  },
  methods: {
    msgClicked() {
      this.setData({
        msgShow: !this.data.msgShow
      })
    },
    msgTipsClicked(e) { // 轮播右上角分享点击事件
      ProductFac.msgTipsClicked(e)
    },
  }
})
