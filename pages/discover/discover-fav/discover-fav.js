let { Tool, RequestFactory, Storage, Event, Operation } = global
Page({
  data: {
      showEdit: false,
      isCheckAll: false,
      showBackTop: false,
      items: [],
      currentPage: 1,
      totalPage: null,
  },
  onLoad (options) {

  },
  onReady () {
    this.getCollectList();
  },
  onShow () {

  },
  onHide () {

  },
  onUnload () {

  },
  onReachBottom () {
    let data = this.data;
    if(data.totalPage == data.currentPage) {
      // 显示已经到底了
      return;
    }
    let page = data.currentPage+1;
    this.getCollectList(page);
  },
  // 获取收藏列表数据
  getCollectList(page = 1, size = 10) {
    console.log(page);
    let params = {
      page: page,
      size: size,
      url: Operation.queryCollect,
      requestMethod: 'GET'
    }
    let r = RequestFactory.wxRequest(params);
    r.successBlock = (req) => {
      let data = req.responseObject.data || {};
      console.log(data);
      let items = page == 1 ? [] : this.data.items;// 第一页的话直接以接口数据为准

      this.setData({
        items: items.concat(Array.isArray(data.data) ? data.data : [] ),
        totalPage: data.totalPage,
        currentPage: data.currentPage
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  onPageScroll(e){
    let flag =false;
    if (e.scrollTop > 200) {
      flag = true;
    }
    this.setData({
      showBackTop: flag
    })
  },
  // 返回顶部
  goTop () {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  // 是否编辑收藏列表
  toggleShowEdit() {
    this.setData({
      showEdit: !this.data.showEdit
    })
  },
  handleItemClicked(e) {
    // 如果处于编辑状态就不跳转了
    if(this.showEdit) return;
    let articleId = e.currentTarget.dataset.id;
    Tool.navigateTo('/pages/discover/discover-detail/discover-detail?articleId='+articleId)
  },
  // 单选
  manageItem(e) {
    let index = e.currentTarget.dataset.index;
    let items = this.data.items;
    items[index].checked = !items[index].checked;
    this.setData({
      items: items
    })
    this.isCheckedAll();
  },
  // 判断是否全选
  isCheckedAll() {
    let items = this.data.items;
    let flag = true;
    for(let i = 0,len = items.length;i<len;i++) {
      if(!items[i].checked){
        flag = false;
        break;
      }
    }
    this.setData({
      isCheckAll: flag
    })
    return flag;
  },
  // 全选非全选
  checkAll() {
    let items = this.data.items || [];
    let checked = !this.data.isCheckAll;
    items.forEach( (item) => {
      item.checked = checked;
    })
    this.setData({
      items: items,
      isCheckAll: checked
    })
  },
  // 删除选中  如果一个没选 给提醒
  deleteSelectItems() {
    let checkedList = this.checkSelectItems();
    if(checkedList.length == 0){
      // 提醒
      wx.showToast({
        title: '请至少选择一个要删除的店铺',
        icon: 'none',
        duration: 3000
      })
      return;
    }
    let _ = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除改店铺吗？',
      success(res) {
        if(res.cancel) return;
        let params = {
          type: 2,
          articleIds: checkedList,
          reqName: '取消收藏操作',
          url: Operation.discoverCountCancel
        }
        console.log(params);
        let r = RequestFactory.wxRequest(params);
        r.successBlock = (req) => {
          let data = req.responseObject.data || {};
          console.log(data);
          _.toggleShowEdit();
          // 删完重新获取第一页数据 单个删除的话用splice比较好
          _.getCollectList();
        };
        Tool.showErrMsg(r)
        r.addToQueue();
      }
    })
    
  },
  // 获取当前选中列表
  checkSelectItems() {
    let checkedList = [];
    this.data.items.forEach( item => {
      if(item.checked) checkedList.push(item.id);
    })
    return checkedList;
  }
})