import {
    Storage,
    Tool,
    Event,
    API
} from './tools/tcglobal';

// const ald = require('./libs/ald-stat/ald-stat.js')

import config from './config.js'

const sensors = require('./libs/sensorsdata/sensorsdata.min.js');
if(config.sensorsUrl) sensors.init()


App({
    onLaunch: function (o) {
        if (!Storage.getPlatform()) {
            let uuid = Tool.getUUID()
            Storage.setPlatform(uuid)
        }
        //设置全局变量
        global.Storage = Storage;
        global.Tool = Tool;
        global.Event = Event;
        global.Config = config
        global.API = API
        this.getSystemInfo();
        this.wxLogin()
        let systemInfo = wx.getSystemInfoSync()
        this.deleteInviteId()
    },
    onShow: function () {

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
    wxLogin(callBack = ()=> {
    }){
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
    shareClick(userId) {
        if (userId !== 'null' && userId !== 'undefined' && userId) {
            API.shareClick({userId: userId}).then(res => {
            });
        }
    },
    toLogin(callBack = () => {
    }) {
        if (!this.globalData.code) return
        API.verifyWechat({
            wechatCode: this.globalData.code
        }).then((res) => {
            Tool.loginOpt(res)
            let datas = res.data || {}
            this.globalData.openid = datas.openid
            datas.openid && sensors.setOpenid(datas.openid)
            Storage.setWxOpenid(datas.openid)
            callBack()
        }).catch((res) => {
            console.log(res)
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
    getLevel(callBack = () => {
    }) { // 获取用户等级
        API.getLevel({}).then((res) => {
            let datas = res.data || {}
            datas.availableBalance0 = Tool.formatNum(datas.availableBalance || 0)
            datas.blockedBalance0 = Tool.formatNum(datas.blockedBalance || 0)
            let levelName = datas.levelName || ''
            datas.levelName0 = levelName.length > 4 ? levelName.slice(0, 4) + '...' : levelName
            Storage.setUserAccountInfo(datas)
            callBack(datas)
        }).catch((res) => {
            console.log(res)
        })
    },
    queryPushMsg(callBack = () => {
    }) { // 消息未读详情
        API.noticeMessageCount({}).then((res) => {
            let detail = res.data || {};
            detail.totalMessageNum = detail.messageCount + detail.noticeCount + detail.shopMessageCount
            detail.hasMsg = detail.totalMessageNum > 0 ? true : false
            callBack(detail)
        }).catch((res) => {
            console.log(res)
        })
    }
})