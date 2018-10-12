let { Tool, RequestFactory, Storage, Event, Operation } = global;
Page({
    data: {
      nickname:''
    },
    onLoad: function (options) {
      this.setData({
        nickname: options.nickname
      })
    },
    inputChange(e){
      this.setData({
        nickname: e.detail.value
      })
    },
    updateDealerNickname() {
      if (Tool.isEmptyStr(this.data.nickname)){
        Tool.showAlert('请输入昵称')
        return
      }
      if (this.data.nickname.length>16){
        Tool.showAlert('昵称不能多于16个字')
        return
      }
      if (this.data.nickname.length < 4) {
        Tool.showAlert('昵称不能少4个字')
        return
      }
      let params = {
        nickname: this.data.nickname,
        reqName: '修改用户信息',
        'type': 2,
        url: Operation.updateUserById
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let infos = Storage.getUserAccountInfo()
        infos.nickname = this.data.nickname
        Storage.setUserAccountInfo(infos)
        Event.emit('refreshMemberInfoNotice');//发出通知
        Tool.navigationPop()
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    }
})