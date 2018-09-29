let { Tool, RequestFactory, Storage, Operation} = global;
Page({
  data: {
    ysf: { title: '申请售后' },
    hidden:false,
    reason:[
      {
        navbar:'申请退款',
        title: '请选择退款原因', // 仅退款
        choose:'退款原因',
        info: "退款说明",
        placeholder:"请填写退款说明",
        list: [
          // '多拍/错拍/不想要', 
          // '快递/物流一直未收到', 
          // '未按约定时间发货',
          // '商品/破损/少件/污渍等', 
          // '货物破损已拒签',
          // '假冒品牌/产品',
          // '未按约定时间发货',
          // '退运费',
          // '发票问题',
          // '其他'
        ]
      },
      {
        navbar: '申请退货',
        title: '请选择退货原因', //退款退货
        choose: '退货原因',
        info:"退货说明",
        placeholder: "请填写退货说明",
        list: [
          // '7天无理由退换货',
          // '商品描述的尺寸与实物不符',
          // '商品/破损/少件/污渍等',
          // '假冒品牌/产品',
          // '包装破损/商品破损',
          // '退运费',
          // '发票问题',
          // '其他'
        ]
      },
      {
        navbar: '申请换货',
        title: '请选择换货原因', // 换货
        choose: '换货原因',
        info: "换货说明",
        placeholder: "请填写退货说明",
        list: [
          // '7天无理由退换货',
          // '商品描述的尺寸与实物不符',
          // '商品/破损/少件/污渍等',
          // '质量存在问题',
          // '假冒品牌/产品',
          // '其他'
        ]
      }
    ],
    activeIndex:'',
    refundType: 0, // 0为仅退款 1为退货退款  2为换货
    queryReasonParams:[
      2,4,3
    ], // 2 退款理由 3 换货理由 4 退货退款
    originalImg:[],
    smallImg:[],
    remark:'',
    page:[
      '/pages/after-sale/only-refund/apply-result/apply-result',
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
      placeholder: { placeholder: placeholder, disabled: false }
    })
    wx.setNavigationBarTitle({
      title: this.data.reason[options.refundType].navbar
    })
    this.findOrderProductInfo()
    this.queryDictionaryDetailsType(options.refundType)
    Tool.isIPhoneX(this) 
  },
  queryDictionaryDetailsType(refundType){
    // let r = RequestFactory.queryDictionaryDetailsType(params)
    let params = {
      code: this.data.queryReasonParams[refundType],
      reqName: '获取数据字典',
      url: Operation.queryDictionaryDetailsType
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock= (req) => {
      this.data.reason[refundType].list = req.responseObject.data
      this.setData({
        reason: this.data.reason
      })
    }
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  findOrderProductInfo(){
    // let r = RequestFactory.findOrderProductInfo(params)
    let params = {
      orderProductId: this.data.list.id,
      reqName: '查看申请退款子订单详情',
      url: Operation.findOrderProductInfo
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let data = req.responseObject.data
      data.imgUrl = data.specImg ? data.specImg : this.data.list.imgUrl
      data.createTime = Tool.formatTime(data.createTime)
      this.setData({
        orderInfos: data
      })
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
    if (this.data.refundType == 2 && Tool.isEmptyStr(this.data.remark)){
      Tool.showAlert(this.data.reason[this.data.refundType].placeholder)
      return
    }
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
    let params = {
      imgUrls: this.data.originalImg.join(','),
      orderProductId: list.id,
      remark: this.data.remark,
      returnReason: this.data.reason[this.data.refundType].list[this.data.activeIndex].dValue,
      smallImgUrls: this.data.smallImg.join(','),
      reqName: reqName,
      url: url
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      Tool.redirectTo(this.data.page[this.data.refundType] + '?returnProductId=' + req.responseObject.data.returnProductId)
    };
    Tool.showErrMsg(r)
    r.addToQueue();
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
  }
})