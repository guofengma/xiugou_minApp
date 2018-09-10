// pages/my/account.js
let { Tool, RequestFactory, Event, Storage, Operation } = global;
Page({
    data: {
      userInfos: '',
      region:''
    },
    nickname(){
      Tool.navigateTo('/pages/my/nickname/nickname')
     
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
        isRealName = '未实名制'
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
        provinceId: this.data.region[0].zipcode,
        cityId: this.data.region[1] ? this.data.region[1].zipcode : '',
        areaId: this.data.region[2] ? this.data.region[2].zipcode : '',
        reqName: '修改所在区域',
        url: Operation.updateDealerRegion
      }
      let r = RequestFactory.wxRequest(params);
      // let r = RequestFactory.updateDealerRegion(params);
      r.finishBlock = (req) => {
        Storage.setUserAccountInfo(req.responseObject.data)
        Event.emit('refreshMemberInfoNotice');//发出通知
        //Tool.navigationPop()
      };
      r.addToQueue();
    },
    modifyImageTap: function () {
      let callBack = (fileInfo) => {
        let temporaryId = fileInfo.data.imageUrl;//临时Id
        let params = {
          headImg: temporaryId,
          reqName: '修改用户头像',
          url: Operation.updateDealerHeadImg
        }
        let r = RequestFactory.wxRequest(params);
        // let r = RequestFactory.updateDealerHeadImg(params);
        r.finishBlock = (req) => {
          Storage.setUserAccountInfo(req.responseObject.data)
          Event.emit('refreshMemberInfoNotice');
        };
        Tool.showErrMsg(r)
        r.addToQueue();
      }
      Tool.uploadImage(1, callBack)
    },
    realName(){
      // if (!this.data.userInfos.isRealname){
      //   Tool.redirectTo('/pages/real-name/real-name')
      // }
    }
})