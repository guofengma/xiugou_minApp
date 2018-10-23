Page({
  data: {
    tabIndex: 0,
    discoverData: {},
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    showEdit: false,
    items: [
      {
        img: 'https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/TB2EtekiP3z9KJjy0FmXXXiwXXa_!!2867551008.jpg',
        title: '氨基酸洗面奶，30秒自动起泡清洁力强不伤脸，不含...质...痘肌和敏感肌，涂抹在手上等待30秒，自动起泡，会员价只要130元',
        avatar: 'https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/TB2EtekiP3z9KJjy0FmXXXiwXXa_!!2867551008.jpg',
        nickName: '、霓娜',
        time: '1分钟前',
        checked: false,
        view: 1235
      },
      {
        img: 'https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/%E9%99%8D%E4%BB%B7%E6%8B%8D%E4%BA%A7%E5%93%81%E8%AF%A6%E6%83%85.png',
        title: '氨基酸洗面奶，30秒自动起泡清洁力强不伤脸，不含...质...痘肌和敏感肌，涂抹在手上等待30秒，自动起泡，会员价只要130元',
        avatar: 'https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/TB2EtekiP3z9KJjy0FmXXXiwXXa_!!2867551008.jpg',
        nickName: '、霓娜',
        time: '1分钟前',
        checked: false,
        view: 1235
      },
      {
        img: 'https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/%E9%99%8D%E4%BB%B7%E6%8B%8D%E4%BA%A7%E5%93%81%E8%AF%A6%E6%83%85.png',
        title: '氨基酸洗面奶，30秒自动起泡清洁力强不伤脸，不含...质...痘肌和敏感肌，涂抹在手上等待30秒，自动起泡，会员价只要130元',
        avatar: 'https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/TB2EtekiP3z9KJjy0FmXXXiwXXa_!!2867551008.jpg',
        nickName: '、霓娜',
        time: '1分钟前',
        checked: false,
        view: 1235
      },
      {
        img: 'https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/兰蔻小黑瓶眼霜20ml.jpg',
        title: '氨基酸洗面奶，30秒自动起泡清洁力强不伤脸，不含...质...痘肌和敏感肌，涂抹在手上等待30秒，自动起泡，会员价只要130元',
        avatar: 'https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/TB2EtekiP3z9KJjy0FmXXXiwXXa_!!2867551008.jpg',
        nickName: '、霓娜',
        time: '1分钟前',
        checked: false,
        view: 1235
      }
    ]
  },

  onLoad (options) {

  },
  onReady() {

  },
  onShow() {

  },
  onHide() {

  },
  onUnload() {

  },
  onPullDownRefresh() {

  },
  onReachBottom() {

  },
  changeTabIndex(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      tabIndex: index
    })
  }
})