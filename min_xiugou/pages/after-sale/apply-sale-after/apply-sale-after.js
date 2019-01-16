let { Tool, API, Storage} = global;
Page({
  data: {
    ysf: { title: '申请售后' },
    hidden:false,
    textarea:true,
    selectType:{}, // 换货参数
    afterSaleType:[4],//支持7天无理由退换货
    reason:[
      {
        navbar:'申请退款',
        title: '请选择退款原因', // 仅退款
        choose:'退款原因',
        info: "退款说明",
        placeholder:"请填写退款说明",
        list: [],
        tips:''
      },
      {
        navbar: '申请退货',
        title: '请选择退货原因', //退款退货
        choose: '退货原因',
        info:"退货说明",
        placeholder: "请填写退货说明",
        list: [],
        tips: '退回商品需由买家承担运费，请确保商品不影响二次销售'
      },
      {
        navbar: '申请换货',
        title: '请选择换货原因', // 换货
        choose: '换货原因',
        info: "换货说明",
        placeholder: "请填写退货说明",
        list: [],
        tips: '仅可更换同规格的商品'
      }
    ],
    activeIndex:'',
    refundType: 0, // 0为仅退款 1为退货退款  2为换货
    queryReasonParams:[
      'JTK', 'THTK','HH','WFH'
    ], // 2 退款理由 3 换货理由 4 退货退款
    stateArr:['',"申请中","已同意","已拒绝",'中',"中","完成","超时","超时"],
    originalImg:[],
    smallImg:[],
    remark:'',
    page:[
      '/pages/after-sale/only-refund/only-refund-detail/only-refund-detail',
      '/pages/after-sale/return-goods/return-goods',
      '/pages/after-sale/exchange-goods/exchange-goods'
    ],
    placeholder: { placeholder: '请填写说明', disabled:false}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let placeholder = this.data.reason[options.refundType].placeholder
    this.setData({
      refundType: options.refundType,
      list: Storage.getInnerOrderList() || {},
      orderProductNo: options.orderProductNo || '',
      serviceNo: options.serviceNo || '',
      placeholder: { placeholder: placeholder, disabled: false }
    })
    Tool.isIPhoneX(this)
    this.initData()
  },
  initData(){
    let list = this.data.list
    if (this.data.serviceNo) {
      let imgList = list.showImgList|| []
      imgList.forEach((item) => {
        this.data.originalImg.push(item)
        this.data.smallImg.push(item)
      })
      this.setData({
        // selectType:{
        //   id: list.exchangePriceId || '',
        //   spec: list.exchangeSpec || '',
        //   specImg: list.exchangeSpecImg || '',
        // },
        originalImg: this.data.originalImg,
        smallImg: this.data.smallImg,
        remark: list.description || '',
        returnReason: list.reason || '',
        serviceNo: list.serviceNo
      })
      this.selectComponent("#update-img").initData()
    }
    wx.setNavigationBarTitle({
      title: this.data.reason[this.data.refundType].navbar
    })
    this.findOrderProductInfo()
    // this.queryDictionaryDetailsType(this.data.refundType)
  },
  queryDictionaryDetailsType(refundType){
    let code = this.data.queryReasonParams[refundType]
    if(this.data.orderInfos.status<=2) code = this.data.queryReasonParams[3]
    API.queryDictionaryDetailsType({
      code: code,
    }).then((res) => {
      let datas = res.data || []
      if (this.data.returnReason) {
        datas.forEach((item, index) => {
          if (item.value == this.data.returnReason) {
            this.setData({
              activeIndex: index
            })
            this.selectComponent('#chooseReason').setIndex(index);
          }
        })
      }
      let arr = Tool.bitOperation(this.data.afterSaleType, this.data.orderInfos.restrictions)
      if (arr.includes(this.data.afterSaleType[0])) {
        datas.unshift({
          value:'7天无理由退换'
        })
      }
      this.data.reason[refundType].list = datas
      this.setData({
        reason: this.data.reason
      })
    }).catch((res) => {
      console.log(res)
    });
  },
  changeApplyAmount(e){
    let applyRefundAmount = e.detail.value
    let totalAmount = this.data.orderInfos.totalAmount
    // console.log(applyRefundAmount > totalAmount, applyRefundAmount, totalAmount)
    if (applyRefundAmount > totalAmount) {
      Tool.showAlert(`最多只能申请${totalAmount}元`)
      applyRefundAmount = totalAmount
    }
    this.setData({
      applyRefundAmount: applyRefundAmount
    })
  },
  findOrderProductInfo(){
    API.afterSaleOrderDetail({
      orderProductNo: this.data.orderProductNo || this.data.list.orderProductNo || ''
    }).then((res) => {
      let data = res.data || {}
      // if (data.status != 1 && this.data.serviceNo) {
      //   let callBack = ()=>{
      //     Tool.redirectTo('/pages/my/my-order/my-order')
      //   }
      //   let content = "售后"+this.data.stateArr[data.status]+",不能修改申请"
      //   Tool.showAlert(content,callBack)
      // } else {
      //   data.imgUrl = data.specImg? data.specImg : this.data.list.imgUrl
      //   data.createTime = Tool.formatTime(data.createTime)
      // }
      data.imgUrl = data.specImg? data.specImg : this.data.list.imgUrl
      data.createTime = Tool.formatTime(data.createTime)
      if (this.data.refundType != 2 && data.status > 2 && data.status < 6 && data.payAmount > 0) data.canEditAmout = true
      this.setData({
        orderInfos: data,
        applyRefundAmount:data.payAmount
      })
      this.queryDictionaryDetailsType(this.data.refundType)
    }).catch((res) => {
      console.log(res)
    });
  },
  chooseReason(){
    this.setData({
      hidden: !this.data.hidden,
      placeholder: { placeholder: ' ', disabled: true}
    })
  },
  hiddenTips() {
    this.setData({
      textarea: !this.data.textarea,
    })
  },
  makeSureReason(e){
    let placeholder= this.data.reason[this.data.refundType].placeholder
    this.setData({
      activeIndex: e.detail.activeIndex,
      hidden: e.detail.hidden,
      placeholder: { placeholder: placeholder, disabled: false }
    })

  },
  orderRefund(){
    if (this.data.activeIndex===''){
      Tool.showAlert('请选择' + this.data.reason[this.data.refundType].choose)
      return
    }
    if (this.data.orderInfos.canEditAmout&&Tool.isEmptyStr(this.data.applyRefundAmount)){
      Tool.showAlert('请输入退款金额')
      return
    }
    // if (this.data.refundType == 2 && Tool.isEmptyStr(this.data.remark)){
    //   Tool.showAlert(this.data.reason[this.data.refundType].placeholder)
    //   return
    // }
    let list = this.data.list
    // let imgList = []
    // this.data.originalImg.forEach((item,index)=>{
    //   imgList.push({
    //     originalImg:item,
    //     smallImg: this.data.smallImg[index]
    //   })
    // })
    let params = {
      // exchangePriceId: this.data.selectType.id || '',
      // exchangeSpec: this.data.selectType.spec || '',
      // exchangeSpecImg: this.data.selectType.specImg || '',
      applyRefundAmount: this.data.applyRefundAmount || '',
      imgList: this.data.originalImg.join(","),
      orderProductNo: this.data.orderProductNo || this.data.list.orderProductNo || '',
      reason: this.data.reason[this.data.refundType].list[this.data.activeIndex].value,
      description: this.data.remark,
      'type': Number(this.data.refundType)+1,
      serviceNo: this.data.serviceNo || '',
    }
    let reqName = this.data.serviceNo? 'modifyAfterSale':'applyAfterSale'
    API[reqName](params).then((res) => {
      let datas = res.data || {}
      if(!this.data.serviceNo){
        Tool.sensors("ApplyReturn",{
          orderID:params.orderProductNo,
          commodityID:this.data.orderInfos.skuCode,
          commodityName:this.data.orderInfos.productName,
          commodityAmount:this.data.orderInfos.payAmount,
          partlyReturn:this.data.applyRefundAmount==this.data.orderInfos.payAmount? false:true,
          applyReturnCause:params.reason
        })
      }
      let serviceNo = ''
      if (datas.serviceNo){
        serviceNo = datas.serviceNo
      } else{
        serviceNo =this.data.serviceNo
      }
      Tool.redirectTo(this.data.page[this.data.refundType] + '?serviceNo=' + serviceNo)
    }).catch((res) => {
      console.log(res)
    });
  },
  updateApply(){

  },
  uploadImage(e){
    this.setData({
      originalImg: e.detail.originalImg,
      smallImg: e.detail.smallImg,
    })
  },
  inputChange(e){
    this.setData({
      remark: e.detail.value
    })
  },
  changeProdctType(e){
    this.setData({
      selectType: e.detail
    })
  }
})