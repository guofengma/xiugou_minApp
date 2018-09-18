let { Tool, RequestFactory, Storage, Event, Operation} = global
Page({
  data: {
    ysf: { title: '申请售后结果' },
    state:''
  },
  onLoad: function (options) {
    this.setData({
      list: Storage.getInnerOrderList() || ''
    })
    this.findReturnProductById(options.returnProductId)
  },
  onShow: function () {

  },
  orderState(n,content){
    let state =''
    if(n==0){
      state = { state: '提交成功!', content: '已转交相关客服处理，请耐心等待', icon: '/img/after-sale-right.png', className: 'green'}
    } else if(n==1){
      state = { state: '商家审核中...', content: '已转交相关客服，请耐心等待', icon: '/img/after-sale-right.png',className:'green' }
    } else if (n == 2) {
      state = { state: '商家拒绝你的请求!', content: content, icon: '/img/after-sale-err.png', className: 'red' }
    }
    this.setData({
      state: state
    })
  },
  findReturnProductById(returnProductId) {
    let params = {
      returnProductId: returnProductId || this.data.list.returnProductId,
      reqName: '查看退款退货换货情况',
      url: Operation.findReturnProductById
    }
    let r = RequestFactory.wxRequest(params);
    // let r = RequestFactory.findReturnProductById(params)
    r.successBlock = (req) => {
      let datas = req.responseObject.data
      Tool.findReturnProductById(req)
      this.setData({
        datas: datas
      })
      if (datas.returnProduct.status==3){
        this.orderState(2, req.responseObject.data.returnProduct.refusal_reason)
      } else {
        this.orderState(0)
        Event.emit('getDetail')
      }
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
})