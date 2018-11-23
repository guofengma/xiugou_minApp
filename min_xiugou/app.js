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
    onLaunch: function (o) {
      console.log(o)
      //设置全局变量
      global.Storage = Storage;
      global.Tool = Tool;
      global.Event = Event;
      global.RequestFactory = RequestFactory;
      global.Operation = Operation
      global.Config = config
      this.getSystemInfo();
      if (!Storage.getPlatform()){
        let uuid = Tool.getUUID()
        Storage.setPlatform(uuid)
      }
      this.wxLogin()
      let systemInfo = wx.getSystemInfoSync()
      this.deleteInviteId()
    },
    onShow: function () {
      // 比如记录小程序启动时长
      // let pages = getCurrentPages()
      // let currentPage = pages[pages.length - 1]
      // console.log(pages)
    },
    globalData: {
        userInfo: null,
        openid: null,
        code: null,
    },
    deleteInviteId(){
      let upUserId = Storage.getUpUserId() || {}
      if (upUserId.date != new Date().toLocaleDateString()) {
        Storage.setUpUserId({
          date: null,
          id: null
        })
      }
    },
    wxLogin(callBack=()=>{}){
      // 小程序登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          let code = res.code
          if (code) {
            this.globalData.code = code;
            this.toLogin(callBack)
          }
        }
      })
    },
    toLogin(callBack = () => { }) {
      if (!this.globalData.code) return
      let params = {
        wechatCode: this.globalData.code,
        reqName:'获取openid和是否注册',
        url: Operation.verifyWechat,
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        Tool.loginOpt(req)
        let datas = req.responseObject.data
        this.globalData.openid = datas.openid
        Storage.setWxOpenid(datas.openid)
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
        if (res.model.search('iPhone') != -1 && res.windowWidth >= 375 && res.screenHeight >= 812 || res.model.search('iPhone X') != -1) {
          res.isIphoneX = true
        } else {
          res.isIphoneX = false
        }
        res.rate = 750 * res.windowWidth
        Storage.setSysInfo(res);
        that.globalData.systemInfo = res
        typeof cb == "function" && cb(that.globalData.systemInfo)
      }
      catch (e) {

      }
    },
    getLevel(callBack=()=>{}) {
      let params = {
        isShowLoading: false,
        reqName: '获取用户等级',
        requestMethod: 'GET',
        url: Operation.getLevel
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let datas = req.responseObject.data
        Storage.setUserAccountInfo(datas)
        callBack(datas)
      };
      r.addToQueue();
    },
    queryPushMsg(callBack = () => { }) {
      let params = {
        reqName: '消息未读详情',
        isShowLoading: false,
        url: Operation.queryPushNum,
        requestMethod: 'GET'
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let detail = req.responseObject.data;
        detail.totalMessageNum = detail.messageCount + detail.noticeCount + detail.shopMessageCount
        detail.hasMsg = detail.totalMessageNum>0? true:false
        callBack(detail)
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    }
})