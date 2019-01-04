let {Tool, Storage, Event, API, Config} = global


Page({
    data: {
        didLogin: false,
        selectAll: false, //是否全选
        items: [], // 保存购物车的数据
        totalPrice: 0, // 总价
        selectList: [], //选中的产品
        tipVal: '',
        activeType: ["", "秒", "降", "优惠套餐", "助力免费领", "支付有礼", "满减送", "刮刮乐"],
        ysf: {title: '购物车'},
        statusImg: {
            0: Config.imgBaseUrl + 'shixiao-icon.png',
            1: '',
            2: Config.imgBaseUrl + 'shixiao-icon.png',
            3: Config.imgBaseUrl + 'advanxeSale-icon.png',
        }
    },
    onLoad: function (options) {
        this.getLoginCart()
        Event.on('updateShoppingCart', this.getShoppingCartList, this)
        Event.on('updateStorageShoppingCart', this.getRichItemList, this)
        Event.on('didLogin', this.getLoginCart, this);
        Event.on('continueBuy', this.shoppingCartLimit, this);
    },
    onShow: function () {

    },
    updateShoppingCartByEmit(){
        this.setData({
            isUpdateCart: true
        })
    },
    onPullDownRefresh: function () {
        this.setData({
            items: []
        })
        this.initDatas()
        wx.stopPullDownRefresh();
    },
    getLoginCart(){
        Tool.didLogin(this)
        this.initDatas()
    },
    initDatas(){
        if (this.data.didLogin) {
            let hasStorageShoppingCart = this.hasStorageShoppingCart()
            if (hasStorageShoppingCart) {
                this.shoppingCartLimit()
            } else {
                this.getShoppingCartList()
            }
        } else {
            this.setData({
              items: [],
            })
            this.getStorageShoppingCart()
        }
    },
    hasStorageShoppingCart(){
        let list = Storage.getShoppingCart() || []
        if (list.length) {
            this.setData({
                items: list,
            })
            if (list.showPrice) { // 从详情页进来的有价格 从再次购买进入的没有价格 防止报错
                this.getTotalPrice()
            }
            this.data.hasStorage = true
            return true
        } else {
            this.data.hasStorage = false
            return false
        }
    },
    getFormCookieToSessionParams(){
        let list = Storage.getShoppingCart() || []
        if (!list.length) return
        this.setData({
            items: list,
        })
        let isArrParams = []
        for (let i = 0; i < list.length; i++) {
            isArrParams.push({
                spuCode: list[i].spuCode, skuCode: list[i].skuCode, amount: list[i].showCount
            })
        }
        return isArrParams
    },
    getRichItemList(){
        let isArrParams = this.getFormCookieToSessionParams()
        API.getRichItemList({
            shoppingCartParamList: isArrParams,
        }).then((res) => {
            this.formatShoppingListData(res)
        }).catch((res) => {

        })
    },
    shoppingCartLimit() { //登录合并购物车 或者 再来一单的时候批量加入购物车
        let isArrParams = this.getFormCookieToSessionParams()
        API.addToShoppingCart({
            shoppingCartParamList: isArrParams,
        }).then((res) => {
            Storage.clearShoppingCart()
            this.data.hasStorage = true
            this.getShoppingCartList()
            // this.formatShoppingListData(res)
        }).catch((res) => {
            console.log(res)
        })
    },
    getStorageShoppingCart(){
        let list = Storage.getShoppingCart() || []
        if (list.length) {
            this.getRichItemList()
        } else {
            this.setData({
                tipVal: 3
            })
        }
    },
    getShoppingCartList(){ // 查询购物车
        API.getShoppingCartList({}).then((res) => {
            this.formatShoppingListData(res)
        }).catch((res) => {
            console.log(res)
        })
    },
    formatShoppingListData(req){ // 格式化购物车的数据
        let data = req.data || {}
        let datas = []
        data.shoppingCartGoodsVOS = data.shoppingCartGoodsVOS || []
        data.shoppingCartFailedGoodsVOS = data.shoppingCartFailedGoodsVOS || []
        if(!data.shoppingCartGoodsVOS.length&&!data.shoppingCartFailedGoodsVOS.length){
              this.setData({
                tipVal: 3,
                items: []
              })
            return
        }
        for (let i in data) {
            let isFailed = i == 'shoppingCartFailedGoodsVOS' ? true : false
            let myDatas = data[i] || []
            myDatas.forEach((item, index)=> {
                item.isTouchMove = false  //是否移动
                item.activityType = item.activityType === null ? 0 : item.activityType
                item.labelName = this.data.activeType[item.activityType]
                if (item.activityType) {
                    let currentTime = new Date().getTime();
                    item.isBegin = item.activityBeginTime > currentTime ? false : true
                    item.isEnd = item.activityEndTime > currentTime ? false : true
                }
                item.products.forEach((item0, index0)=> {
                    item0.isTouchMove = false  //是否移动
                    item0.showImg = item0.imgUrl
                    item0.statusImg = this.data.statusImg[item0.productStatus]
                    if (!item0.sellStock) {
                        item0.statusImg = this.data.statusImg[0]
                    }
                    if ((!item0.sellStock || item0.productStatus == 1 || item0.productStatus == 3) && !isFailed) {
                        item0.disabled = false
                    } else {
                        item0.disabled = true
                    }
                    item0.stock = item0.sellStock || 0
                    item0.showPrice = item0.price
                    item0.showName = item0.productName
                    item0.showType = item0.specTitle? item0.specTitle.split("@").join('—') : ''
                    item0.showCount = item0.amount || 1  // 商品数量
                    item0.isSelect = false  //是否选择
                    if (this.data.items.length > 0) {
                        if(!this.data.hasStorage && this.data.didLogin){
                            let arr = this.data.items[0]
                            arr.forEach((arrItem)=>{
                                arrItem.list.forEach((listItem)=>{
                                    listItem. products.forEach((prd)=>{
                                        if (prd.skuCode == item0.skuCode && item0.productStatus == 1 )   item0.isSelect = prd.isSelect
                                    })
                                })
                            })
                        } else {
                            let arr = this.data.items
                            arr.forEach((arrItem)=>{
                                if (arrItem.skuCode == item0.skuCode && item0.productStatus == 1 )   item0.isSelect = arrItem.isSelect
                            })
                        }
                    }
                })
            })
            datas.push({
                isFailed: isFailed,
                list: myDatas
            })
        }
        this.data.hasStorage = false
        this.setData({
            items: datas,
            tipVal: ''
        })
        this.isSelectAllPrd()
        this.getTotalPrice()
    },
    deleteClicked(e){
        let items = e.detail.items
        let itemkey = e.detail.itemkey
        let prodskey = e.detail.prodskey
        let key = e.detail.index
        if (e.detail.index !== undefined) {
            let params = [{
                skuCode: items[key].skuCode
            }]
            if (!this.data.didLogin) {
                this.deleteStorageShoppingCart(params)
                return
            }
            this.deleteCart(params)
        }
        this.data.items[itemkey].list[prodskey].products = items
        this.setData({
            items: this.data.items
        })
        this.getTotalPrice()
    },
    clearItems(){ // 清楚失效宝贝
        let prods = this.data.items[1]
        let params = []
        prods.list.forEach((list)=>{
            list.products.forEach((item)=>{
                params.push({
                    skuCode: item.skuCode
                })
            })
        })
        if (!this.data.didLogin) {
            this.deleteStorageShoppingCart(params)
            return
        }
        this.deleteCart(params)
    },
    deleteCart(params) {  // 删除购物车
        API.deleteShoppingCart({
            skuCodes: params
        }).then((res) => {
            this.formatShoppingListData(res)
        }).catch((res) => {
            console.log(res)
        })
    },
    deleteStorageShoppingCart(params=[]){
        let list = Storage.getShoppingCart() || []
        params.forEach((item1,index1)=>{
            list.forEach((item2,index2)=>{
                if(item2.skuCode==item1.skuCode) list.splice(index2,1)
            })
        })
        Storage.setShoppingCart(list)
        this.initDatas()
    },
    chooseClicked(e){
        // 点击选择 data-key="{{key0}}" data-itemkey="{{index}}" data-prodskey="{{key}}"
        let key = e.currentTarget.dataset.key
        let itemkey = e.currentTarget.dataset.itemkey
        let prodskey = e.currentTarget.dataset.prodskey
        let prdList = this.data.items[itemkey].list[prodskey].products
        if (!prdList[key].sellStock || prdList[key].productStatus != 1) {
            return
        }
        prdList[key].isSelect = !prdList[key].isSelect

        this.setData({
            items: this.data.items
        })
        this.isSelectAllPrd()
        this.getTotalPrice()

    },
    isSelectAllPrd(){ //是否选中了所有商品
        let selectAllArr = []
        let selectAll = false
        let list = this.data.items[0].list
        let productsNum = 0
        list.forEach((item, index)=> {
            productsNum += item.products.length
            item.products.forEach((item1, index1)=> {
                if (item1.isSelect) {
                    selectAllArr.push(item1)
                }
            })
        })
        if (selectAllArr.length == productsNum) {
            selectAll = true
        }
        this.setData({
            selectAll: selectAll
        })
    },
    selectAllClicked(){
        //点击全选
        let num = 0
        let selectAll = this.data.selectAll
        let list = this.data.items[0].list
        list.forEach((item, index)=> {
            item.products.forEach((item1, index1)=> {
                if (item1.sellStock && item1.productStatus == 1) {
                    num++;
                    item1.isSelect = !selectAll
                }
            })
        })
        if (num) {
            this.setData({
                selectAll: !selectAll,
                items: this.data.items
            })
            this.getTotalPrice()
        }
    },
    getTotalPrice(index){
        let list = this.data.items[0].list
        let orderProducts = []
        let expProducts = []
        let totalPrice = 0
        // 选中的 且有效的 且库存大于0 的计算价格
        list.forEach((item, index)=> {
            let datas = null
            if (item.activityType == 8) {
                datas = item
                datas.selectExpProd = []
                datas.showRule = null
            }
            item.products.forEach((item1, index1)=> {
                if (item1.isSelect && item1.sellStock && item1.productStatus == 1) {
                    let unitPrice = Tool.mul(item1.showCount, item1.showPrice)
                    totalPrice = Tool.add(totalPrice, unitPrice)
                    orderProducts.push({
                        quantity: item1.showCount,
                        skuCode: item1.skuCode,
                        productCode: item1.productCode
                    })
                    if (item.activityType == 8) {
                        // 经验值渲染
                        datas.selectExpProd.push(item1)
                        this.getExpProductsInfo(datas)
                    }
                }
            })
        })
        this.setData({
            totalPrice: totalPrice,
            selectList: orderProducts,
            items: this.data.items
        })
    },
    getExpProductsInfo(datas){ // 经验值渲染
        let rules = datas.rules
        let totalPrice = 0
        datas.selectExpProd.forEach((item, index)=> {
            totalPrice += (item.price * item.showCount)
        })
        let arr = rules.filter((item)=> {
            console.log(item.startPrice,totalPrice)
            return item.startPrice < totalPrice
        })
        console.log(arr)
        if (arr.length > 0) {
            // 已经满足至少1条规矩了
            datas.showRule = {...arr[arr.length - 1]}
            datas.showRule.couponNum = Math.floor(totalPrice / datas.startPrice) * datas.startCount
        } else {
            // 一条规则都没有满足
            datas.showRule = [...rules[0]]
            datas.showRule.couponNum = Math.ceil(totalPrice / datas.startPrice) * datas.startCount
            datas.showRule.differ = datas.showRule.startPrice - totalPrice
        }
        datas.showRule.couponNum = datas.showRule.couponNum > datas.maxCount ? datas.maxCount : datas.showRule.couponNum
    },
    cartProductClicked(e){
        let index = e.currentTarget.dataset.index
    },
    counterInputOnChange(e) {
        // 数量变化的时候
        let count = e.detail.innerCount;
        // let index = e.detail.e.currentTarget.dataset.index
        let index = e.detail.index
        let prodskey = e.detail.prodskey
        let btnName = e.detail.e.currentTarget.dataset.name
        let list = this.data.items[0].list[prodskey].products
        // let id = list[index].id
        //  点击了加按钮 那么不做操作 而且超过库存了
        if (btnName != 'reduce' && list[index].sellStock < count) {
            count = list[index].showCount = list[index].sellStock || 0
            let callBack = ()=> {
                this.updateShoppingCartWay(count, list[index])
            }
            Tool.showAlert('库存不足', callBack)
            this.setData({
                items: this.data.items
            })
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
        this.updateShoppingCartWay(count, list[index], index)
        this.getTotalPrice()
    },
    updateShoppingCartWay(count, item, index){
        if (index !== undefined) {
            if (!this.data.didLogin) {
                this.updateStorageShoppingCart(count, index)
            } else {
                this.updateShoppingCart(count, item)
            }
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
    updateShoppingCart(count, item) {  // 更新购物车
        // let prd = this.data.items[index]
        API.updateShoppingCart({
            id: item.id,
            amount: count,
        }).then((res) => {
            // let list = this.data.items
            item.showCount = count
            this.setData({
                items: this.data.items
            })
            this.getTotalPrice()
        }).catch((res) => {

        })
    },
    makeOrder(){
        // 如果没有登录 那么就跳转到登录页面
        if (!this.data.didLogin) {
            Tool.navigateTo('/pages/login-wx/login-wx?isBack=' + true)
            return
        }
        if (this.data.selectList.length == 0) {
            Tool.showAlert('请选择要购买的商品')
            return
        }
        Storage.setSubmitOrderList({
            orderProductList: this.data.selectList,
            orderType: 1
        })
        Tool.navigateTo(`/pages/order-confirm/order-confirm?type=99&formPage=1`)
    },
    cartProductClicked(e){
        let state = e.currentTarget.dataset.state
        if (state == 1 || state == 3) {
            Tool.navigateTo('/pages/product-detail/product-detail?door=100&prodCode=' + e.currentTarget.dataset.id)
        }
    },
    collectBills(){ //去凑单
        Tool.navigateTo('/pages/product-detail/product-detail')
    },
    lookAround(){
        Tool.switchTab('/pages/index/index')
    },
    onUnload: function () {
        Event.off('updateStorageShoppingCart', this.getStorageShoppingCart);
        Event.off('updateShoppingCart', this.getShoppingCartList);
        Event.off('didLogin', this.didLogin);
        Event.on('continueBuy', this.shoppingCartLimit);
    },
    test(){
        // 阻止冒泡
        console.log('阻止冒泡')
    }
})