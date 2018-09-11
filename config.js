const config = {
  isDevEnv:{ // 是否是开发环境
    isDev:true,
    baseUrl: 'http://172.16.10.19:8180/gateway'
  },
  isTestEnv:{ // 测试环境
    isTest:false,
    baseUrl: 'http://172.16.10.19:8180/gateway'
  },
  baseUrl:'https://sg.dnvhot.tech',// 小程序发布的显示地址
  wxVersion: 'V2.2.5', // 微信小程序版本
  BaiduMapKey: 'BazNALkeiEEMMvZjWmPeXlRqOyd0BlnL',
  AppId: 'wx228ac7ba52b9b1ed',//小程序AppID
  Secret: 'ac645290e3299966fabe3cf0d0034f9b',//小程序Secret
}
export default config