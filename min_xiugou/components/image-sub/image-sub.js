let { Tool, RequestFactory, Storage, Event, Operation, Config } = global
Component({
  properties: {
    imgSrc:String,
    mode:String,
    imgStyle:String,
    className:String
  },
  data: {
    baseImgUrl:''
  },
  methods: {
    getBaseUrl(){
      let baseImgUrl = ''
      if(this.data.imgSrc.includes('http')){ // 后台图片
        baseImgUrl = this.data.imgSrc + Config.imgSizeParams.m_fill
      } else if (this.data.imgSrc.includes('/img/')){ // 本地图片
        baseImgUrl = this.data.imgSrc
      }else {
        // 小程序线上图片（icon等）
        baseImgUrl = Config.imgBaseUrl + this.data.imgSrc + '?_=' + new Date().getTime()
      }
      this.setData({
        baseImgUrl: baseImgUrl
      })
    }
  },
  ready: function () {
    this.getBaseUrl()
  }
})
