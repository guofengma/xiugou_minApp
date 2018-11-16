import ProductFactorys from '../product.js'
Component({
  properties: {
    imgUrl:String,
    msgShow:Boolean,
    floorstatus: Boolean,
    didLogin: Boolean,
    size:Number,
    openType: String
  },
  data: {

  },
  ready() {
    this.ProductFactory = new ProductFactorys()
  },
  methods: {
    btnClicked() {
      // this.ProductFactory.hiddenTips()
      this.triggerEvent('subClicked', { index: this.data.openType });
    },
    msgClicked() {
      this.setData({
        msgShow: !this.data.msgShow
      })
    },
    goCart() {
      this.ProductFactory.cartClicked()
    },
    msgTipsClicked(e) { // 轮播右上角分享点击事件
      this.ProductFactory.msgTipsClicked(e,this.data.didLogin)
    },
  }
})
