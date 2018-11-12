// pages/my/account.js
let { Tool, RequestFactory } = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {},
    //跳到我的订单页面
    allOrder(e) {
        let index=e.currentTarget.dataset.index;
        Tool.navigateTo('my-order/my-order?index='+index)
    },
    //跳到我的账户页面
    myAccount() {
        Tool.navigateTo('my-account/my-account')
    },
    myCollection(){
      Tool.navigateTo('/pages/my/my-collection/my-collection')
    },
    //跳到我的信息页面
    personalData(){
        Tool.navigateTo('my-personalData/my-personalData')
    },
    //跳到设置页面
    setting(){
        Tool.navigateTo('setting/setting')
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})