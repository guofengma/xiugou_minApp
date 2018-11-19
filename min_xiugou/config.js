const config = {
  h5webUrl: 'https://uath5.sharegoodsmall.com',// 市场部内测环境
  baseUrl: 'https://uatapi.sharegoodsmall.com/gateway',// 市场部内测环境
  // h5webUrl: 'https://testh5.sharegoodsmall.com',
  // baseUrl:'https://testapi.sharegoodsmall.com/gateway',// 测试环境
  // baseUrl: 'http://devapi.sharegoodsmall.com/gateway',// 开发环境
  // baseUrl: 'http://172.16.10.42:8180/gateway',  // 蒋
  // baseUrl: 'http://172.16.10.29:8180/gateway',  // 周
  // baseUrl:'http://172.16.10.238:8180/gateway',  // 高
  // baseUrl:'http://172.16.10.56:8180/gateway',  // 沈
  // baseUrl: 'http://172.16.10.41:8180/gateway',  // 张
  // baseUrl: 'http://172.16.10.12:8180/gateway',  // 杨
  // baseUrl: 'http://172.16.10.19:8903/gateway',  // 吴
  // baseUrl: 'http://172.16.10.88:8180/gateway',  // 陈
  // baseUrl: 'http://172.16.10.111:8180/gateway',  // 王
  // baseUrl: 'http://zhifu.dnvhot.tech', // 吴
  wxVersion: 'V2.2.5', // 微信小程序版本
  BaiduMapKey: 'BazNALkeiEEMMvZjWmPeXlRqOyd0BlnL',
  AppId: 'wxa059b818226f8679',//小程序AppID
  Secret: '9fa19f4d1f7e37d318dba14f951f1b4c',//小程序Secret
  imgSizeParams:{
    m_fixed:'?x-oss-process=im age/resize,m_fixed,h_100,w_100', // 正方形
    m_fill:'?x-oss-process=image/resize,m_fill,h_100,w_100', // 固定宽度 自裁剪
  },
  imgBaseUrl:"https://mr-uat-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/resource/xcx/",// 图片的地址
}
export default config