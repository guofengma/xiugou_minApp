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
        
    },
    onShow: function () {
      
    },
    globalData: {

    },
    wxLogin(){
      // 小程序登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          let code = res.code
          if (code) {
            this.globalData.code = code;
            this.getSystemInfo();
          }
        }
      })
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
            // Storage.setSysInfo(res);
            // that.getUserInfos(that.globalData.code)
            that.globalData.systemInfo = res
            typeof cb == "function" && cb(that.globalData.systemInfo)
        }
        catch (e) {

        }
    }
})