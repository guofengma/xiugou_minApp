let { Tool, RequestFactory, Operation } = global

Component({
  properties: {

  },
  data: {

  },
  methods: {
    cancelApply(){
      let callBack = ()=>{

      }
      Tool.showComfirm('确认撤销本次申请吗')
    }
  }
})
