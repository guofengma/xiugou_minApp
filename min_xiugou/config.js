// 每次发布要 切换 h5webUrl地址 baseUrl请求地址  rasVersion加签版本
const config = {
  rasVersion: '1.0.4.5', //数据加签版本号
  rasClient: 'miniapp', // 数据加签端口
  // h5webUrl: 'https://uath5.sharegoodsmall.com',// 市场部内测环境
  // baseUrl: 'https://uatapi.sharegoodsmall.com/gateway',// 市场部内测环境
  h5webUrl: 'https://testh5.sharegoodsmall.com',
  // baseUrl:'https://testapi.sharegoodsmall.com/gateway',// 测试环境
  // h5webUrl: 'http://devh5.sharegoodsmall.com',
  // baseUrl: 'http://devapi.sharegoodsmall.com/gateway',// 开发环境
  // baseUrl: 'http://172.16.10.42:4090/gateway',  // 蒋
  // baseUrl: 'http://172.16.10.29:8903/gateway',  // 周
  // baseUrl:'http://172.16.10.238:8903/gateway',  // 高
  // baseUrl:'http://172.16.10.56:8903/gateway',  // 沈
  // baseUrl: 'http://172.16.10.41:9090/gateway',  // 张
  // baseUrl: 'http://172.16.10.12:8180/gateway',  // 杨
  // baseUrl: 'http://172.16.10.19:8903/gateway',  // 吴
  // baseUrl: 'http://172.16.10.88:8903/gateway',  // 陈
  // baseUrl: 'http://172.16.10.111:8903/gateway',  // 王
  // baseUrl: 'http://172.16.10.151:9090/gateway',  // 李俊
  // baseUrl: 'http://zhifu.dnvhot.tech', // 吴
  // baseUrl: 'http://172.16.10.21:8080/gateway', // 申
  baseUrl: 'http://172.16.10.158:18096/gateway', // 杨飞
  // baseUrl: 'http://172.16.10.192:18080/gateway', //
  // baseUrl: 'http://172.16.10.177:9090/gateway', // 龚日红
  // baseUrl: 'http://172.16.10.164:8903/gateway', // 顾嘉豪
  wxVersion: 'V2.2.5', // 微信小程序版本
  AppId: 'wxa059b818226f8679',//小程序AppID
  Secret: '9fa19f4d1f7e37d318dba14f951f1b4c',//小程序Secret
  imgSizeParams:{
    m_fixed:'?x-oss-process=image/resize,m_fixed,h_300,w_300', // 正方形
    m_fill: '?x-oss-process=image/resize,p_70', // 将图按比例缩略到原来的 70%
    m_mfit: '?x-oss-process=image/resize,m_mfit,h_300,w_300', // 将图缩略成宽度为 300，高度为 300，按短边优先
  },
  imgBaseUrl:"https://mr-uat-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/resource/xcx/",// 图片的地址
}
export default config