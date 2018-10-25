import {
  Storage,
  Tool,
  Event,
  RequestFactory,
  Operation
} from './tools/tcglobal';

const ald = require('./libs/ald-stat/ald-stat.js')

import config from './config.js'

App({
    onLaunch: function () {
      //设置全局变量
      global.Storage = Storage;
      global.Tool = Tool;
      global.Event = Event;
      global.RequestFactory = RequestFactory;
      global.Operation = Operation
      global.Config = config
      this.getSystemInfo();
      console.log(Storage.getPlatform())
      // this.wxLogin()
      if (!Storage.getPlatform()){
        console.log(11111)
        let uuid = Tool.getUUID()
        Storage.setPlatform(uuid)
      }
    },
    onShow: function () {
      // 比如记录小程序启动时长
    },
    globalData: {
        userInfo: null,
        openid: null,
        code: null,
        flag: false,//退出登录使用参数
        isGoLogin:true
    },
    wxLogin(callBack=()=>{}){
      // 小程序登录
      // this.globalData.isGoLogin = isGoLogin
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          let code = res.code
          if (code) {
            this.globalData.code = code;
            this.toLogin(this.globalData.code, callBack)
          }
        }
      })
    },
    toLogin(code, callBack = () => { }) {
      if (!code) return
      let params = {
        wechatCode: code,
        reqName:'获取openid和是否注册',
        url: Operation.verifyWechat,
        hasCookie:false
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        Tool.loginOpt(req)
        let datas = req.responseObject.data
        Storage.setWxOpenid(datas.openid)
        // if (!datas.id && this.globalData.isGoLogin){
        //   Tool.navigateTo('/pages/login-wx/login-wx')
        // }
        callBack()
      }
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    /**
     * 调用微信接口，获取设备信息接口
     */
    getSystemInfo: function (cb) {
        let that = this
        try {
          //调用微信接口，获取设备信息接口
          let res = wx.getSystemInfoSync()
          if (res.model.search('iPhone X') != -1) {
            res.isIphoneX = true
          } else {
            res.isIphoneX = false
          }
          res.screenHeight = res.screenHeight * res.pixelRatio;
          res.screenWidth = res.screenWidth * res.pixelRatio;
          res.windowHeight = res.windowHeight * res.pixelRatio;
          res.windowWidth = res.windowWidth * res.pixelRatio;
          let rate = 750.0 / res.screenWidth;
          res.rate = rate;
          res.screenHeight = res.screenHeight * res.rate;
          res.screenWidth = res.screenWidth * res.rate;
          res.windowHeight = res.windowHeight * res.rate;
          res.windowWidth = res.windowWidth * res.rate;
          Storage.setSysInfo(res);
          // that.toLogin(that.globalData.code)
          that.globalData.systemInfo = res
          typeof cb == "function" && cb(that.globalData.systemInfo)
        }
        catch (e) {

        }
    }
})