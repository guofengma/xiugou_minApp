let { Tool, RequestFactory, Event, Storage, Operation, API} = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        count: 0,
        active: false,
        chooseType: false,
        mask: false,
        activeIndex:0,
        type: '请选择问题类型',
        success: false,
        originalImg: [],
        smallImg: [],
        content:'',
        typeArr:[
          // "请选择问题类型","账户问题", "营销问题", "购买流程","推广机制"
        ]
    },
    onLoad: function (options) {
      this.queryDictionaryDetailsType()
    },
    queryDictionaryDetailsType() {
      API.queryDictionaryDetailsType({
        code: 'WTLX',
      }).then((res) => {
        let datas = res.data || []
        datas.unshift({ "value": "请选择问题类型", "code": "" })
        this.setData({
          typeArr: datas
        })
      }).catch((res) => {
        console.log(res)
      });
      // let params = {
      //   code:'WTLX',
      //   reqName: '获取数字字典',
      //   requestMethod: 'GET',
      //   url: Operation.queryDictionaryDetailsType
      // }
      // let r = RequestFactory.wxRequest(params);
      // r.successBlock = (req) => {
      //   req.responseObject.data.unshift({ "value": "请选择问题类型", "code": "" })
      //   this.setData({
      //     typeArr: req.responseObject.data
      //   })
      // }
      // Tool.showErrMsg(r)
      // r.addToQueue();
    },
    //选择问题类型弹窗
    questionType() {
      this.setData({
        mask: !this.data.mask,
      })
    },
    //选择问题类型
    chooseType(e) {
        let index = e.currentTarget.dataset.index;
        this.setData({
          activeIndex: index,
          mask: !this.data.mask,
        });
        this.active();
    },
    //计数
    detailRemark(e) {
        let length = e.detail.value.length;
        this.setData({
            count: length,
            content:e.detail.value
        });
        this.active();
    },
    uploadImage(e) {
      this.setData({
        originalImg: e.detail.originalImg,
        smallImg: e.detail.smallImg,
      })
    },
    //提交成功
    addFeedback() {
      if (this.data.active) {
        this.setData({
          active:false
        })
        if (this.data.content.length < 10) {
          Tool.showAlert('问题反馈详情说明字数不能少于10个字')
          return
        }
        let originalImg = ''
        let smallImg = ''
        if (this.data.originalImg) {
          originalImg = this.data.originalImg.join(',')
          smallImg = this.data.smallImg.join(',')
        }
        let params = {
          originalImg: originalImg,
          smallImg: smallImg,
          typeKey: this.data.typeArr[this.data.activeIndex].detailId,
          content: this.data.content,
          reqName: '添加反馈',
          url: Operation.addFeedback
        };
        let r = RequestFactory.wxRequest(params);
        r.successBlock = (req) => {
          this.setData({
            success: true
          })
        };
        Tool.showErrMsg(r)
        r.completeBlock = (req) => { 
          this.setData({
            active: true
          })
        };
        r.addToQueue();
      }
    },
    //确定
    sure(){
      this.setData({
        success:false
      });
      Tool.navigationPop()
    },
    active() {
      if (this.data.activeIndex !=0  && this.data.count != 0) {
          this.setData({
              active: true
          })
      } else {
          this.setData({
              active: false
          })
      }
    },
    
    onUnload: function () {
    }
})