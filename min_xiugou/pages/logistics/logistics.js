let { Tool, API} = global;
Page({
    data: {
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
      tips:'物流信息查询中...',
      statusText:[
        '暂无记录', '在途中', '正在派件', '已签收', '用户拒签', '派送失败'
      ]
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
      API.getOrderDeliverInfo({
        expressNo: this.data.id
      }).then((res) => {
        let datas = res.data || '{}'
        datas = JSON.parse(datas)
        let result = datas.result || {}
        if (datas.status == 0) {
          let list = result.list || []
          list.forEach((item) => {
            item.showDate = item.time.slice(5, 10)
            item.showTime = item.time.slice(11, 16)
          });
          if(list.length==0) this.data.tips = '暂无物流信息~'
          this.setData({
            mailNo: result.number,
            expName: result.expName,
            list: list,
            tips:this.data.tips,
            status: this.data.statusText[result.deliverystatus]
          })
        }else{
          this.setData({
            tips: datas.msg || '暂无物流信息~'
          })
        }
      }).catch((res) => {
        console.log(res)
      })
    },
    onShow: function () {

    },

})