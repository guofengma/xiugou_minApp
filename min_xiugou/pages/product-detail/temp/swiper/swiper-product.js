let { Tool, RequestFactory, Storage, Event, Operation } = global
import ProductFactorys from '../product.js'

Component({
  properties: {
    imgUrls:Array,
    msgShow:Boolean,
    didLogin: Boolean,
    size:Number,
    openType:String
  },
  data: {
    activeIndex: 1, // 轮播图片的index 
  },
  ready(){
    this.ProductFactory= new ProductFactorys()
  },
  methods: {
    btnClicked(){
      this.ProductFactory.shareBtnClicked(this.data.openType)
    },
    imageLoad(e) { //图片加载事件
      Tool.getAdaptHeight(e, this)
    },
    goCart(){
      this.ProductFactory.cartClicked()
    },
    swiperImgCliked(e) { //点击放大图片
      let index = e.currentTarget.dataset.index
      let src = this.data.imgUrls[index].smallImg
      let urls = []
      this.data.imgUrls.forEach((item) => {
        if (item.smallImg) {
          urls.push(item.smallImg)
        }
      })
      wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: urls// 需要预览的图片http链接列表
      })
    },
    msgClicked() { // 轮播右上角点击事件
      this.setData({
        msgShow: !this.data.msgShow
      })
    },
    msgTipsClicked(e) { // 轮播右上角分享点击事件
      this.ProductFactory.msgTipsClicked(e, this.data.didLogin)
    },
    sliderChange(e) { // 轮播切换事件
      this.setData({
        activeIndex: e.detail.current + 1,
        autoplay: true
      })
    },
  }
})
