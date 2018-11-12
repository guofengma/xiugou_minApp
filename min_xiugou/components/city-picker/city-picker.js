let { Tool, RequestFactory, Operation } = global;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    region:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    sheng: [],//获取到的所有的省
    shi: [1, 2, 3],//选择的该省的所有市
    qu: [1, 2, 3],//选择的该市的所有区县
    sheng_index: 0,//picker-view省项选择的value值
    shi_index: 0,//picker-view市项选择的value值
    qu_index: 0,//picker-view区县项选择的value值
    shengshi: null,//取到该数据的所有省市区数据
    result:[],//最后取到的省市区名字
    animationData: {},
    picker:[0,0,0]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clicked: function () { //这里写了一个动画，让其高度变为满屏
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      this.animation = animation
      animation.height(100+ '%').step()
      this.setData({
        animationData: animation.export()
      })
      this.pickerTriggerEvent(true,1)
    },
    //取消按钮
    cancel: function () {  //这里也是动画，然其高度变为0
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })

      this.animation = animation
      animation.height(0 + 'rpx').step()
      this.setData({
        animationData: animation.export()
      });
      //取消不传值，这里就把result 的值赋值为[]
      this.pickerTriggerEvent(false,1)
    },
    //确认按钮
    makeSure: function () {
      //一样是动画，级联选择页消失，效果和取消一样
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      this.animation = animation
      animation.height(0 + 'rpx').step()
      this.setData({
        animationData: animation.export(),
        result:[
          this.data.sheng[this.data.picker[0]],
          this.data.shi[this.data.picker[1]],
          this.data.qu[this.data.picker[2]]
        ]
      });
      this.pickerTriggerEvent(false,2)
    },
    //滚动选择的时候触发事件
    bindChange: function (e) {
      //这里是获取picker-view内的picker-view-column 当前选择的是第几项
      const val = e.detail.value
      let old_sheng_index = this.data.sheng_index
      let old_shi_index = this.data.shi_index
      let old_qu_index = this.data.qu_index
      if(old_sheng_index != val[0]){
        this.getCityList(this.data.sheng[val[0]].code) 
        this.setIndex(val[0],0,0)
        return
      }
      if (old_shi_index != val[1]){
        this.getAreaList(this.data.shi[val[1]].code)
        this.setIndex(val[0], val[1], 0)
        return
      }
      this.setData({
        picker: val
      })
    },
    pickerTriggerEvent(hidden,btnType){
      this.triggerEvent('pickerClicked', { hidden: hidden, btnType:btnType,result: this.data.result })
    },
    setIndex(sheng,shi,qu){
      this.setData({
        sheng_index: sheng,
        shi_index: shi,
        qu_index: qu,
        picker:[sheng,shi,qu]
      })
    },
    // 获取省份
    getProvinceList() {
      let params = {
        fatherCode: 0,
        isShowLoading: false,
        requestMethod: 'GET',
        reqName: '获取省',
        url: Operation.queryAreaList
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let data = req.responseObject.data
        this.setData({
          sheng: data
        })
        // 默认请求第一个
        this.getCityList(data[0].code) 
      }
      r.addToQueue();
    },
    // 获取市
    getCityList(id) {
      console.log(id)
      let params = {
        fatherCode: id,
        isShowLoading: false,
        reqName: '获取市',
        requestMethod: 'GET',
        url: Operation.queryAreaList
      }
      let r = RequestFactory.wxRequest(params);
      // let r = RequestFactory.getCityList({fatherZipcode:id});
      r.successBlock = (req) => {
        let data = req.responseObject.data
        this.setData({
          shi: data
        })
        // 默认请求第一个
        if (data.length>0){
          this.getAreaList(data[0].code)
        } else {
          this.setData({
            qu:[]
          })
        }
      }
      r.addToQueue();
    },
    // 获取区
    getAreaList(id) {
      let params = {
        fatherCode: id,
        isShowLoading: false,
        reqName: '获取区',
        requestMethod: 'GET',
        url: Operation.queryAreaList
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        this.setData({
          qu: req.responseObject.data
        })
      }
      r.addToQueue();
    }
  },
  ready: function () {
    this.getProvinceList()
  }
})
