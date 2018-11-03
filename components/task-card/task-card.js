let { Tool, RequestFactory, Storage, Event, Operation, Config } = global
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
      Tool.navigateTo('/pages/my/my');
    }
  },
  ready(){
    console.log(this.data.card);
  }
})
