// pages/my/account.js
let { Tool, RequestFactory, Storage, Event, Operation } = global;
import WxParse from '../../../../libs/wxParse/wxParse.js';
Page({
    data: {
        params: {},
        totalPage: '', // 页面总页数
        currentPage: 1, // 当前的页数
        pageSize: 10, // 每次加载请求的条数 默认10
        list: [],
        hasNext: true//是否有下一页
    },
    onLoad: function (options) {
      this.getData()
      Event.emit('queryPushNum')
    },
    onShow: function () {

      
    },
    //获取数据
    getData() {
      if (this.data.hasNext) {
        let params = {
          pageSize: this.data.pageSize,
          page: this.data.currentPage,
          reqName: '通知详情',
          'type':200,
          url: Operation.queryNoticeMessage
        }
        this.setData({
          params: params
        })
        let r = RequestFactory.wxRequest(params);
        r.successBlock = (req) => {
          let list = [];
          for (let i in req.responseObject.data.data) {
            let item = req.responseObject.data.data[i];
            list.push(item)
            item.orderTime = Tool.formatTime(item.startTime)
          }
          let listArr = []
          // 多次渲染模板
          for (let i = 0; i < list.length; i++) {
            listArr = [...list]
            WxParse.wxParse('content' + i, 'html', list[i].content, this);
            if (i === list.length - 1) {
              WxParse.wxParseTemArray("listContent", 'content', list.length, this)
            }
          }
          // 渲染模板以后 重置对象
          this.data.listContent.map((item, index, arr) => {
            Object.assign(arr[index][0], arr[index][0], listArr[index])
          });
          this.setData({
            list: this.data.list.concat(this.data.listContent),
            totalPage: req.responseObject.data.totalPage,
          })
          if (this.data.totalPage > this.data.currentPage) {
              this.setData({
                currentPage: ++this.data.currentPage
              })
          } else {
              this.data.hasNext = false
          }
        };
        Tool.showErrMsg(r)
        r.addToQueue();
      }

    },
    // 上拉加载更多
    onReachBottom() {
      // let { totalPage, currentPage} = this.data
      // currentPage++
      // if (totalPage < currentPage) return
      // this.setData({
      //   currentPage: currentPage
      // })
      this.getData();
    },
    //跳到详情页
    informationDetail(){
      if (!this.didLogin()) return;
      Tool.navigateTo('../informationDetail/informationDetail')
    },
    didLogin(){
      if (!Tool.didLogin(this)){
        Tool.navigateTo('/pages/login/login-wx/login-wx');
        return false
      }
      return true
    },
    onUnload: function () {

    },
})