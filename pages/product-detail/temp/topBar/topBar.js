import ProductFactorys from '../product.js'
Component({
  properties: {
    imgUrl:String,
    msgShow:Boolean,
    floorstatus: Boolean,
    didLogin: Boolean,
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
      new ProductFactorys().msgTipsClicked(e,this.data.didLogin)
    },
  }
})
