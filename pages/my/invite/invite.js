// pages/my/account.js
let { Tool, RequestFactory, Event, Operation} = global;
Page({
    data: {
      expanded:[false,false],
      token:'',
    },
    onLoad: function (options) {
      Tool.isIPhoneX(this)
      this.refreshMemberInfoNotice()
      Event.on('refreshMemberInfoNotice', this.refreshMemberInfoNotice, this);
    },
    refreshMemberInfoNotice() {
      Tool.getUserInfos(this)
    },
    onShareAppMessage: function (res) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      let userinfo = this.data.userInfos;
      let title = '参加活动，免费领取福利';
      let desc = "您的好友" + userinfo.nickname+"邀请您加入";
      return {
        title: title,
        desc: desc,
        path: '/pages/register/register?inviteCode=' + userinfo.inviteId 
      }
    },
    onUnload: function () {
      Event.off('refreshMemberInfoNotice', this.refreshMemberInfoNotice);
    }
})