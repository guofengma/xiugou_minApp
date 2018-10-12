let { Tool, RequestFactory, Operation} = global;
Page({
    data: {
      ysf: { title: '物流详情' },
      deliveryName: '',
      LogisticCode: '',
      status: '',
      img: '',
      id: '',
      name: '',
      list: [
          // {
          //     time: '',
          //     middleImage: '/img/wuliu-7.png',
          //     title: '',
          //     content1: '[收货地址]浙江省杭州市萧山区 宁围镇鸿宁街道望京商务中心C2-502',
          // }, {
          //     time: '06-01\n07:25',
          //     middleImage: '/img/wuliu-6.png',
          //     title: '已签收',
          //     content1: '[自提柜]已签收，签收人凭取货码签收。感谢使用ZJ望京国际丰巢【自提柜】，期待再次为您服务。',
          // }, {
          //     time: '06-01\n07:25',
          //     middleImage: '/img/wuliu-4.png',
          //     title: '待取件',
          //     content1: '[杭州市] 杭州萧山派件员：杨二萌',
          //     content2: '185158675566',
          //     content3: '正在为您派件',
          // }, {
          //     time: '06-01\n07:25',
          //     middleImage: '/img/wuliu-5.png',
          //     title: '派送中',
          //     content1: '[杭州市] 杭州萧山派件员：杨二萌',
          //     content2: '185158675566',
          //     content3: '正在为您派件',
          // },
          // {
          //     time: '06-01\n07:25',
          //     middleImage: '/img/wuliu-4.png',
          //     title: '运输中',
          //     content1: '[杭州市] 杭州萧山派件员：杨二萌',
          // },
          // {
          //     time: '06-01\n07:25',
          //     content1: '[杭州市] 杭州萧山派件员：杨二萌',
          // }, {
          //     middleImage: '/img/wuliu-2.png',
          //     title: '已发货',
          //     content1: '包裹正在等待揽件',
          // }, {
          //     middleImage: '/img/wuliu-1.png',
          //     title: '分拣中',
          //     content1: '包裹正在分拣中',
          // },
      ],
      tips:'物流信息查询中...'
    },
    onLoad: function (options) {
        this.setData({
            id: options.id || '',
            door: options.door || '',
            type: options.type || ''
        });
        this.getDelivery()
    },
    getDelivery() {
        let params = {
          expNum: this.data.id,
          requestMethod: 'GET',
          reqName: '物流查看',
          url: Operation.findLogisticsDetail
        }
        let r = RequestFactory.wxRequest(params);
        r.successBlock= (req) => {
          let datas = req.responseObject.data;
          if (datas) {
            if (datas.showapi_res_body && datas.showapi_res_body.data) {
              this.setData({
                img: datas.img || '',
                expTextName: datas.showapi_res_body.expTextName,
                mailNo: datas.showapi_res_body.mailNo,
                status: datas.showapi_res_body.status,
                phone: datas.phone || ''
              })
              let list = datas.showapi_res_body.data;
              let tempList = [];
              if (list.length) {
                list.forEach((item) => {
                  item.showDate = item.time.slice(5, 10)  
                  item.showTime = item.time.slice(11, 16)
                  tempList.push(item)
                });
                this.setData({
                    list: tempList
                })
              } else {
                this.setData({
                  tips: '暂无物流信息~'
                })
              }
            }
          }
        };
        Tool.showErrMsg(r);
        r.addToQueue();
    },
    onShow: function () {

    },

})