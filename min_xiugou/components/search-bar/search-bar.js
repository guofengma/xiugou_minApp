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
      let keyWord = String(e.detail.value).replace(/(^\s*)|(\s*$)/g, "")
      if(keyWord.length>60) keyWord = keyWord.slice(0,60)
      this.setData({
        keyWord:keyWord
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
