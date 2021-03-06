let { Tool, RequestFactory, Storage, Operation} = global;
//this.selectComponent("#prd-info-type").isVisiableClicked()
Page({
  data: {
    ysf: { title: '申请售后' },
    hidden:false,
    textarea:true,
    selectType:{}, // 换货参数
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
      'TKLY', 'THTK','HHLY'
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
      list: Storage.getInnerOrderList() || '',
      returnProductId: options.returnProductId || '',
      placeholder: { placeholder: placeholder, disabled: false }
    })
    Tool.isIPhoneX(this) 
    this.initData()
  },
  initData(){
    let list = this.data.list
    if (this.data.returnProductId) {
      let imgList = list.imgList || []
      imgList.forEach((item) => {
        this.data.originalImg.push(item.originalImg)
        this.data.smallImg.push(item.smallImg)
      })
      this.setData({
        selectType:{
          id: list.exchangePriceId || '',
          spec: list.exchangeSpec || '',
          specImg: list.exchangeSpecImg || '',
        },
        originalImg: this.data.originalImg,
        smallImg: this.data.smallImg,
        remark: list.remark,
        returnReason:list.returnReason
      })
      this.selectComponent("#update-img").initData()
    }
    wx.setNavigationBarTitle({
      title: this.data.reason[this.data.refundType].navbar
    })
    this.findOrderProductInfo()
    this.queryDictionaryDetailsType(this.data.refundType)
  },
  queryDictionaryDetailsType(refundType){
    let params = {
      code: this.data.queryReasonParams[refundType],
      reqName: '获取数字字典',
      requestMethod: 'GET',
      url: Operation.queryDictionaryDetailsType
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock= (req) => {
      let datas = req.responseObject.data || []
     
      if (this.data.returnReason){
        datas.forEach((item,index)=>{
          if(item.value==this.data.returnReason){
            this.setData({
              activeIndex:index
            })
            this.selectComponent('#chooseReason').setIndex(index);
          }
        })
      }
      this.data.reason[refundType].list = req.responseObject.data
      this.setData({
        reason: this.data.reason
      })
    }
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  findOrderProductInfo(){
    let params = {
      orderProductId: this.data.list.id,
      reqName: '查看申请退款子订单详情',
      url: Operation.findOrderProductInfo,
      requestMethod: 'GET'
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let data = req.responseObject.data
      if (data.status != 1 && data.returnProductId) {
        let callBack = ()=>{
          Tool.redirectTo('/pages/my/my-order/my-order')
        }
        let content = "售后"+this.data.stateArr[data.status]+",不能修改申请"
        Tool.showAlert(content,callBack)
      } else {
        data.imgUrl = data.specImg ? data.specImg : this.data.list.imgUrl
        data.createTime = Tool.formatTime(data.orderCreateTime)
        this.setData({
          orderInfos: data
        })
      }
      
    }
    Tool.showErrMsg(r)
    r.addToQueue();
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
    // if (this.data.refundType == 2 && Tool.isEmptyStr(this.data.remark)){
    //   Tool.showAlert(this.data.reason[this.data.refundType].placeholder)
    //   return
    // }
    let list = this.data.list
    let url = ''
    let reqName = ''
    if (this.data.refundType==0){
      url = Operation.orderRefund
      reqName = '申请仅退款'
    } else if (this.data.refundType == 1) {
      url = Operation.applyReturnGoods
      reqName = '申请退货'
    } else {
      url = Operation.applyExchangeProduct
      reqName = '申请换货'
    }
    if (this.data.returnProductId) {
      url = Operation.updateApply
      reqName = '修改退换货申请'
    }
    let imgList = []
    
    this.data.originalImg.forEach((item,index)=>{
      imgList.push({
        // height:item.height,
        // width:
        originalImg:item,
        smallImg: this.data.smallImg[index]
      })
    })
    let params = {
      exchangePriceId: this.data.selectType.id || '',
      exchangeSpec: this.data.selectType.spec || '',
      exchangeSpecImg: this.data.selectType.specImg || '',
      imgList: imgList,
      orderProductId: list.id,
      remark: this.data.remark,
      returnProductId: Number(this.data.returnProductId) || '',
      // returnReason:'无',
      returnReason: this.data.reason[this.data.refundType].list[this.data.activeIndex].value,
      reqName: reqName,
      url: url
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      Tool.redirectTo(this.data.page[this.data.refundType] + '?returnProductId=' + req.responseObject.data.id)
    };
    Tool.showErrMsg(r)
    r.addToQueue();
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
  // chooseType(){
  //   let params = {
  //     id: this.data.list.productId,
  //     isShowLoading: false,
  //     requestMethod: 'GET',
  //     url: Operation.findProductStockBySpec,
  //     reqName: "规格搜索"
  //   }
  //   let r = RequestFactory.wxRequest(params);
  //   r.successBlock = (req) => {
  //     let datas = req.responseObject.data
  //     this.setData({
  //       productSpec: datas.specMap,
  //       priceList: datas.priceList,
  //       selectPrice: this.data.list.price,
  //       isInit: false,
  //       imgUrl: this.data.list.specImg
  //     })
  //     this.selectComponent("#prd-info-type").isVisiableClicked()
  //   }
  //   Tool.showErrMsg(r)
  //   r.addToQueue();
  // },
  changeProdctType(e){
    this.setData({
      selectType: e.detail
    })
  }
})