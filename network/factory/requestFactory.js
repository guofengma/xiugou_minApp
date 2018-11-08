/**
 * Created by weiwei on 1/6/18.
 */

import Request from '../base-requests/request'
import Operation from '../operation'
import config from '../../config.js'

//读取请求具体封装
export default class RequestFactory {
  // 统一的请求 
  static wxRequest(params = {}) {
    /*
      调用的方式 1和2和6一定要写 3和4和5根据请求和业务判定

      1.请求参数格式 必写
      let params = {
        url:'', //请求的地址 必写 
        reqName:'xxx', //请求的中文名称 可以不写 只是打印用
        requestMethod:'POST/GET',//  请求的方式 默认post
        isShowLoading:Boolean, // 是否展示loading 默认ture
        hasCookie:Boolean, // 是否携带cookie
        otherParams:其他参数 即后端接口约定的参数 如 name:'XXX'
      } 
      
      2. 调用 必写
      let r = RequestFactory.wxRequest(params);

      3. 成功的回调 即code 200
      r.successBlock = (req) => {业务逻辑}

      4. 失败的回调 以下2选1即可

      （1）r.failBlock = (req) => {业务逻辑};

       // 简化版的4（1）的失败回调 针对只打印后端传回的消息和超时登录
      （2）Tool.showErrMsg(r)

      5. 结束回调，不管成功or失败
      r.completeBlock = (req) => {业务逻辑};

      6. 加入队列请求中 一定要写 否则不能请求 小程序最大并发请求为5个 超过5个会请求不成功 故要加入队列
      r.addToQueue();
    */
    let sysInfo = global.Storage.sysInfo()

    // 是否需要携带cookie

    if (params.hasCookie === undefined) params.hasCookie = true

    if (params.isShowLoading === undefined) params.isShowLoading = true

    if (params.requestMethod === undefined) params.requestMethod = 'POST'

    if (sysInfo) {
      // 手机型号
      params.device = sysInfo.model

      // 微信版本
      params.wechatVersion = sysInfo.version

      // 系统版本
      params.systemVersion = sysInfo.system
    }

    let req = new Request(params);

    req.name = params.reqName;//用于日志输出

    return req;

  }
  
  // 上传图片的地址 
  static aliyunOSSUploadImage() {
    // let baseUrl = new Request(params).getBaseUrl(params)
    let url = Operation.sharedInstance().aliyunOSSUploadImage;
    return config.baseUrl + url
  }
}

