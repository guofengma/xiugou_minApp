Page({

  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    assist: false,
    fav: true,
    activeIndex: 1
  },
  onLoad: function (options) {

  },
  onReady() {

  },
  onShow() {

  },
  onHide() {

  },
  onUnload() {

  },
  sliderChange(e) {
    this.setData({
      activeIndex: e.detail.current + 1
    })
  },
})