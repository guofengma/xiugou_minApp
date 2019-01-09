const app = getApp()

let { Tool, Config, Storage, Event} = global

Page({
  data: {
    baseImgUrl: '',
    url:"",
    arr:{
      1:'/static/protocol/extensionExplain.html',// 推广协议
      2:'/static/protocol/service.html',// 用户协议
      3:'/download',//下载页面
      4:'/static/protocol/signInRule.html', //签到协议
      5:'/topic/first', // h5专题
      6:'/static/protocol/about-us.html', //关于我们
    }
  },
  onLoad: function (options) {
    let miniparams = {
      'device': Storage.getPlatform() || '', // 设备唯一标识
      'platform': 'mini', // 小程序标识
      'token': Storage.getToken() || '', // 用户token
      'userid': Storage.getUserAccountInfo().id || '', // 用户ID
    }
    this.data.baseImgUrl = Config.h5webUrl
    if (options.webUrl){ // 指定的url地址
      this.setData({
        url: this.data.baseImgUrl+ options.webUrl + '?time=' + new Date().getTime()
      })
    }
    if (options.webType){ // 约定的arr中的地址
      let url = `${this.data.baseImgUrl}${this.data.arr[options.webType]}?device=${miniparams.device}&sg-token=${miniparams.token}&userCode=${miniparams.userid}&platform=${miniparams.platform}&time=${new Date().getTime()}`
      // let url = this.data.webUrl + this.data.arr[options.webType] + '?time=' + new Date().getTime()
      this.setData({
        url: url
      })
    }else{
      let callBack = () => {
        let url = this.data.baseImgUrl + '/promote?id=' + options.id + '&openid=' + Storage.getWxOpenid()
        this.setData({
          url: url + '?_=' + new Date().getTime()
        })
      }
      if (!app.globalData.systemInfo) {
        app.getSystemInfo()
      }
      app.wxLogin(callBack)
    }
  }
})