let { Tool, Storage, Event, API } = global;
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
      if (this.data.nickname.length>8){
        Tool.showAlert('昵称不能多于8个字')
        return
      }
      if (this.data.nickname.length < 2) {
        Tool.showAlert('昵称不能少2个字')
        return
      }
      API.updateUserById({
        'type': 2,
        nickname: this.data.nickname,
      }).then((res) => {
        let infos = Storage.getUserAccountInfo()
        infos.nickname = this.data.nickname
        Storage.setUserAccountInfo(infos)
        Event.emit('refreshMemberInfoNotice');//发出通知
        Tool.navigationPop()
      }).catch((res) => {

      })
    }
})