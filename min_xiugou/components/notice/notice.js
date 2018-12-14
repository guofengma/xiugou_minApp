let { Tool,API, Storage, Event } = global;
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
    getNotice() { // 通知详情
      let params = {
        pageSize: 5,
        page: 1,
        'type': 100,
      }
      API.queryNoticeMessage(params).then((res) => {
        let list = res.data.data || [];
        if (!res.data.totalPage) return
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
        this.triggerEvent('isShowNotice')
      }).catch((res) => {

      })
    }
  },
  ready() {
    // this.getNotice()
  }
})
