let { Tool, RequestFactory, Storage, Operation } = global

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
    ysf: { title: '搜索' }
  },
  onLoad: function (options) {
    if (options.door == 0){
      this.setData({
        history: Storage.getHistorySearch() || [],
        door: options.door,
        placeholder:"搜索商品"
      })
      this.requestGetHotWordsListActive()
      this.getLocation()
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
  getLocation(){
    let callBack = (res) =>{
      if(res){
        this.setData({
          province: res.originalData.result.addressComponent.province
        })
        this.getProvinceList(this.data.province)
      }
    }
    Tool.queryLocation(callBack)
  },
  requestGetHotWordsListActive(){
    // let r = RequestFactory.getHotWordsListActive();
    let params = {
      reqName: '获取热搜词',
      url: Operation.getHotWordsListActive,
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let datas = req.responseObject.data
      if(datas.length>0){
        datas.forEach((item)=>{
          item.wordShowName = item.wordName.length > 10 ? item.wordName.slice(0, 10) + "..." : item.wordName
        })
      }
      this.setData({
        hotWords: req.responseObject.data
      })
    }
    r.addToQueue();
  },
  getHotkeyword(e){
    this.setData({
      keyWord: e.currentTarget.dataset.keyword
    })
    this.searchKeyword()
  },
  getKeyword(e){
    this.setData({
      keyWord: e.detail.keyWord
    })
  },
  deleteKeyword(){
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
  searchKeyword(){
    if (!Tool.isEmptyStr(this.data.keyWord)) {
      // let str = this.data.keyWord.length > 10 ? this.data.keyWord.slice(0, 10) + "..." : this.data.keyWord
      let keywords = this.data.history
      if (keywords.length > 0) {
        keywords.length == 10 ? keywords.splice(9, 1) : keywords
        keywords.unshift(this.data.keyWord)
        let setArr = new Set(keywords)
        // console.log(setArr)
        keywords=[...setArr]
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
      Tool.showAlert('请输入搜索内容')
    }
    // this.getRequest()
  },
  requestKeyword(){
    Tool.redirectTo('/pages/search/search-result/search-result?keyword=' +this.data.keyWord+'&code=' + this.data.provinceCode)
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
  },
  getProvinceList() {
    let params = {
      reqName: '获取省份',
      url: Operation.getProvinceList,
    }
    let r = RequestFactory.wxRequest(params)
    // let r = RequestFactory.getProvinceList();
    r.successBlock = (req) => {
      let data = req.responseObject.data
      let showProvince = ''
      for (let i = 0; i < data.length; i++) {
        if (data[i].name == this.data.province) {
          showProvince = data[i]
          break
        }
      }
      this.setData({
        provinceCode: showProvince.zipcode || -1
      })
    }
    r.addToQueue();
  },
})