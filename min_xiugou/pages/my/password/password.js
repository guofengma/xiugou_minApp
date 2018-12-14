let { Tool, API, Storage} = global

Page({
    data: {
      ysf: { title: '修改密码' },
      reNew:'',
      old:'',
      newPwd:'',
      isFinished:false,
      imgList:{
        closeImg: '/img/hh_03@2x.png',
        unseeImg: '/img/unsee-pwd-icon.png',
        seeImg: '/img/see-pwd-icon.png'
      },
      setList:[{
        password:true,
        isUnsee:true 
      }, {
          password: true,
          isUnsee: true
        }, {
          password: true,
          isUnsee: true
        }],
    },
    onLoad: function (options) {

    },
    changeReNewPwd(e){
      this.setData({
        reNew: e.detail.value
      });
      this.isAllwrite()
    },
    changeOldPwd(e) {
      this.setData({
        old: e.detail.value
      });
      this.isAllwrite()
    },
    changeNewPwd(e) {
      this.setData({
        newPwd: e.detail.value
      });
      this.isAllwrite()
    },
    isAllwrite(){
      let isFinished = false 
      if (!Tool.isEmptyStr(this.data.reNew) && !Tool.isEmptyStr(this.data.newPwd) && !Tool.isEmptyStr(this.data.old)){
        isFinished = true
      }
      this.setData({
        isFinished: isFinished
      })
    },
    updateDealerPassword(){
      if (this.data.reNew !== this.data.newPwd){
        Tool.showAlert('两次输入密码不一致');
        return
      }
      if (!Tool.checkPwd(this.data.newPwd)) {
        Tool.showAlert("密码格式不正确");
        return
      }
      let params = {
        oldPassword: this.data.old,
        newPassword: this.data.newPwd,
      };
      API.updateDealerPassword(params).then((res) => {
        Tool.showSuccessToast("修改成功",()=>{
          Tool.navigationPop()
        })
        // Tool.navigationPop()
      }).catch((res) => {
        console.log(res)
      })
    },
    //删除输入框内容
    deleteInp(e){
        let index=e.currentTarget.dataset.index;
        if(index==0){
            this.setData({
                old:'',
            })
        }else if(index==1){
            this.setData({
                newPwd:'',
            })
        }else{
            this.setData({
                reNew:'',
            })
        }
        this.isAllwrite()
    },
    //密码是否为明文
    seePassword(e){
        let index=e.currentTarget.dataset.index;
        this.data.setList[index].password=!this.data.setList[index].password;
        this.data.setList[index].isUnsee=!this.data.setList[index].isUnsee;
        this.setData({
            setList:this.data.setList
        })
    }
});