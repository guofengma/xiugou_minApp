// assets/TemplateName.js
let { Tool, RequestFactory, Storage, Event, Operation, API } = global;
import ProductFactorys from "../product-detail/temp/product.js";
//gateway/operator/act-exp/detail
Page({
  /**
   * 页面的初始数据
   */
  data: {
    productInfo: "", // 商品信息
    code: "JF201812270017", //经验分区code
    productCode: "SPU00000324",
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
    size: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.ProductFactory = new ProductFactorys(this);
    this.didLogin();
    this.getNewProd();
    this.getOperatorDetail();
    Tool.isIPhoneX(this);
    Event.on("didLogin", this.didLogin, this);
  },
  getOperatorDetail() {
    API.getOperatorDetail({ activityCode: this.data.code }).then(res => {
      let datas = res.data || {};
      this.setData({
        prodList: datas.prods,
        operatorDetail: datas,
        productCode: datas.prods[0].spuCode
      });
      this.getNewProd();
    });
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
        // this.selectComponent("#active-info").changgeState('false')
        break;
      case "prodParms":
        this.setData({
          prodParms: !this.prodParms,
          movePrevent: !this.movePrevent
        });
        break;
      default:
      // this.setData({
      //   movePrevent: !this.movePrevent
      // });
    }
  },
  imgCliked(event) {
    const urls = [],
      current =
        "https://testcdn.sharegoodsmall.com/sharegoods/f438465242f04063a11906cc4c1884dc.jpg?x-oss-process=image/resize,p_65";
    for (let i = 0; i < 4; i++) {
      urls.push(current);
    }
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    });
  },
  btnClicked(e) {
    let n = parseInt(e.currentTarget.dataset.key);
    if (
      this.data.productInfo.canUserBuy ||
      (n == 1 && this.data.productInfo.productStatus != 2)
    ) {
      this.selectComponent("#prd-info-type").isVisiableClicked(n);
    }
  },
  hiddenTips() {
    this.ProductFactory.hiddenTips();
  },
  counterInputOnChange(e) {
    this.setData({
      productBuyCount: e.detail
    });
  },
  typeSubClicked(e) {
    this.setData({
      selectType: e.detail
    });
    if (this.data.selectType.typeClicked === 1) {
      this.addToShoppingCart(1);
    } else if (this.data.selectType.typeClicked === 2) {
      this.makeSureOrder();
    }
  },
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
    Tool.navigateTo(
      "/pages/order-confirm/order-confirm?params=" +
        JSON.stringify(params) +
        "&type=99"
    );
  },
  addToShoppingCart() {
    this.ProductFactory.addToShoppingCart();
  },

  selectProd(e) {
    let index = e.currentTarget.dataset.key;
    // 减少重复请求
    if (this.data.showIndex !== -1) {
      this.setData({
        showIndex: index,
        productCode: this.data.prodList[index].spuCode
      });
      this.getNewProd();
    }
  },
  getNewProd() {
    const callBack = res => {
      let total = res.skuList.reduce((acc, cur) => {
        return acc + cur.sellStock;
      }, 0);
      res.totalStock = total;
      this.setData({
        productInfo: res
      });
      if (res.productStatus != 0) {
        // this.activityByProductId(this.data.productCode);
        if (this.data.productInfo.productStatus === 3) {
          this.data.distanceTime = Math.ceil(
            (this.data.productInfo.upTime - this.data.productInfo.now) / 1000
          );
          //   this.countdown(this);
        }
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
