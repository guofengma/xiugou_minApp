let { Tool, RequestFactory, Storage, Operation, Event } = global;
Page({
  data: {
    isAnimate:true,
    // visiable:false
  },
  onLoad: function (options) {

  },
  goPage(){
    Tool.navigateTo('/pages/register/write-invite-code/write-invite-code') 
  },
  changeClicked(){
    if (!this.data.isAnimate) return
    let animateObj ={
      duration: 500,
      timingFunction: "ease",
      delay: 0,
    }
    let step = {
      delay: 200
    }
    let animation0 = wx.createAnimation({ ...animateObj})
    let animation1 = wx.createAnimation({ ...animateObj })
    let animation2 = wx.createAnimation({ ...animateObj })
    let animation3 = wx.createAnimation({ ...animateObj })
    let systemInfo = wx.getSystemInfoSync()
    let x = 155 / 750 * systemInfo.windowWidth
    let y = 192 / 750 * systemInfo.windowWidth
    animation0.translate(x, y ).step(); 
    animation1.translate(-x, y ).step();
    animation2.translate(x, -y ).step();
    animation3.translate(-x, -y ).step();
    animation0.translate(0, 0).step(step); 
    animation1.translate(0, 0).step(step); 
    animation2.translate(0, 0).step(step); 
    animation3.translate(0, 0).step(step); 


    //导出动画数据传递给组件的animation属性。
    this.setData({
      animationData0: animation0.export(),
      animationData1: animation1.export(),
      animationData2: animation2.export(),
      animationData3: animation3.export(),
      isAnimate:false,
    })
    let that = this
    setTimeout(function(){
      that.setData({
        isAnimate: true,
      })
    },1210)
  },

  btnClicked(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      activeIndex:index
    })
    this.selectComponent('#redEnvelopes').btnClick();
  },
  dismiss(){
    let callBack = () => {
      Tool.switchTab('/pages/index/index')
    }
    Tool.showSuccessToast('注册成功', callBack)
  }
})