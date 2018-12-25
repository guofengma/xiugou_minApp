/**
 * Created by weiwei on 11/6/18.
 */
import Tool from './tool';

/**
 * 存储类
 */
let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

export default class Storage {

    constructor() {
        if (__instance()) return __instance();

        //init

        __instance(this);
    }

    static sharedInstance() {
        return new Storage();
    }

    static getterFor(key) {
        if (Storage.sharedInstance()['_' + key] === undefined) {
            try {
                let value = wx.getStorageSync(key);
                if (value) {
                    Storage.sharedInstance()['_' + key] = value;
                }
            } catch (e) {
                Storage.sharedInstance()['_' + key] = undefined;
            }
        }
        return Storage.sharedInstance()['_' + key];
    }

    static setterFor(key, value) {
        Storage.sharedInstance()['_' + key] = undefined;
        wx.setStorageSync(key, value);
    }

    /**
     * 微信用户信息
     * @returns {undefined|*|void}
     */
    static wxUserInfo() {
        return this.getterFor('wxUserInfo');
    }

    static setWxUserInfo(wxUserInfo) {
        this.setterFor('wxUserInfo', wxUserInfo);
    }

    static currentMember() {
        return this.getterFor('currentMember');
    }

    static setCurrentMember(currentMember) {
        this.setterFor('currentMember', currentMember);
    }

    //登陆标记
    static didLogin() {
        return this.getterFor('didLogin');
    }

    static setDidLogin(didLogin) {
        this.setterFor('didLogin', didLogin);
    }

    //当前登录用户名
    static loginUserName() {
        return this.getterFor('loginUserName');
    }

    static setLoginUserName(loginUserName) {
        this.setterFor('loginUserName', loginUserName);
    }

    //当前登录用户Id
    static memberId() {
        return this.getterFor('memberId');
    }

    static setMemberId(memberId) {
        this.setterFor('memberId', memberId);
    }

    //系统信息
    static sysInfo() {
        return this.getterFor('sysInfo');
    }

    static setSysInfo(sysInfo) {
        this.setterFor('sysInfo', sysInfo);
    }

    /**
     * 获取历史搜索记录
     */
    static getHistorySearch() {
        return this.getterFor('historySearch');
    }

    /**
     * 设置历史搜索记录
     */
    static setHistorySearch(historyData) {
        this.setterFor('historySearch', historyData);
    }

    /**
     * 清除历史搜索记录
     */
    static clearHistorySearch() {
        this.setterFor('historySearch', null);
    }

    // 获取 openId
    static setWxOpenid(Openid) {
        this.setterFor('openid', Openid)
    }

    static getWxOpenid() {
        return this.getterFor('openid');
    }

    // 用户账号信息

    static setUserAccountInfo(info) {
        this.setterFor('userAccountInfo', info)
    }

    static getUserAccountInfo() {
        return this.getterFor('userAccountInfo');
    }

    // 存cookie

    static setUserCookie(info) {
        this.setterFor('userCookie', info)
    }

    static getUserCookie() {
        return this.getterFor('userCookie');
    }

    // 存购物车 
    static setShoppingCart(info) {
        this.setterFor('userShoppingCart', info)
    }

    static getShoppingCart() {
        return this.getterFor('userShoppingCart');
    }

    static clearShoppingCart() {
        this.setterFor('userShoppingCart', null);
    }

    // 订单确认页面地址

    static setOrderAddress(info) {
        this.setterFor('OrderAddress', info)
    }

    static getOrderAddress() {
        return this.getterFor('OrderAddress');
    }

    // 售后子订单信息

    static setInnerOrderList(info) {
        this.setterFor('innerOrderList', info)
    }

    static getInnerOrderList() {
        return this.getterFor('innerOrderList');
    }

    // 售后信息
    static setAfterSaleList(info) {
        this.setterFor('afterSaleList', info)
    }

    static getAfterSaleList() {
        return this.getterFor('afterSaleList');
    }

    // 保存物流单号
    static setExpressNo(info) {
        this.setterFor('expressNo', info)
    }

    static getExpressNo() {
        return this.getterFor('expressNo');
    }

    // 保存物流公司
    static setExpressCom(info) {
        this.setterFor('expressCom', info)
    }

    static getExpressCom() {
        return this.getterFor('expressCom');
    }

    // 多包裹物流信息
    static setExpressInfo(info) {
        this.setterFor('expressNoInfo', info)
    }

    static getExpressInfo() {
        return this.getterFor('expressNoInfo');
    }

    // 保存优惠券
    static setCoupon(info) {
        this.setterFor('coupon', info)
    }

    static getCoupon() {
        return this.getterFor('coupon');
    }

    // queryStringParams
    static setQueryStringParams(info) {
        this.setterFor('queryStringParams', info)
    }

    static getQueryStringParams() {
        return this.getterFor('queryStringParams');
    }

    static setCoupon(info) {
        this.setterFor('coupon', info)
    }

    static getCoupon() {
        return this.getterFor('coupon');
    }

    // 保存1元券
    static setTokenCoin(info) {
        this.setterFor('tokenCoin', info)
    }

    static getTokenCoin() {
        return this.getterFor('tokenCoin');
    }

    // 订单搜索历史
    static setSearchOrderHistory(info) {
        this.setterFor('searchOrderHistory', info)
    }

    static getSearchOrderHistory() {
        return this.getterFor('searchOrderHistory');
    }

    // 搜索订单的数据
    static setPayOrderList(info) {
        this.setterFor('payOrderList', info)
    }

    static getPayOrderList() {
        return this.getterFor('payOrderList');
    }

    // 提交订单的参数
    static setSubmitOrderList(info) {
        this.setterFor('submitOrderList', info)
    }

    static getSubmitOrderList() {
        return this.getterFor('submitOrderList');
    }

    // getToken()

    static setToken(info) {
        this.setterFor('userToken', info)
    }

    static getToken() {
        return this.getterFor('userToken');
    }

    static setPlatform(info) {
        this.setterFor('platform', info)
    }

    static getPlatform() {
        return this.getterFor('platform');
    }

    // 订单支付信息
    static setPayInfoList(info) {
        this.setterFor('payInfoList', info)
    }

    static getPayInfoList(info) {
        return this.getterFor('payInfoList');
    }

    // 用户上级用户id
    static setUpUserId(info) {
        this.setterFor('upUserId', info)
    }

    static getUpUserId(info) {
        return this.getterFor('upUserId');
    }

    // 点击红包日期存储
    static setRedEnvelopesDate(info) {
        this.setterFor('redEnvelopesDate', info)
    }

    static getRedEnvelopesDate(info) {
        return this.getterFor('redEnvelopesDate');
    }

    // 是否是首次注册
    static setFirstRegistration(info) {
        this.setterFor('FirstRegistration', info)
    }

    static getFirstRegistration(info) {
        return this.getterFor('FirstRegistration');
    }

    // 导师简介
    static setMentorProfile(info) {
        this.setterFor('mentorProfile', info)
    }

    static getMentorProfile(info) {
        return this.getterFor('mentorProfile');
    }
}