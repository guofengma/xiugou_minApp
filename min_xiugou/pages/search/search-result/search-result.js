let {Tool, Storage, Event, API} = global
import ProductFactorys from '../../product-detail/temp/product.js'
Page({
    data: {
        show: false, //展示形式  false：网状
        keyword: '',
        tipVal: '', // 默认是无 取值 1 2 3
        productInfo: [], // 商品信息
        totalPage: '', // 页面总页数
        currentPage: 1, // 当前的页数
        pageSize: 10, // 每次加载请求的条数 默认10
        params: {},
        categoryId: '',
        isInit: false,
    },
    onLoad: function (options) {
        this.ProductFactory = new ProductFactorys(this)
        Tool.isIPhoneX(this)
        this.didLogin()
        this.getInitRequest(options)
        this.getShoppingCartList()
        Event.on('didLogin', this.didLogin, this);
    },
    onShow: function () {

    },
    getInitRequest(options){ // 请求产品列表
        let params = {
            pageSize: this.data.pageSize,
            page: this.data.currentPage,
            keyword: options.keyword || '',
            categoryId: Number(options.categoryId) || '',
            hotWordId: Number(options.hotWordId) || '',
            sortModel: 2,
            sortType: 1
        }
        this.data.isHistory = options.isHistory=="true"? true:false
        if (options.hotWordId) {
            delete params.categoryId
        } else if (options.categoryId) {
            delete params.keyword
            delete params.hotWordId
        } else if (!options.hotWordId && !options.categoryId) {
            delete params.hotWordId
            delete params.categoryId
        }
        this.setData({
            keyword: options.keyword || '',
            params: params,
            categoryId: options.categoryId || '',
            hotWordId: options.categoryId || ''
        })
        this.requestQueryProductList(params)
    },
    didLogin() {
        Tool.didLogin(this)
    },
    getKeyword(e){
        this.setData({
            keyword: e.detail.keyWord
        })
    },
    scroll(e, res) {
        if (e.detail.scrollTop > 200) {
            this.setData({
                floorstatus: true
            });
        } else {
            this.setData({
                floorstatus: false
            });
        }
    },
    goTop: function (e) {
        this.setData({
            scrollTop: 0
        })
    },
    searchKeyword(){
        if (!Tool.isEmpty(this.data.keyword)) {
            let history = Storage.getHistorySearch()
            history.unshift(this.data.keyword)
            let setArr = new Set(history)
            history = [...setArr]
            Storage.setHistorySearch(history)
        } else {
            Tool.showAlert('搜索内容不能为空')
            return
        }
        this.data.params.keyword = this.data.keyword
        this.setData({
            params: this.data.params
        })
        this.navbarClicked({detail: {n: 1}})
    },
    reloadNet(){
        this.requestQueryProductList(this.data.params)
    },
    onScroll() { // 向下滑动的时候请求数据
        if (this.data.currentPage >= this.data.totalPage) return
        let page = this.data.currentPage
        page += 1
        let {params} = this.data
        params.page = page
        this.setData({
            currentPage: page,
            params: params
        })
        this.requestQueryProductList(this.data.params)
    },
    getShoppingCartList() { // 查询购物车
        this.ProductFactory.getShoppingCartList()
    },
    addToShoppingCart(e) { // 加入购物车
        this.setData({
            selectType: e.detail
        })
        this.ProductFactory.addToShoppingCart("", "", '产品列表页')
    },
    addShoppingCartClicked(e) { // 规格选择
        let index = e.currentTarget.dataset.index
        let imgurl = e.currentTarget.dataset.imgurl
        let price = e.currentTarget.dataset.price
        this.setData({
            productSpec: this.data.productInfo[index].specifyList,
            priceList: this.data.productInfo[index].skuList,
            selectPrice: price,
            isInit: false,
            productStatus: this.data.productInfo[index].productStatus,
            imgUrl: imgurl
        })
        this.selectComponent("#prd-info-type").isVisiableClicked()
    },
    requestQueryProductList(params){ // 关键字搜索
        API.searchProduct(params).then((res) => {
            let productInfo = this.data.productInfo
            let datas = res.data || {}
            if (datas.totalNum > 0) {
                this.setData({
                    productInfo: productInfo.concat(datas.data),
                    totalPage: datas.totalPage,
                    tipVal: ''
                })
            } else if (datas.totalNum == 0) {
                this.setData({
                    tipVal: 2
                })
            }
            if (params.page == 1)
            Tool.sensors("Search", {
                keyWord: this.data.keyWord,
                hasResult: datas.totalNum > 0 ? true : false,
                isHistory: this.data.isHistory,
                isRecommend: params.hotWordId? true : false
            })
        }).catch((res) => {

        })
    },
    productCliked(e){
        Tool.navigateTo('/pages/product-detail/product-detail?prodCode=' + e.currentTarget.dataset.id + '&door=1')
    },
    goPage(){
        Tool.switchTab('/pages/shopping-cart/shopping-cart')
    },
    navbarClicked(e){ // 点击tab事件
        // 1 综合 2销量 3价格 不是数字为变化排版
        let n = e.detail.n
        let sort = e.detail.sort
        if (n === false || n === true) {
            this.setData({
                show: n
            })
            return
        }
        let params = {
            ...this.data.params,
            sortType: n
        }
        params.page = 1
        switch (n) {
            case 1:
                params.sortModel = 2
                break;
            case 2:
                params.sortModel = 2
                break;
            case 3:
                let sortType = sort ? 1 : 2
                params.sortModel = sortType
                break;
        }
        this.setData({
            params: params,
            currentPage: 1,
            productInfo: []
        })
        this.requestQueryProductList(params)
    },
    onUnload: function () {

    },
})