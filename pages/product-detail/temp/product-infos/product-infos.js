Component({
  properties: {
    article:Object,
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
  }
})
