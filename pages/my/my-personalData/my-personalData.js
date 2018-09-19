// pages/my/account.js
let { Tool, RequestFactory, Event, Storage, Operation } = global;
Page({
    data: {
      userInfos: '',
      region:''
    },
    nickname(){
      Tool.navigateTo('/pages/my/nickname/nickname?nickname=' + this.data.userInfos.nickname)
    },
    onLoad: function (options) {
      Event.on('refreshMemberInfoNotice', this.refreshMemberInfoNotice, this);
      this.refreshMemberInfoNotice()
    },
    refreshMemberInfoNotice(){
      Tool.getUserInfos(this)
      let userInfos = this.data.userInfos
      let isRealName = ''
      if (userInfos.realnameStatus==0){
        isRealName = '待审核'
      } else if (userInfos.realnameStatus == 1){
        isRealName = '已实名制'
      } else {
        isRealName = '请下载app进行实名制'
      }
      userInfos.isRealName = isRealName
      this.setData({
        userInfos: userInfos
      })
    },
    pickerClicked(e) {
      this.setData({
        region: e.detail.result
      })
      if (e.detail.btnType == 2){
        this.updateDealerRegion(e)
      } 
    },
    updateDealerRegion(e){
      let params = {
        provinceId: this.data.region[0].code,
        cityId: this.data.region[1] ? this.data.region[1].code : '',
        areaId: this.data.region[2] ? this.data.region[2].code : '',
        'type': 3
      }
      let callBack = (infos) => {
        infos.showRegion = this.data.region[0].name + this.data.region[1].name+this.data.region[2].name
      }
      this.updateUserInfo(params, callBack)
    },
    modifyImageTap: function () {
      let callBack = (fileInfo) => {
        let temporaryId = fileInfo.data;//临时Id
        let params = {
          headImg: temporaryId,
          'type':1
        }
        let callBack = (infos)=>{
          infos.headImg = temporaryId
        }
        this.updateUserInfo(params, callBack)
      }
      Tool.uploadImage(1, callBack)
    },
    updateUserInfo(params, callBack){
      params = {
        ...params,
        reqName: '修改用户信息',
        url: Operation.updateUserById
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let infos = Storage.getUserAccountInfo()
        callBack(infos)
        Storage.setUserAccountInfo(infos)
        Event.emit('refreshMemberInfoNotice');
        this.setData({
          userInfos: infos
        })
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    onUnload: function () {
      Event.off('refreshMemberInfoNotice', this.refreshMemberInfoNotice);
    }
})