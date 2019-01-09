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
    updateShoppingCartDatas(key){
        this.data[key] = true
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
    initDatas(){ // 初始化请求
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
    hasStorageShoppingCart(){ // 判断本地是否有缓存的购物车数据
        let list = Storage.getShoppingCart() || []
        if (list.length) {
            return true
        } else {
            return false
        }
    },
    shoppingCartLimit() { //登录合并购物车 或者 再来一单的时候批量加入购物车
        let isArrParams = this.getReqParams()
        API.addToShoppingCart({
            shoppingCartParamList: isArrParams,
        }).then((res) => {
            Storage.clearShoppingCart()
            this.data.hasStorage = true
            this.getShoppingCartList()
        }).catch((res) => {
            console.log(res)
        })
    },
    getStorageShoppingCart(){ // 获取本地购物车数据
        let list = Storage.getShoppingCart() || []
        if (list.length) {
            this.getRichItemList()
        } else {
            this.setData({
                tipVal: 3
            })
        }
    },
    getRichItemList(){ // 未登录的情况下 获取本地缓存购物车的线上最新产品信息
        let isArrParams = this.getReqParams()
        API.getRichItemList({
            shoppingCartParamList: isArrParams,
        }).then((res) => {
            this.formatShoppingListData(res)
        }).catch((res) => {

        })
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
        if (!data.shoppingCartGoodsVOS.length && !data.shoppingCartFailedGoodsVOS.length) {
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
                item.products.forEach((item0, index0)=> {
                    let shoppingCartActivity = item0.shoppingCartActivity || []
                    if (item0.productStatus == 3) item0.showUpdateTime =  Tool.timeStringFromInterval(item0.upTime/1000, "MM月DD日")
                    item0.showActiveType = item.activityType
                    item0.showActiveCode = item.activityCode
                    if (shoppingCartActivity.length&&item0.productStatus == 1) {
                        // 当前时间戳
                        let currentTime = item.nowTime
                        shoppingCartActivity.forEach((activity, actIndex)=> {
                            if (item0.productStatus == 1) item0.labelName = this.data.activeType[activity.activityType]
                            if (activity.activityType == 1 || activity.activityType == 2) {
                                let activeType = {
                                    1: 'seckill',
                                    2: 'depreciate',
                                    3: '',
                                    8: 'experience'
                                }[activity.activityType]
                                item0.showActivity = {
                                    activityType: activity.activityType,
                                    isBegin: activity[activeType].beginTime > currentTime ? false : true,
                                    isEnd: activity[activeType].endTime > currentTime ? false : true
                                }
                            }
                        })
                    }
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
                    item0.showType = item0.specTitle ? item0.specTitle.split("@").join('—') : ''
                    item0.showCount = item0.amount || 1  // 商品数量
                    item0.isSelect = false  //是否选择
                    if (this.data.items.length > 0) {
                        if (!this.data.hasStorage && this.data.didLogin) {
                            let arr = this.data.items[0].list
                            arr.forEach((listItem)=> {
                                listItem.products.forEach((prd)=> {
                                    if (prd.skuCode == item0.skuCode && item0.productStatus == 1)   item0.isSelect = prd.isSelect
                                })
                            })
                        } else {
                            let arr = this.data.items
                            arr.forEach((arrItem)=> {
                                if (arrItem.skuCode == item0.skuCode && item0.productStatus == 1)   item0.isSelect = arrItem.isSelect
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
    deleteClicked(e){ // 点击删除购物车事件
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
        this.getTotalPrice()
    },
    clearItems(){ // 批量清除失效产品事件
        Tool.showComfirm('是否清空失效商品',()=>{
            let prods = this.data.items[1]
            let params = []
            prods.list.forEach((list)=> {
                list.products.forEach((item)=> {
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
        })
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
    deleteStorageShoppingCart(params = []){ // 未登录下 删除购物车
        let list = Storage.getShoppingCart() || []
        params.forEach((item1, index1)=> {
            list.forEach((item2, index2)=> {
                if (item2.skuCode == item1.skuCode) list.splice(index2, 1)
            })
        })
        Storage.setShoppingCart(list)
        this.initDatas()
    },
    chooseClicked(e){  // 点击选择
        let key = e.currentTarget.dataset.key
        let itemkey = e.currentTarget.dataset.itemkey
        let prodskey = e.currentTarget.dataset.prodskey
        let prdList = this.data.items[itemkey].list[prodskey].products
        if (!prdList[key].sellStock || prdList[key].productStatus != 1)  return
        prdList[key].isSelect = !prdList[key].isSelect

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
    selectAllClicked(){ //点击全选
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
                selectAll: !selectAll
            })
            this.getTotalPrice()
        }
    },
    getTotalPrice(index){ // 计算选中产品的价格
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
                        productCode: item1.spuCode
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
            let num = Tool.mul(item.price, item.showCount)
            totalPrice = Tool.add(totalPrice, num)
        })
        let arr = rules.filter((item)=> {
            return item.startPrice < totalPrice
        })
        if (arr.length > 0) {
            // 已经满足至少1条规矩了
            datas.showRule = {...arr[arr.length - 1]}
            datas.showRule.couponNum = Math.floor(totalPrice / datas.startPrice) * datas.startCount
        } else {
            // 一条规则都没有满足
            datas.showRule = {...rules[0]}
            datas.showRule.couponNum = Math.ceil(totalPrice / datas.startPrice) * datas.startCount
            datas.showRule.differ = Tool.sub(datas.showRule.startPrice, totalPrice)
        }
        datas.showRule.couponNum = datas.showRule.couponNum > datas.maxCount ? datas.maxCount : datas.showRule.couponNum
    },
    counterInputOnChange(e) { // 加减数量选择器事件
        // 数量变化的时候
        let count = e.detail.innerCount;
        let index = e.detail.index
        let prodskey = e.detail.prodskey
        let btnName = e.detail.e.currentTarget.dataset.name
        let list = this.data.items[0].list[prodskey].products
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

        // 更新购物车
        this.updateShoppingCartWay(count, list[index], index)
    },
    updateShoppingCartWay(count, item, index){ // 更新购物车的方式
        if (index !== undefined) {
            if (!this.data.didLogin) {
                this.updateStorageShoppingCart(count, item)
            } else {
                this.updateShoppingCart(count, item)
            }
        }
    },
    updateStorageShoppingCart(count, item){ // 未登录下 更新购物车
        let list = Storage.getShoppingCart() || []
        list.forEach((item0)=> {
            if (item0.skuCode == item.skuCode) {
                item0.showCount = count
                item.showCount = count
            }
        })
        this.getTotalPrice()
        Storage.setShoppingCart(list)
    },
    updateShoppingCart(count, item) {  // 更新购物车
        API.updateShoppingCart({
            id: item.id,
            amount: count,
        }).then((res) => {
            item.showCount = count
            this.getTotalPrice()
        }).catch((res) => {

        })
    },
    makeOrder(){ // 如果没有登录 那么就跳转到登录页面
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
    getReqParams(){ // 拼接购物车请求数据给接口
        let list = Storage.getShoppingCart() || []
        if (!list.length) return
        this.data.items = list
        let isArrParams = []
        for (let i = 0; i < list.length; i++) {
            isArrParams.push({
                spuCode: list[i].spuCode,
                skuCode: list[i].skuCode,
                amount: list[i].showCount,
                activityCode: list[i].activityCode || '',
                activityType: list[i].activityType || '',
            })
        }
        return isArrParams
    },
    cartProductClicked(e){ // 点击产品跳转页面
        let state = e.currentTarget.dataset.state
        let activityCode = e.currentTarget.dataset.code || ''
        let prodsType = e.currentTarget.dataset.type
        let id = e.currentTarget.dataset.id
        if (state == 1 || state == 3) {
            if (prodsType == 8) {
                // 跳转到经验专区
                Tool.navigateTo(`/pages/experience/experience?activityCode=${activityCode}&productCode=${id}`)
            } else {
                // 普通产品
                Tool.navigateTo('/pages/product-detail/product-detail?door=100&prodCode=' + id)
            }
        }
    },
    collectBills(e){ //去凑单
        let activityCode = e.currentTarget.dataset.code
        Tool.navigateTo(`/pages/experience/experience?activityCode=${activityCode}`)
    },
    lookAround(){ // 去逛逛
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