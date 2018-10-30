Component({
  properties: {
    type: {
      type: String,
      value: 'loading'
    }
  },
  data: {

  },
  methods: {
    close() {
      this.triggerEvent('close');
    }
  }
})
