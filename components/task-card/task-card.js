let {Config } = global;
Component({
  properties: {
    type: {
      type: String,
      value: 'loading'
    }
  },
  data: {
    imgUrl: Config.imgBaseUrl
  },
  methods: {
    close() {
      this.triggerEvent('close');
    }
  }
})
