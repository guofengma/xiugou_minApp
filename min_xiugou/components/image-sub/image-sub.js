let { Tool, RequestFactory, Storage, Event, Operation, Config } = global
Component({
  properties: {
    imgSrc:String,
    mode:String,
    imgStyle:String,
    className:String
  },
  data: {
    baseImgUrl:'',
    isIcon:true,
  },
  methods: {
    getBaseUrl(){
      let baseImgUrl = ''
      if(this.data.imgSrc.includes('http')){ // 后台图片
        baseImgUrl = this.data.imgSrc + Config.imgSizeParams.m_fill
        this.setData({
          imgStyle: this.data.imgStyle + ";background:  #efefef",
          isHttpImg:true
        })
      } else if (this.data.imgSrc.includes('/img/')){ // 本地图片
        baseImgUrl = this.data.imgSrc
      }else {
        
        // 小程序线上图片（icon等）  + '?_=' + new Date().getTime()
        baseImgUrl = Config.imgBaseUrl + this.data.imgSrc
      }
      this.setData({
        baseImgUrl:baseImgUrl
      })
    },
    binderror(e){
      // this.setData({
      //   imgStyle: this.data.imgStyle +";background: #efefef"
      // })
    },
    bindload(e){
      this.setData({
        imgStyle: this.data.imgStyle + ";background: transparent"
      })
    }
  },
  ready: function () {
    this.getBaseUrl()
  }
})
