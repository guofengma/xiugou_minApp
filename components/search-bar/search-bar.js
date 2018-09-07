let { Tool, RequestFactory } = global
Component({
  properties: {
    disabled:Boolean,
    placeholder:String,
    keyWord: String,
  },
  data: {
    keyWord:'',
    showClose:false,
  },
  methods: {
    getKeyword(e){
      this.setData({
        keyWord:e.detail.value
      })
      this.triggerEvent('getKeyword',this.data);
    },
    searchKeyword(){
      this.triggerEvent('searchKeyword', this.data);
    },
    deleteWords(){
      this.setData({
        keyWord:''
      })
      this.triggerEvent('getKeyword', this.data);
    },
    bindfocus(){
      this.setData({
        showClose:true
      })
    },
    bindblur(){
      this.setData({
        showClose: false
      })
    }
  },

  ready: function () {

  }
})
