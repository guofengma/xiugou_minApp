const config = {
  // baseUrl:'https://testapi.sharegoodsmall.com/gateway',// 测试环境
  // baseUrl: 'http://devapi.sharegoodsmall.com/gateway',// 开发环境
  // baseUrl: 'http://172.16.10.42:8180/gateway',  // 蒋
  baseUrl: 'http://172.16.10.29:8180/gateway',  // 周
  // baseUrl:'http://172.16.10.238:8180/gateway',  // 高
  // baseUrl:'http://172.16.10.56:8180/gateway',  // 沈
  // baseUrl: 'http://172.16.10.41:8180/gateway',  // 张
  // baseUrl: 'http://172.16.10.12:8180/gateway',  // 杨
  // baseUrl: 'http://172.16.10.19:8180/gateway',  // 吴
  // baseUrl: 'http://172.16.10.88:8180/gateway',  // 陈
  // baseUrl: 'http://zhifu.dnvhot.tech', // 吴
  wxVersion: 'V2.2.5', // 微信小程序版本
  BaiduMapKey: 'BazNALkeiEEMMvZjWmPeXlRqOyd0BlnL',
  AppId: 'wx228ac7ba52b9b1ed',//小程序AppID
  Secret: 'ac645290e3299966fabe3cf0d0034f9b',//小程序Secret
  imgSizeParams:{
    m_fixed:'?x-oss-process=image/resize,m_fixed,h_100,w_100', // 正方形
    m_fill:'?x-oss-process=image/resize,m_fill,h_100,w_100', // 固定宽度 自裁剪
  },
  imgBaseUrl:"https://dnlcrm.oss-cn-beijing.aliyuncs.com/xcx/",// 图片的地址
}
export default config