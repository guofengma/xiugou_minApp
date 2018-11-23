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
      if(this.data.imgSrc.includes('http')){
        baseImgUrl = this.data.imgSrc + Config.imgSizeParams.m_fill
      } else {
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
