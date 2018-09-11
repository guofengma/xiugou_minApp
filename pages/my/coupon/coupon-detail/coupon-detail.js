let { Tool, RequestFactory, Operation } = global;
Page({
  data: {
    disabled:true,
    active:true,
    detail:{},
    btn:"",
    types: {
      MJ: "满减劵", ZK: "折扣劵", DK: "抵扣劵", DJ: "抵价劵"
    }
  },
  getCouponType(item) {
    let typeObj = this.data.types
    item.typeName = typeObj[item.type]
    item.showTypeName = item.type == 'DK' || item.type == 'DJ' ? true : false
    item.value = item.type == 'ZK' ? Tool.mul(item.value, 0.1) : item.value
  },
  getDetail(id){
    let params = {
      id: id,
      reqName: '优惠劵详情',
      url: Operation.getDiscountCouponById
    }
    let r = RequestFactory.wxRequest(params);
    // let r = RequestFactory.getDiscountCouponById(params);
    r.successBlock = (req) => {
      if (!req.responseObject.data) return
      let detail=req.responseObject.data;
        detail.start_time = Tool.formatTime(detail.startTime).slice(0,10);
        detail.out_time = Tool.formatTime(detail.outTime).slice(0,10);
      this.getCouponType(detail)
        this.setData({
            detail: detail
        })
    };
    Tool.showErrMsg(r);
    r.addToQueue();
  },
  btnClicked(){
    let detail = this.data.detail

  },
  onLoad: function (options) {
      this.getDetail(options.id)
      this.setData({
        btn: options.btn
      })
  },
})