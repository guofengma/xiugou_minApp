let { Tool, RequestFactory, Storage, Event, Operation } = global;
import WxParse from '../../libs/wxParse/wxParse.js';
Component({
  properties: {
    visiable:Boolean,
    noticeList:Array
  },
  data: {
    
  },
  methods: {
    close() {
      this.triggerEvent('isShowNotice')
    },
    getNotice(){
      let params = {
        pageSize: 5,
        page: 1,
        reqName: '通知详情',
        'type': 100,
        url: Operation.queryNoticeMessage
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let list = req.responseObject.data.data || [];
        if (!req.responseObject.data.totalPage) return
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
          list: this.data.listContent,
        })
        console.log(this.data.list)
        this.triggerEvent('isShowNotice')
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    }
  },
  ready() {
    this.getNotice()
  }
})
