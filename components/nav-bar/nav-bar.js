// let { Tool, RequestFactory } = global;

Component({
  properties: {
    
  },
  data: {
    show:false,
    activeIndex:1,
    priceShow:{clicked:false,up:false}  // 是否被点击  是否从高到底
  },
  methods: {
    navbarClicked(e){
      let n = parseInt(e.target.dataset.index)
      switch (n) {
        case 1:
        case 2:
        case 3:
          this.setActiveIndex(n)
          break;
        case 4:
          this.setData({
            show: !this.data.show
          })
          n = this.data.show
          break;
      }
      // 开始各种请求 
      this.triggerEvent('navbarClicked', { n: n, sort:this.data.priceShow.up})
    },
    setActiveIndex(val){
      // 调整价格的箭头显示
      let clicked = false
      let up = false 
      if (val == 3) {
        clicked = true
        up = !this.data.priceShow.up
      } 
      this.setData({
        activeIndex: val,
        priceShow: { clicked: clicked, up: up }
      })
    }
  },
  ready: function () {
    
  }
})
