import WxParse from '../../../../libs/wxParse/wxParse.js';
Component({
  properties: {
    datas:Object,
    nodes:Array,
  },
  data: {
    show: true,
  },
  methods: {
    // 切换 tabar
    infoChoose(e) {
      let show = e.currentTarget.dataset.show == 1 ? true : false
      this.setData({
        show: show
      })
    },
    initDatas(){
      let html = this.data.datas.content
      WxParse.wxParse('article', 'html', html, this, 5);
    }
  },
  ready(){
    
  }
})
