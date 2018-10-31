let {Config } = global;
Component({
  properties: {
    type: {
      type: String,
      value: 'loading'
    },
    name: {
      type: String,
      value: ''
    },
  },
  data: {
    imgUrl: Config.imgBaseUrl
  },
  methods: {
    close() {
      this.triggerEvent('close');
    },
    getJob() {
      this.triggerEvent('get')
    }
  }
})
