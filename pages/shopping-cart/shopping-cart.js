let { Tool, RequestFactory, Storage, Event, Operation } = global


Page({
  data: {
    didLogin:false,
    selectAll:false, //是否全选
    items:[], // 保存购物车的数据
    totalPrice:0, // 总价
    selectList:[], //选中的产品
    tipVal:'',
    ysf: { title: '购物车' }
  },
  onLoad: function (options) {
    this.getLoginCart()
    Event.on('updateShoppingCart', this.getShoppingCartList, this)
    Event.on('updateStorageShoppingCart', this.getStorageShoppingCart, this)
    Event.on('didLogin', this.getLoginCart, this);
    Event.on('continueBuy', this.shoppingCartLimit, this);
  },
  onShow: function () {

  },
  getLoginCart(){
    Tool.didLogin(this)
    this.getRichItemList()
    if (this.data.didLogin) {
      let hasStorageShoppingCart = this.hasStorageShoppingCart()
      if (hasStorageShoppingCart){
        this.shoppingCartLimit()
      } else {
        this.getShoppingCartList()
      }
    } else {
      this.getFormCookieToSessionParams()
      this.getStorageShoppingCart()
    }
  },
  hasStorageShoppingCart(){
    let list = Storage.getShoppingCart()
    if(list){
      this.setData({
        items: list,
      })
      if (list.showPrice) { // 从详情页进来的有价格 从再次购买进入的没有价格 防止报错
        this.getTotalPrice()
      }
      return true
    } else {
      return false 
    }
  },
  getFormCookieToSessionParams(){
    let list = Storage.getShoppingCart()
    if (!list) return
    this.setData({
      items: list,
    })
    let isArrParams = []
    for (let i = 0; i < list.length; i++) {
      isArrParams.push({
        productId: list[i].productId, priceId: list[i].priceId, amount: list[i].showCount
      })
    }
    return JSON.stringify(isArrParams)
  },
  getRichItemList(){
    let isArrParams = this.getFormCookieToSessionParams()
    let params = {
      frontItemListCache: isArrParams,
      reqName: '未登录时，获取购物车详细信息列表',
      url: Operation.getRichItemList,
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  shoppingCartLimit(){
    let isArrParams = this.getFormCookieToSessionParams()
    let params = {
      frontItemListCache: isArrParams,
      reqName: '登录合并购物车',
      url: Operation.shoppingCartFormCookieToSession,
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      Storage.clearShoppingCart()
      this.getShoppingCartList()
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  getStorageShoppingCart(){   
    let list = Storage.getShoppingCart()
    if(list){
      this.setData({
        items:list,
        tipVal: ''
      }) 
      this.isSelectAllPrd(list)
      this.getTotalPrice()
    } else {
      this.setData({
        tipVal: 2
      })
    }
  },
  updateStorageShoppingCart(count, index){
    let list = this.data.items
    list[index].showCount = count
    this.setData({
      items: list,
    })
    this.getTotalPrice()
    Storage.setShoppingCart(list)
  },
  updateShoppingCart(count,index){
    // 更新购物车
    let prd = this.data.items[index]
    let params = {
      priceId: prd.priceId,
      amount: count,
      reqName: '更新购物车数量',
      isShowLoading: false,
      url: Operation.updateShoppingCart,
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let list = this.data.items
      list[index].showCount = count
      this.setData({
        items: list
      })
      this.getTotalPrice()
    };
    r.addToQueue();
  },
  getShoppingCartList(){
    // 查询购物车
    // let r = RequestFactory.getShoppingCartList();
    let params = {
      reqName: '获取购物车',
      url: Operation.getShoppingCartList,
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let data = req.responseObject.data
      data = data ===null? []:data
      if(data.length>0){
        data.forEach((item, index) => {
          item.isTouchMove = false  //是否移动 
          item.showImg = item.imgUrl
          item.showPrice = item.price
          item.showName = item.productName
          item.showType = item.specValues.join('—')
          item.showCount = item.amount || 1  // 商品数量
          item.isSelect = false  //是否选择 
          if(this.data.items.length>0){
            let arr = this.data.items
            for(let i=0;i<arr.length;i++){
              if(arr[i].id==item.id){
                item.isSelect = arr[i].isSelect
              }
            }
          }
        })
        this.setData({
          items: data,
          tipVal:''
        })
        this.isSelectAllPrd(data)
        this.getTotalPrice()
      } else {
        this.setData({
          tipVal: 2,
          items:[]
        })
      }
    };
    r.addToQueue();
  },
  deleteClicked(e){
    let items = e.detail.items
    if (e.detail.index !== undefined){
      if(!this.data.didLogin){
        this.deleteStorageShoppingCart(e.detail.index)
        return 
      }
      this.deleteCart(items, e.detail.index)
    }
    this.setData({
      items: items
    })
    this.getTotalPrice()
  },
  chooseClicked(e){
    // 点击选择
    let index = e.currentTarget.dataset.index 
    let prdList = this.data.items
    prdList[index].isSelect = !prdList[index].isSelect
    this.isSelectAllPrd(prdList)
    this.setData({
      items: prdList
    })
    this.getTotalPrice()
  },
  isSelectAllPrd(list){ //是否选中了所有商品
    let selectAllArr = []
    let selectAll = false
    for (let i = 0; i < list.length; i++) {
      if (list[i].isSelect === true) {
        selectAllArr.push(list[i])
      }
    }
    if (selectAllArr.length == list.length) {
      selectAll = true
    }
    this.setData({
      selectAll: selectAll
    })
  },
  getTotalPrice(index){
    let items = this.data.items
    let orderProducts = []
    let totalPrice = 0
    for (let i = 0; i<items.length;i++){
      // 选中的 且有效的 且库存大于0 的计算价格
      if (items[i].isSelect && items[i].productStatus == 4 && items[i].stock>0){
        // totalPrice += items[i].showCount * items[i].showPrice
        let unitPrice = Tool.mul(items[i].showCount,items[i].showPrice)
        totalPrice = Tool.add(totalPrice, unitPrice)
        // let list = { "price_id": items[i].id, "num": items[i].showCount }
        
        orderProducts.push({
          num: items[i].showCount,
          priceId: items[i].id,
          productId: items[i].product_id
        })
        // selectList.push(orderProducts)
      }
    }
    this.setData({
      totalPrice: totalPrice,
      selectList: orderProducts
    })
  },
  cartProductClicked(e){
    let index = e.currentTarget.dataset.index
  },
  counterInputOnChange(e) {
    // 数量变化的时候 
    let count = e.detail.innerCount;
    let index = e.detail.e.currentTarget.dataset.index
    let btnName = e.detail.e.currentTarget.dataset.name
    let list = this.data.items

    //  点击了加按钮 那么不做操作 而且超过库存了
    if (btnName != 'reduce' && list[index].stock < count && count == 200) {
      count = list[index].showCount=list[index].stock
      let callBack = ()=>{
        this.updateShoppingCartWay(count, index)
      }
      Tool.showAlert('库存不足', callBack)
      this.setData({
        items: list
      })
      // return
    }

    //如果最多只能购买200件 不让再加了
    if (count == 200) {
      this.setData({
        items: this.data.items
      })
    }
    // 本次修改和上次修改一样的情况
    
    if (list[index].showCount == count) return

    //收到输入为空和0 的情况 

    if (!count || count == 0) return

    
    //数量为1的情况下不让减

    if (btnName == 'reduce' && list[index].showCount == 1) return 
    this.updateShoppingCartWay(count, index)
    this.getTotalPrice()
  },
  updateShoppingCartWay(count, index){
    if (index !== undefined) {
      if (!this.data.didLogin) {
        this.updateStorageShoppingCart(count, index)
      } else {
        this.updateShoppingCart(count, index)
      }
    }
  },
  deleteCart(items,index){
    // 删除购物车
    let params = {
      priceId: items[index].priceId,
      reqName: '删除购物车',
      url: Operation.deleteFromShoppingCart,
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      items.splice(index, 1)
      this.setData({
        items: items
      })
      if (items.length == 0) {
        this.setData({
          tipVal: 2
        })
      }
      this.isSelectAllPrd(items)
      this.getTotalPrice()
    };
    r.addToQueue();
  },
  deleteStorageShoppingCart(index){
    let list = this.data.items
    list.splice(index,1)
    this.setData({
      items: list,
    })
    this.getTotalPrice()
    Storage.setShoppingCart(list)
  },
  selectAllClicked(){
    //点击全选 
    let items = this.data.items
    let selectAll = this.data.selectAll
    for (let i = 0; i < items.length; i++) {
      items[i].isSelect = !selectAll
    }
    this.setData({
      selectAll: !selectAll,
      items: items
    })
    this.getTotalPrice()
  },
  makeOrder(){
    let params = JSON.stringify({
      orderProducts:this.data.selectList,
      orderType: 99
    })
    
    // 如果没有登录 那么就跳转到登录页面
    
    if(!this.data.didLogin){
      Tool.navigateTo('/pages/login/login-wx/login-wx?isBack=' + true)
      return
    }
    if (this.data.selectList.length==0){
      Tool.showAlert('请选择要购买的商品')
      return
    }
    
    Tool.navigateTo('/pages/order-confirm/order-confirm?params=' + params+'&type=2')
  },
  cartProductClicked(e){
    let state = e.currentTarget.dataset.state
    if(state == 4) {
      Tool.navigateTo('/pages/product-detail/product-detail?productId=' + e.currentTarget.dataset.id)
    }
  },
  onUnload: function () {
    Event.off('updateStorageShoppingCart', this.getStorageShoppingCart);
    Event.off('updateShoppingCart', this.getShoppingCartList);
    Event.off('didLogin', this.didLogin);
  },
  test(){
    // 阻止冒泡 
    console.log('阻止冒泡')
  }
})