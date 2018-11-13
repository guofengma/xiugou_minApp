let { Tool, RequestFactory, Storage, Event, Operation, Config } = global
Component({
  properties: {
    imgSrc:String,
    mode:String,
    imgStyle:String,
  },
  data: {
    baseImgUrl:''
  },
  methods: {
    getBaseUrl(){
      this.setData({
        baseImgUrl: Config.imgBaseUrl + this.data.imgSrc+'?_='+new Date().getTime()
      })
    }
  },
  ready: function () {
    this.getBaseUrl()
  }
})
