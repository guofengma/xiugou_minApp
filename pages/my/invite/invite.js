// pages/my/account.js
let { Tool, RequestFactory, Event, Operation} = global;
Page({
    data: {
      expanded:[false,false],
      token:'',
    },
    onLoad: function (options) {
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
      let title = '参加活动，免费领取福利';
      let desc = "您的好友" + this.data.userInfos.nickname+"邀请您加入";
      return {
        title: title,
        desc: desc,
        path: '/pages/register/register'
      }
    },
    onUnload: function () {
      Event.off('refreshMemberInfoNotice', this.refreshMemberInfoNotice);
    }
})