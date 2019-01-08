// assets/TemplateName.js
let { Tool, RequestFactory, Storage, Event, Operation, API } = global;
import ProductFactorys from "../product-detail/temp/product.js";
//gateway/operator/act-exp/detail
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    productInfo: {}, // 商品信息
    activityCode: "", //经验分区code JF201901030055
    productCode: "", //产品code SPU00000324
    operatorDetail: {}, //经验值详情
    showIndex: 0, //展示第几个商品
    prodList: [], //产品列表
    // 弹窗
    activeInfo: false, //活动信息
    prodParms: false, //产品参数
    movePrevent: false, //是否阻止滚动
    productBuyCount: 1, //商品购买数量
    scrollHide: false, //滚动是否隐藏列表图片
    priceList: [],
    size: 0,
    scrollLeft: 0 //同步滚动距离
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.ProductFactory = new ProductFactorys(this);
    this.didLogin();
    // this.getNewProd();
    this.init(options);
    Tool.isIPhoneX(this);
    Event.on("didLogin", this.didLogin, this);
  },
  init(options) {
    if (options.activityCode) {
      this.setData({
        activityCode: options.activityCode
      });
    } else {
      Tool.showAlert("活动不存在，请稍后重试");
      return;
    }
    if (options.productCode) {
      this.getOperatorDetail(options.productCode);
    } else {
      this.getOperatorDetail();
    }
  },
  getOperatorDetail(productCode) {
    API.getOperatorDetail({ code: this.data.activityCode })
      .then(res => {
        let datas = res.data || {};
        datas.start_time = this.formatTime(datas.startTime)
        datas.sellstate = 0;//默认在活动中
        if(datas.startTime > new Date().getTime()){
            datas.sellstate = 1
        }else if(datas.endTime < new Date().getTime()){
            datas.sellstate = 2
        }
        this.setData({
          prodList: datas.prods,
          operatorDetail: datas,
          productCode: productCode ? productCode : datas.prods[0].spuCode
        });
        if (productCode) {
          datas.prods.some((item, index) => {
            if (item.spuCode === productCode) {
              this.showIndex = index;
              return true;
            }
          });
        }
        this.getNewProd();
      })
      .catch(res => {
        Tool.showAlert("活动不存在，请稍后重试");
        console.log(res);
      });
  },
  formatTime(timestamp) {
    let date = new Date(timestamp);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return (
        month +'月'+day+'日'+[hour, minute].map(Tool.formatNumber).join(":")
    );
  },
  //   打开弹层
  changgeState(event) {
    const type = event.currentTarget.dataset.select;
    switch (type) {
      case "activeInfo":
        this.setData({
          activeInfo: !this.activeInfo,
          movePrevent: !this.movePrevent
        });
        break;
      case "prodParms":
        this.setData({
          prodParms: !this.prodParms,
          movePrevent: !this.movePrevent
        });
        break;
      default:
        break;
    }
  },
  //大图展示
  imgCliked(event) {
    let urls = [];
    this.data.imgUrls.forEach(item => {
      if (item.smallImg) {
        urls.push(item.smallImg);
      }
    });
    wx.previewImage({
      current: this.data.imgUrls[0].smallImg, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    });
  },
  // 滚动同步
  togetherScroll(e) {
    this.setData({
      scrollLeft: e.detail.scrollLeft
    });
  },
  //   搜索产品信息
  btnClicked(e) {
    let n = parseInt(e.currentTarget.dataset.key);
    if (
      this.data.productInfo.canUserBuy ||
      (n == 1 && this.data.productInfo.productStatus != 2)
    ) {
      this.selectComponent("#prd-info-type").isVisiableClicked(n);
    }
  },
  //   产品加入数量
  counterInputOnChange(e) {
    this.setData({
      productBuyCount: e.detail
    });
  },
  //   规格选择确认
  typeSubClicked(e) {
    this.setData({
      selectType: e.detail
    });
    if (this.data.selectType.typeClicked === 1) {
      this.addToShoppingCart();
    } else if (this.data.selectType.typeClicked === 2) {
      this.makeSureOrder();
    }
  },
  // 立即购买
  makeSureOrder() {
    // 立即购买
    if (!this.data.didLogin) {
      Tool.navigateTo(
        "/pages/login-wx/login-wx?isBack=" +
          true +
          "&inviteId=" +
          this.data.inviteCode
      );
      return;
    }
    let params = {
      orderProductList: [
        {
          quantity: this.data.productBuyCount,
          skuCode: this.data.selectType.skuCode,
          productCode: this.data.selectType.prodCode
        }
      ],
      orderType: 1
    };
    Storage.setSubmitOrderList(params);
    Tool.navigateTo("/pages/order-confirm/order-confirm?formPage=3");
  },
  //   添加购物车
  addToShoppingCart() {
    this.ProductFactory.addToShoppingCart(this.productCode, 8);
  },
  // 产品列表点击
  selectProd(e) {
    let index = e.currentTarget.dataset.key;
    // 减少重复请求
    if (this.data.showIndex !== index) {
      this.setData({
        showIndex: index,
        productCode: this.data.prodList[index].spuCode
      });
      this.getNewProd();
    }
  },
  //   获取产品信息
  getNewProd() {
    this.setData({
      productInfo: {},
      imgUrls: [],
      productBuyCount: 1,
      productSpec: [],
    });
    const callBack = res => {
      //   let total = res.skuList.reduce((acc, cur) => {
      //     return acc + cur.sellStock;
      //   }, 0);
      //   res.totalStock = total;
      //   this.setData({
      //     productInfo: res
      //   });
      if (res.productStatus != 0) {
        // this.activityByProductId(this.data.productCode);
        // if (this.data.productInfo.productStatus === 3) {
        //   this.data.distanceTime = Math.ceil(
        //     (this.data.productInfo.upTime - this.data.productInfo.now) / 1000
        //   );
        //   //   this.countdown(this);
        // }
      } else {
        this.ProductFactory.productDefect();
      }
    };
    this.ProductFactory.requestFindProductByIdApp(callBack);
  },
  didLogin() {
    this.ProductFactory.didLogin();
  },
  goCart() {
    this.ProductFactory.cartClicked();
  },
  //   页面滚动设置列表样式
  onPageScroll(e) {
    if (e.scrollTop > 100) {
      this.setData({
        scrollHide: true
      });
    } else {
      this.setData({
        scrollHide: false
      });
    }
  },
  hiddenTips() {
    this.ProductFactory.hiddenTips();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    Event.off("didLogin", this.didLogin);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
