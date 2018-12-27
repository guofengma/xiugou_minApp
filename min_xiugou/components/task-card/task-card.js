let { Tool, Storage, Event, Config } = global
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
    desc: {
      type: String,
      value: ''
    },
    card: {
      type: Object,
      value: {}
    }
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
    },
    showAccount() {
      Tool.navigateTo('/pages/my/my-account/cash/cash');
    }
  },
  ready(){
    console.log(this.data.card);
  }
})
