// components/tips-info/tips-info.js
Component({
  properties: {
    header:String,
    isShoW:Boolean,
  },
  data: {

  },
  methods: {
    closeMask(){
      this.triggerEvent('closeMask',false);
    }
  }
})
