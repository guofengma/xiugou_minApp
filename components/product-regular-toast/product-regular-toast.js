Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    content: {
      type: String,
      value: ''
    }
  },
  methods:{
    close(){
      this.triggerEvent('close');
    }
  }
})
