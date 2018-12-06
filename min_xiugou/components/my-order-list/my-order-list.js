let { Tool, API, Storage, Event, Operation } = global;
Component({
  properties: {
    num:Number,
    condition:String,
  },
  data: {
    num: 0,
    params: {},
    totalPage: '', // 页面总页数
    currentPage: 1, // 当前的页数
    pageSize: 10, // 每次加载请求的条数 默认10
    list: [],
    tipVal: '',//是否暂无数据
    isCancel: false,//是否取消订单
    isDelete: false, //是否删除订单
    orderId: '',
    status: '',
    orderNum: '',
    key: 0,
    time:"",
    returnTypeArr:['','退款','退货','换货'],
    datas: {
      "code": 10000,
      "data": {
        "currentPage": 1,
        "data": [
          {
            "activityCode": "",
            "address": "10087号",
            "area": "滨江区",
            "channel": 1,
            "city": "杭州市",
            "couponAmount": 0.00,
            "freightAmount": 0.00,
            "id": 18,
            "orderAmount": 112.00,
            "orderTime": 1543822497000,
            "orderType": 1,
            "payAmount": 112.00,
            "payTime": 1543822507000,
            "platformOrderNo": "P666667",
            "productPrice": 112.00,
            "province": "浙江省",
            "provinceCode": 330000,
            "quantity": 2,
            "receiver": "帅的不行",
            "receiverPhone": "17682313257",
            "source": 1,
            "storeCode": "",
            "storeOwnerCode": "",
            "street": "江南大道",
            "superiorUserCode": "",
            "tokenCoinAmount": 0.00,
            "userCode": "W181031000006",
            "userCouponCode": "",
            "userLevel": 0,
            "userPhone": "17682313257",
            "warehouseOrderDTOList": [
              {
                "autoReceiveTime": 1543823255000,
                "cancelReason": "",
                "cancelTime": 1543823247000,
                "couponAmount": 0.00,
                "createTime": 1543823302000,
                "deliverTime": 1543823250000,
                "finishTime": 1545292061000,
                "freightAmount": 0.00,
                "id": 17,
                "lockStatus": 2,
                "message": "",
                "orderAmount": 28.00,
                "payAmount": 28.00,
                "platformOrderNo": "P666667",
                "platformRemarks": "",
                "productPrice": 28.00,
                "products": [
                  {
                    "accountPayAmount": 28.00,
                    "cashPayAmount": 0.00,
                    "couponAmount": 0.00,
                    "createTime": 1543656004000,
                    "freightAmount": 0.00,
                    "freightTemplateId": 1,
                    "groupPrice": 28.00,
                    "id": 18,
                    "invoiceAmount": 0.00,
                    "orderProductNo": "G116615",
                    "originalPrice": 30.00,
                    "payAmount": 28.00,
                    "platformOrderNo": "P666667",
                    "prodCode": "SPU00000039",
                    "productName": "Macbook Pro 蒋大为专用1",
                    "promotionAmount": 0.00,
                    "quantity": 1,
                    "settlementPrice": 20.00,
                    "skuCode": "SKU000000390001",
                    "specImg": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543665802906&di=4fa56583ca281aa03d22fffacdaff345&imgtype=0&src=http%3A%2F%2Fimg0.imgtn.bdimg.com%2Fit%2Fu%3D907609500%2C3862542478%26fm%3D214%26gp%3D0.jpg",
                    "specTitle": "颜色",
                    "specValues": "尺寸",
                    "status": 2,
                    "supplierSkuCode": "SSKU2",
                    "taxAmount": 0.00,
                    "tokenCoinAmount": 0.00,
                    "totalAmount": 28.00,
                    "unitPrice": 28.00,
                    "updateTime": 1544073968000,
                    "userCode": "W181031000006",
                    "userPhone": "15606533097",
                    "userRemarks": "",
                    "warehouseOrderNo": "C888891"
                  }
                ],
                "receiver": "帅的不行",
                "status": 2,
                "subStatus": 0,
                "supplierCode": "GYS00016",
                "supplierName": "测试1",
                "tokenCoinAmount": 0.00,
                "updateTime": 1543975315000,
                "userCode": "W181031000006",
                "userPhone": "15606533097",
                "warehouseCode": "QIMEN",
                "warehouseOrderNo": "C888891",
                "warehouseType": 2
              },
              {
                "autoReceiveTime": 1543823255000,
                "cancelReason": "",
                "cancelTime": 1543823247000,
                "couponAmount": 0.00,
                "createTime": 1543823302000,
                "deliverTime": 1543823250000,
                "finishTime": 1545292061000,
                "freightAmount": 0.00,
                "id": 18,
                "lockStatus": 2,
                "message": "",
                "orderAmount": 84.00,
                "payAmount": 84.00,
                "platformOrderNo": "P666667",
                "platformRemarks": "",
                "productPrice": 84.00,
                "products": [
                  {
                    "accountPayAmount": 28.00,
                    "cashPayAmount": 0.00,
                    "couponAmount": 0.00,
                    "createTime": 1543656004000,
                    "freightAmount": 0.00,
                    "freightTemplateId": 1,
                    "groupPrice": 28.00,
                    "id": 19,
                    "invoiceAmount": 0.00,
                    "orderProductNo": "O116616",
                    "originalPrice": 30.00,
                    "payAmount": 28.00,
                    "platformOrderNo": "P666667",
                    "prodCode": "SPU00000039",
                    "productName": "Macbook Pro 蒋大为专用2",
                    "promotionAmount": 0.00,
                    "quantity": 1,
                    "settlementPrice": 20.00,
                    "skuCode": "SKU000000390001",
                    "specImg": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543665802906&di=4fa56583ca281aa03d22fffacdaff345&imgtype=0&src=http%3A%2F%2Fimg0.imgtn.bdimg.com%2Fit%2Fu%3D907609500%2C3862542478%26fm%3D214%26gp%3D0.jpg",
                    "specTitle": "颜色",
                    "specValues": "尺寸",
                    "status": 1,
                    "supplierSkuCode": "SSKU2",
                    "taxAmount": 0.00,
                    "tokenCoinAmount": 0.00,
                    "totalAmount": 28.00,
                    "unitPrice": 28.00,
                    "updateTime": 1543975929000,
                    "userCode": "W181031000006",
                    "userPhone": "15606533097",
                    "userRemarks": "",
                    "warehouseOrderNo": "C888892"
                  },
                  {
                    "accountPayAmount": 28.00,
                    "cashPayAmount": 0.00,
                    "couponAmount": 0.00,
                    "createTime": 1543656004000,
                    "freightAmount": 0.00,
                    "freightTemplateId": 1,
                    "groupPrice": 28.00,
                    "id": 38,
                    "invoiceAmount": 0.00,
                    "orderProductNo": "O116619",
                    "originalPrice": 30.00,
                    "payAmount": 28.00,
                    "platformOrderNo": "P666667",
                    "prodCode": "SPU00000039",
                    "productName": "Macbook Pro 蒋大为专用3",
                    "promotionAmount": 0.00,
                    "quantity": 1,
                    "settlementPrice": 20.00,
                    "skuCode": "SKU000000390001",
                    "specImg": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543665802906&di=4fa56583ca281aa03d22fffacdaff345&imgtype=0&src=http%3A%2F%2Fimg0.imgtn.bdimg.com%2Fit%2Fu%3D907609500%2C3862542478%26fm%3D214%26gp%3D0.jpg",
                    "specTitle": "颜色",
                    "specValues": "尺寸",
                    "status": 1,
                    "supplierSkuCode": "SSKU2",
                    "taxAmount": 0.00,
                    "tokenCoinAmount": 0.00,
                    "totalAmount": 28.00,
                    "unitPrice": 28.00,
                    "updateTime": 1543975929000,
                    "userCode": "W181031000006",
                    "userPhone": "15606533097",
                    "userRemarks": "",
                    "warehouseOrderNo": "C888892"
                  },
                  {
                    "accountPayAmount": 28.00,
                    "cashPayAmount": 0.00,
                    "couponAmount": 0.00,
                    "createTime": 1543656004000,
                    "freightAmount": 0.00,
                    "freightTemplateId": 1,
                    "groupPrice": 28.00,
                    "id": 39,
                    "invoiceAmount": 0.00,
                    "orderProductNo": "O116620",
                    "originalPrice": 30.00,
                    "payAmount": 28.00,
                    "platformOrderNo": "P666667",
                    "prodCode": "SPU00000039",
                    "productName": "Macbook Pro 蒋大为专用4",
                    "promotionAmount": 0.00,
                    "quantity": 1,
                    "settlementPrice": 20.00,
                    "skuCode": "SKU000000390001",
                    "specImg": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543665802906&di=4fa56583ca281aa03d22fffacdaff345&imgtype=0&src=http%3A%2F%2Fimg0.imgtn.bdimg.com%2Fit%2Fu%3D907609500%2C3862542478%26fm%3D214%26gp%3D0.jpg",
                    "specTitle": "颜色",
                    "specValues": "尺寸",
                    "status": 1,
                    "supplierSkuCode": "SSKU2",
                    "taxAmount": 0.00,
                    "tokenCoinAmount": 0.00,
                    "totalAmount": 28.00,
                    "unitPrice": 28.00,
                    "updateTime": 1543975929000,
                    "userCode": "W181031000006",
                    "userPhone": "15606533097",
                    "userRemarks": "",
                    "warehouseOrderNo": "C888892"
                  }
                ],
                "receiver": "帅的不行",
                "status": 2,
                "subStatus": 0,
                "supplierCode": "GYS00016",
                "supplierName": "测试1",
                "tokenCoinAmount": 0.00,
                "updateTime": 1543975317000,
                "userCode": "W181031000006",
                "userPhone": "15606533097",
                "warehouseCode": "QIMEN",
                "warehouseOrderNo": "C888892",
                "warehouseType": 2
              }
            ]
          }, {
            "activityCode": "",
            "address": "10087号",
            "area": "滨江区",
            "channel": 1,
            "city": "杭州市",
            "couponAmount": 0.00,
            "freightAmount": 0.00,
            "id": 18,
            "orderAmount": 112.00,
            "orderTime": 1543822497000,
            "orderType": 1,
            "payAmount": 112.00,
            "payTime": 1543822507000,
            "platformOrderNo": "P666667",
            "productPrice": 112.00,
            "province": "浙江省",
            "provinceCode": 330000,
            "quantity": 2,
            "receiver": "帅的不行",
            "receiverPhone": "17682313257",
            "source": 1,
            "storeCode": "",
            "storeOwnerCode": "",
            "street": "江南大道",
            "superiorUserCode": "",
            "tokenCoinAmount": 0.00,
            "userCode": "W181031000006",
            "userCouponCode": "",
            "userLevel": 0,
            "userPhone": "17682313257",
            "warehouseOrderDTOList": [
              {
                "autoReceiveTime": 1543823255000,
                "cancelReason": "",
                "cancelTime": 1543823247000,
                "couponAmount": 0.00,
                "createTime": 1543823302000,
                "deliverTime": 1543823250000,
                "finishTime": 1545292061000,
                "freightAmount": 0.00,
                "id": 17,
                "lockStatus": 2,
                "message": "",
                "orderAmount": 28.00,
                "payAmount": 28.00,
                "platformOrderNo": "P666667",
                "platformRemarks": "",
                "productPrice": 28.00,
                "products": [
                  {
                    "accountPayAmount": 28.00,
                    "cashPayAmount": 0.00,
                    "couponAmount": 0.00,
                    "createTime": 1543656004000,
                    "freightAmount": 0.00,
                    "freightTemplateId": 1,
                    "groupPrice": 28.00,
                    "id": 18,
                    "invoiceAmount": 0.00,
                    "orderProductNo": "G116615",
                    "originalPrice": 30.00,
                    "payAmount": 28.00,
                    "platformOrderNo": "P666667",
                    "prodCode": "SPU00000039",
                    "productName": "Macbook Pro 蒋大为专用5",
                    "promotionAmount": 0.00,
                    "quantity": 1,
                    "settlementPrice": 20.00,
                    "skuCode": "SKU000000390001",
                    "specImg": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543665802906&di=4fa56583ca281aa03d22fffacdaff345&imgtype=0&src=http%3A%2F%2Fimg0.imgtn.bdimg.com%2Fit%2Fu%3D907609500%2C3862542478%26fm%3D214%26gp%3D0.jpg",
                    "specTitle": "颜色",
                    "specValues": "尺寸",
                    "status": 2,
                    "supplierSkuCode": "SSKU2",
                    "taxAmount": 0.00,
                    "tokenCoinAmount": 0.00,
                    "totalAmount": 28.00,
                    "unitPrice": 28.00,
                    "updateTime": 1544073968000,
                    "userCode": "W181031000006",
                    "userPhone": "15606533097",
                    "userRemarks": "",
                    "warehouseOrderNo": "C888891"
                  }
                ],
                "receiver": "帅的不行",
                "status": 1,
                "subStatus": 0,
                "supplierCode": "GYS00016",
                "supplierName": "测试1",
                "tokenCoinAmount": 0.00,
                "updateTime": 1543975315000,
                "userCode": "W181031000006",
                "userPhone": "15606533097",
                "warehouseCode": "QIMEN",
                "warehouseOrderNo": "C888891",
                "warehouseType": 2
              },
              {
                "autoReceiveTime": 1543823255000,
                "cancelReason": "",
                "cancelTime": 1543823247000,
                "couponAmount": 0.00,
                "createTime": 1543823302000,
                "deliverTime": 1543823250000,
                "finishTime": 1545292061000,
                "freightAmount": 0.00,
                "id": 18,
                "lockStatus": 2,
                "message": "",
                "orderAmount": 84.00,
                "payAmount": 84.00,
                "platformOrderNo": "P666667",
                "platformRemarks": "",
                "productPrice": 84.00,
                "products": [
                  {
                    "accountPayAmount": 28.00,
                    "cashPayAmount": 0.00,
                    "couponAmount": 0.00,
                    "createTime": 1543656004000,
                    "freightAmount": 0.00,
                    "freightTemplateId": 1,
                    "groupPrice": 28.00,
                    "id": 19,
                    "invoiceAmount": 0.00,
                    "orderProductNo": "O116616",
                    "originalPrice": 30.00,
                    "payAmount": 28.00,
                    "platformOrderNo": "P666667",
                    "prodCode": "SPU00000039",
                    "productName": "Macbook Pro 蒋大为专用6",
                    "promotionAmount": 0.00,
                    "quantity": 1,
                    "settlementPrice": 20.00,
                    "skuCode": "SKU000000390001",
                    "specImg": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543665802906&di=4fa56583ca281aa03d22fffacdaff345&imgtype=0&src=http%3A%2F%2Fimg0.imgtn.bdimg.com%2Fit%2Fu%3D907609500%2C3862542478%26fm%3D214%26gp%3D0.jpg",
                    "specTitle": "颜色",
                    "specValues": "尺寸",
                    "status": 1,
                    "supplierSkuCode": "SSKU2",
                    "taxAmount": 0.00,
                    "tokenCoinAmount": 0.00,
                    "totalAmount": 28.00,
                    "unitPrice": 28.00,
                    "updateTime": 1543975929000,
                    "userCode": "W181031000006",
                    "userPhone": "15606533097",
                    "userRemarks": "",
                    "warehouseOrderNo": "C888892"
                  },
                  {
                    "accountPayAmount": 28.00,
                    "cashPayAmount": 0.00,
                    "couponAmount": 0.00,
                    "createTime": 1543656004000,
                    "freightAmount": 0.00,
                    "freightTemplateId": 1,
                    "groupPrice": 28.00,
                    "id": 38,
                    "invoiceAmount": 0.00,
                    "orderProductNo": "O116619",
                    "originalPrice": 30.00,
                    "payAmount": 28.00,
                    "platformOrderNo": "P666667",
                    "prodCode": "SPU00000039",
                    "productName": "Macbook Pro 蒋大为专用7",
                    "promotionAmount": 0.00,
                    "quantity": 1,
                    "settlementPrice": 20.00,
                    "skuCode": "SKU000000390001",
                    "specImg": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543665802906&di=4fa56583ca281aa03d22fffacdaff345&imgtype=0&src=http%3A%2F%2Fimg0.imgtn.bdimg.com%2Fit%2Fu%3D907609500%2C3862542478%26fm%3D214%26gp%3D0.jpg",
                    "specTitle": "颜色",
                    "specValues": "尺寸",
                    "status": 1,
                    "supplierSkuCode": "SSKU2",
                    "taxAmount": 0.00,
                    "tokenCoinAmount": 0.00,
                    "totalAmount": 28.00,
                    "unitPrice": 28.00,
                    "updateTime": 1543975929000,
                    "userCode": "W181031000006",
                    "userPhone": "15606533097",
                    "userRemarks": "",
                    "warehouseOrderNo": "C888892"
                  },
                  {
                    "accountPayAmount": 28.00,
                    "cashPayAmount": 0.00,
                    "couponAmount": 0.00,
                    "createTime": 1543656004000,
                    "freightAmount": 0.00,
                    "freightTemplateId": 1,
                    "groupPrice": 28.00,
                    "id": 39,
                    "invoiceAmount": 0.00,
                    "orderProductNo": "O116620",
                    "originalPrice": 30.00,
                    "payAmount": 28.00,
                    "platformOrderNo": "P666667",
                    "prodCode": "SPU00000039",
                    "productName": "Macbook Pro 蒋大为专用8",
                    "promotionAmount": 0.00,
                    "quantity": 1,
                    "settlementPrice": 20.00,
                    "skuCode": "SKU000000390001",
                    "specImg": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543665802906&di=4fa56583ca281aa03d22fffacdaff345&imgtype=0&src=http%3A%2F%2Fimg0.imgtn.bdimg.com%2Fit%2Fu%3D907609500%2C3862542478%26fm%3D214%26gp%3D0.jpg",
                    "specTitle": "颜色",
                    "specValues": "尺寸",
                    "status": 1,
                    "supplierSkuCode": "SSKU2",
                    "taxAmount": 0.00,
                    "tokenCoinAmount": 0.00,
                    "totalAmount": 28.00,
                    "unitPrice": 28.00,
                    "updateTime": 1543975929000,
                    "userCode": "W181031000006",
                    "userPhone": "15606533097",
                    "userRemarks": "",
                    "warehouseOrderNo": "C888892"
                  }
                ],
                "receiver": "帅的不行",
                "status": 1,
                "subStatus": 0,
                "supplierCode": "GYS00016",
                "supplierName": "测试1",
                "tokenCoinAmount": 0.00,
                "updateTime": 1543975317000,
                "userCode": "W181031000006",
                "userPhone": "15606533097",
                "warehouseCode": "QIMEN",
                "warehouseOrderNo": "C888892",
                "warehouseType": 2
              }
            ]
          }
        ],
        "isMore": 0,
        "pageSize": 10,
        "startIndex": 0,
        "totalNum": 1,
        "totalPage": 1
      },
      "msg": "业务处理成功"
    }
  },
  methods: {
    //获取列表数据
    getList(e) {
      this.setData({
        num: this.properties.num,
        list: [],
        tipVal: '',
        key: 0,
        currentPage: 1
      });
      this.getData(this.properties.num);
    },
    //获取数据
    getData(index) {
      let list = this.data.list
      let lastOrder = list[list.length - 1] || {}
      let params = {
        size: this.data.pageSize,
        page: this.data.currentPage,
        status: index || '',
        keywords: this.properties.condition || '', // 关键字
      }
      let reqName = this.properties.condition ? "searchOrder" :"queryOrderPageList"
      API[reqName](params).then((res) => {
        let datas = res.data || {}
        let secondMap = new Map()
        let key = this.data.key
        let orderInfoArr = []
        let warehouseOrderDTOList = datas.data.warehouseOrderDTOList || []
        datas.data.forEach((item, index) => {
          let warehouseOrderDTOList = item.warehouseOrderDTOList || []
          let outStatus = item.warehouseOrderDTOList[0].status
          if (outStatus == 1) {
            let showOrderList = []
            warehouseOrderDTOList.forEach((item1, index1) => {
              item1.products.forEach((item2) => {
                showOrderList.push(item2)
              })
            })
            orderInfoArr.push({
              ...item,
              showStatus: 1,
              showNum: item.quantity,
              showOrderNo: item.platformOrderNo,
              showAmount: item.payAmount,
              showProducts: showOrderList,
              showName: '平台级订单'
            })
            let now = Tool.timeStringForDate(new Date(), "YYYY-MM-DD HH:mm:ss");
            secondMap.set(key, 1);
          } else {
            warehouseOrderDTOList.forEach((item1, index1) => {
              let showNum =0
              item1.products.forEach((item2) => {
                showNum += item2.quantity
              })
              orderInfoArr.push({
                ...item,
                showWarehouseInfo: {
                  ...item1,
                },
                showNum: showNum,
                showAmount: item1.payAmount,
                showStatus: item1.status,
                showOrderNo: item1.warehouseOrderNo,
                showProducts: item1.products,
                showName: '仓库级订单'
              })
            })
            delete orderInfoArr[index].showWarehouseInfo.products
          }
          key++;
        })
        
        if (!datas.totalPage) {
          this.setData({
            tipVal: 7
          });
        } else {
          this.setData({
            tipVal: ''
          });
        }
        // 这块是倒计时 暂时取消不做了
        if (secondMap.size > 0) {
          this.countdown(this);
        }
        this.setData({
          list: list.concat(orderInfoArr),
          totalPage: datas.totalPage,
          secondArry: secondMap,
          key: key
        });
        console.log(this.data.list)
      }).catch((res) => {
        console.log(res)
      })
      
      // let params = {
      //   size: this.data.pageSize,
      //   lastPageCreateTime: lastOrder.createTime || '',
      //   status:index || '',
      //   condition:this.properties.condition || '',
      //   reqName: "获取我的订单列表"+index,
      //   url: Operation.queryOrderPageList
      // }
      // let list = this.data.list;
      // this.setData({
      //   params: params
      // });
      // let r = RequestFactory.wxRequest(params);
      // r.successBlock = (req) => {
      //   let datas = [];
      //   let secondMap = new Map();
      //   let key = this.data.key;
      //   for (let i in req.responseObject.data.data) {
      //     let item = req.responseObject.data.data[i];
      //     item.createTime = Tool.formatTime(item.createTime);
      //     item.finishTime = Tool.formatTime(item.finishTime);
      //     item.showFinishTime = item.deliverTime ? Tool.formatTime(item.deliverTime) : item.finishTime;
      //     item.sendTime = Tool.formatTime(item.sendTime);
      //     item.payTime = Tool.formatTime(item.payTime);
      //     item.cancelTime = Tool.formatTime(item.cancelTime);
      //     item.payEndTime = Tool.formatTime(item.shutOffTime);
      //     // item.createTime = Tool.formatTime(item.orderCreateTime);
      //     // 礼包不显示产品描述
      //     // if (item.orderProductList[0].orderType == 98) item.orderProduct[0].spec=''
      //     // 这块是倒计时 
      //     if (item.status == 1) {
      //       let now = Tool.timeStringForDate(new Date(), "YYYY-MM-DD HH:mm:ss");
      //       secondMap.set(key, 1);
      //     }
      //     key++;
      //     datas.push(item);
      //   }
      //   this.setData({
      //     list: list.concat(datas),
      //     totalPage: req.responseObject.data.totalPage,
      //     secondArry: secondMap,
      //     key: key
      //   });
      //   if (!req.responseObject.data.totalPage) {
      //     this.setData({
      //       tipVal: 7
      //     });
      //   } else {
      //     this.setData({
      //       tipVal: ''
      //     });
      //   }
      //   // 这块是倒计时 暂时取消不做了
      //   if (secondMap.size > 0) {
      //     this.countdown(this);
      //   }
      // };
      // Tool.showErrMsg(r)
      // r.addToQueue();
    },
    // 上拉加载更多
    onReachBottom() {
      let { currentPage, totalPage } = this.data
      currentPage++
      if (totalPage >= currentPage) {
        this.setData({
          currentPage: currentPage
        })
        this.getData(this.data.num);
      }

    },
    //跳到订单详情
    toOrderDetail(e) {
      console.log(e.currentTarget.dataset.id, e.currentTarget.dataset.status,)
      Tool.navigateTo('/pages/my/orderDetail/orderDetail?orderId=' + e.currentTarget.dataset.id + '&status=' + e.currentTarget.dataset.status+'&num='+this.data.num)
    },
    //跳到物流页面
    logistics(e) {
      Tool.navigateTo('/pages/logistics/logistics?id=' + e.currentTarget.dataset.id)
    },
    //删除订单
    deleteItem(e) {
      let id = e.currentTarget.dataset.id;
      let status = e.currentTarget.dataset.status;
      this.setData({
        isDelete: true,
        orderId: id,
        status: status,
      });
      // this.deleteOrder()
    },
    dismissCancel() {
      //取消取消订单
      this.setData({
        isCancel: false,
        isDelete: false,
      })
    },
    deleteOrder() {
      let url = ''
      let reqName = ''
      if (this.data.status == 4 || this.data.status == 5 ) {//已完成订单/待确认
        url = Operation.deleteOrder
        reqName = '删除订单'
      } else {
        url = Operation.deleteClosedOrder
        reqName = '删除订单'
      }
      let params = {
        orderNum: this.data.orderId,
        url: url,
        reqName: reqName
      };
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        this.setData({
          list: []
        });
        this.getData(this.data.num);
      };
      r.completeBlock = (req) => {
        this.setData({
          isDelete: false,
        });
      }
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    cancelOrder() {
      this.setData({
        isCancel: false,
        list: [],
        key:0
      });
      this.getData(this.data.num);
    },
    cancelItem(e) {
      let orderNum = e.currentTarget.dataset.ordernum;
      this.setData({
        isCancel: true,
        orderNum: orderNum,
      });
    },
    //确认收货
    confirmReceipt(e) {
      let content = '确认收货吗?'
      let index = e.currentTarget.dataset.index;
      let id = e.currentTarget.dataset.id;
      let list = this.data.list[index]
      list.orderProductList.forEach((item,index)=>{
        let returnProductStatus = item.returnProductStatus || 99999
        // returnProductStatus < 6 && returnProductStatus!=3
        if (returnProductStatus ==1){
          content = '确认收货将关闭' + this.data.returnTypeArr[item.returnType]+"申请，确认收货吗？"
        }
      })
      let that = this;
      Tool.showComfirm(content, function () {
        let params = {
          orderNum: id,
          reqName: '确认收货',
          url: Operation.confirmReceipt,
        }
        let r = RequestFactory.wxRequest(params);
        r.successBlock = (req) => {
          that.setData({
            list: []
          });
          that.getData(that.data.num);
        };
        Tool.showErrMsg(r);
        r.addToQueue();
      })
    },
    //立即支付
    continuePay(e) {
      let item = e.currentTarget.dataset.item;
      let params = {
        totalAmounts: item.needPrice, //总价
        orderNum: item.orderNum, // 订单号
        outTradeNo: item.outTradeNo  // 流水号
      };
      Storage.setPayOrderList(params)
      Tool.navigateTo('/pages/order-confirm/pay/pay?door=1&isContinuePay=true')
    },
    //再次购买
    continueBuy(e) {
      let params = {
        id: e.currentTarget.dataset.id,
        reqName: '再次购买获取规格',
        url: Operation.orderOneMore,
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let datas = req.responseObject.data;
        let orderProducts = datas.orderProducts || []
        let list =[]
        orderProducts.forEach((item) => {
          list.push({
            productId:item.productId,
            priceId:item.priceId,
            amount:item.num,
            showCount:item.num,
            isSelect:true
          })
        });
        if(list.length>0){
          Storage.setShoppingCart(list);
          Event.emit('continueBuy');
          Tool.switchTab('/pages/shopping-cart/shopping-cart')
        }
      };
      Tool.showErrMsg(r);
      r.addToQueue();
    },
    /**
  * 倒计时
  */
  countdown(that) { // 倒计时
    clearTimeout(that.data.time);
    let mapArry = that.data.secondArry;
    let orderArry = that.data.list;
    for (let i = 0; i < orderArry.length; i++) {
      let order = orderArry[i];
      if (order.status == 1) {
        let second = mapArry.get(i);
        if (second) {//秒数>0
          let countdown = Tool.showDistanceTime(this.data.datas.countDownSeconds || 0)
          order.countDownTime = countdown + '后自动取消订单';
          mapArry.set(i, countdown);
        } else {
          //order.countDownTime = '交易关闭';
          clearTimeout(this.data.time);
          order.status = 8
          if (this.data.num == 1) {
            orderArry.splice(i, 1)
          }
          if (orderArry.length == 0) {
            this.setData({
              tipVal: 7
            })
          }
        }
      }
    }
    let time = setTimeout(function () {
      that.countdown(that);
    }, 1000)
    that.setData({
      list: orderArry,
      time: time
    })
  },
    initData0() {
      let datas = this.data.datas.data
      let secondMap = new Map()
      let key = this.data.key
      let orderInfoArr = []
      let warehouseOrderDTOList = datas.data.warehouseOrderDTOList || []
      datas.data.forEach((item, index) => {
        let warehouseOrderDTOList = item.warehouseOrderDTOList || []
        let outStatus = item.warehouseOrderDTOList[0].status
        if (outStatus == 1) {
          let showOrderList = []
          warehouseOrderDTOList.forEach((item1, index1) => {
            item1.products.forEach((item2) => {
              showOrderList.push(item2)
            })
          })
          orderInfoArr.push({
            ...item,
            showStatus: 1,
            showOrderNo: item.platformOrderNo,
            showProducts: showOrderList,
            showName: '平台级订单'
          })
        } else {
          warehouseOrderDTOList.forEach((item1, index1) => {
            orderInfoArr.push({
              ...item,
              showWarehouseInfo: {
                ...item1,
              },
              showStatus: item1.status,
              showOrderNo: item1.warehouseOrderNo,
              showProducts: item1.products,
              showName: '仓库级订单'
            })
          })
          delete orderInfoArr[index].showWarehouseInfo.products
        }
      })
      console.log(orderInfoArr)
    },
    // countdown: function (that) {
    //   clearTimeout(this.data.time);
    //   let mapArry = that.data.secondArry;
    //   let orderArry = that.data.list;
    //   for (let i = 0; i < orderArry.length; i++) {
    //     let order = orderArry[i];
    //     if (order.status == 1) {
    //       let second = mapArry.get(i);
    //       if (second) {//秒数>0
    //         // let countDownTime = Tool.timeStringForTimeCount(second);
    //         // let endTime = Tool.formatTime(order.shutOffTime)
    //         // let countdown = Tool.getDistanceTime(endTime, this,1)
    //         // let countdown = Tool.timeCountdown('time', 'distanceTime', 'countDownSeconds', callBack, this) 
    //         order.countDownTime = countdown + '后自动取消订单';
    //         mapArry.set(i, countdown);
    //       } else {
    //         //order.countDownTime = '交易关闭';
    //         clearTimeout(this.data.time);
    //         order.status = 8
    //         if(this.data.num==1){
    //           orderArry.splice(i,1)
    //         }
    //         if (orderArry.length==0){
    //           this.setData({
    //             tipVal:7
    //           })
    //         }
    //         // this.setData({
    //         //   list: orderArry
    //         // })
    //       }
    //     }
    //   }

    //   let time = setTimeout(function () {
    //     that.countdown(that);
    //   }, 1000)

    //   that.setData({
    //     list: orderArry,
    //     time: time
    //   });
    // },
    onUnload(){
      clearTimeout(this.data.time);
    },
  },
  ready: function () {
    //this.getData(this.properties.num);
    // this.initData0()
  },
  
})
