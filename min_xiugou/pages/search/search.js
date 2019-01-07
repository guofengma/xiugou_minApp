let { Tool, Storage,API } = global

Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyWord:'',
    history: [],
    hotWords:[],
    province:'',
    provinceCode:-1,
    activeSearchLists:[]
  },
  onLoad: function (options) {
    if (options.door == 0){
      this.setData({
        history: Storage.getHistorySearch() || [],
        door: options.door,
        placeholder:"搜索商品"
      })
      this.requestGetHotWordsListActive()
    } else {
      this.setData({
        history: Storage.getSearchOrderHistory() || [],
        door: options.door,
        placeholder: "搜索订单"
      })
    }
    let historyArr = []
    this.data.history.forEach((item)=>{
      let showName = item.length>10? item.slice(0, 10) + "..." : item
      historyArr.push({
        showName,name:item
      })
    })
    this.setData({
      historyArr: historyArr
    })
  },
  onShow: function () {

  },
  getHotkeyword(e) {
    this.setData({
      keyWord: e.currentTarget.dataset.keyword,
      hotWordId:e.currentTarget.dataset.id || ''
    })
    this.searchKeyword()
  },
  getKeyword(e){
    this.setData({
      keyWord: e.detail.keyWord
    })
    if(this.data.door!=1){
      this.requestKeywords()
    }
  },
  requestGetHotWordsListActive() { // 获取热词
    API.getHotWordsListActive({
      // keyword: this.data.keyWord
    }).then((res) => {
      let datas = res.data || []
      datas.forEach((item) => {
        item.wordShowName = item.wordName.length > 10 ? item.wordName.slice(0, 10) + "..." : item.wordName
      })
      this.setData({
        hotWords: datas
      })
    }).catch((res) => {

    })
  },
  requestKeywords(){ // 动态获取搜索词
    if (Tool.isEmptyStr(this.data.keyWord)) return
    API.getKeywords({
      keyword: this.data.keyWord
    }).then((res) => {
      this.setData({
        activeSearchLists: res.data || []
      })
    }).catch((res) => {

    })
  },
  deleteKeyword() { // 删除搜索词
    if(this.data.door==1){
      Storage.setSearchOrderHistory(null)
    } else {
      Storage.clearHistorySearch()
    }
    this.setData({
      history:[],
      historyArr:[]
    })
  },
  searchKeyword(){ // 查询关键字
    if (!Tool.isEmptyStr(this.data.keyWord)) {
      let keywords = this.data.history
      if (keywords.length > 0) {
        keywords.length == 10 ? keywords.splice(9, 1) : keywords
        keywords.unshift(this.data.keyWord)
        let setArr = new Set(keywords)
        keywords=[...setArr]
        keywords.splice(9)
        if (this.data.door == 1) {
          Storage.setSearchOrderHistory(keywords)
        } else {
          Storage.setHistorySearch(keywords)
        }
      } else {
        if (this.data.door == 1) {
          Storage.setSearchOrderHistory([this.data.keyWord])
        } else {
          Storage.setHistorySearch([this.data.keyWord])
        }
      }
      this.getRequest()
    } else {
      Tool.showAlert('搜索内容不能为空')
    }
  },
  requestKeyword(){
    Tool.redirectTo('/pages/search/search-result/search-result?keyword=' + this.data.keyWord + '&hotWordId=' + this.data.hotWordId)
  },
  requestOrder() {
    Tool.redirectTo('/pages/search/search-order/search-order?condition=' + this.data.keyWord)
  },
  getRequest(){
    if (this.data.door == 1) {
      this.requestOrder()
    } else {
      this.requestKeyword()
    }
  }
})