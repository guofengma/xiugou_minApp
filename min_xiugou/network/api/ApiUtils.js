const regeneratorRuntime = require('../../libs/asyncRuntime/runtime.js');
import HttpUtils from './HttpUtils';
import config from '../../config.js'
import { Tool } from '../../tools/tcglobal';

export default class ApiUtils {
  constructor(Urls) {
    this.Urls = Urls
    this.cache = {}
    // 最大并发量
    this.maxLimit = 5;
    // 请求队列,若当前请求并发量已经超过maxLimit,则将该请求加入到请求队列中
    this.requestQueue = [];
    //当前尝试的次数
    this.tryCount = 1;
    //最多尝试重发请求的次数
    this.maxTryCount = 2;
    // 当前并发量数目
    this.currentConcurrent = 0;
    this.result = {}
    this.list = []
    // 基本请求地址
    this.baseUrl = config.baseUrl
    this.init()
  }
  memoize (){
    const key = JSON.stringify(arguments);
    let value = this.cache[key];
    console.log(value)
    if(!value) {
      console.log('新值，执行中...');         // 为了了解过程加入的log，正式场合应该去掉
      value = arguments // 放在一个数组中，方便应对undefined，null等异常情况
      this.cache[key] = value;
    } else {
      console.log('来自缓存');
    }
    console.log(this.cache)
  }
  init(){
    let that = this
    let Urls = this.Urls
    let baseUrl = this.baseUrl
    Object.keys(Urls).forEach(function (name) {
      let value = Urls[name];
      if (typeof value === 'string') {
        that.list.push({
          name,
          uri: baseUrl + value,
          action: '未知'
        });
      } else if (value.length) {
        that.list.push({
          name,
          uri: baseUrl + value[0],
          ...value[1],
          config: value[1]
        });
      }
    });
    that.list.forEach(function (item) {
      let name = item.name, url = item.uri, method = item.method || 'post', action = item.action, myConfig = item.config || {}
      that.result[name] = async function (params,reqConfig={}) {
        Object.assign(reqConfig, reqConfig, myConfig)
        // 若当前请求数并发量超过最大并发量限制，则将其阻断在这里。
        // startBlocking会返回一个promise，并将该promise的resolve函数放在this.requestQueue队列里。这样的话，除非这个promise被resolve,否则不会继续向下执行。
        // 当之前发出的请求结果回来/请求失败的时候，则将当前并发量-1,并且调用this.next函数执行队列中的请求
        // 当调用next函数的时候，会从this.requestQueue队列里取出队首的resolve函数并且执行。这样，对应的请求则可以继续向下执行。
        if (that.currentConcurrent >= that.maxLimit) {
          await that.startBlocking();
        }
        const app = getApp();
        try {
          that.currentConcurrent++;
          that.memoize(url, params)
          const response = await HttpUtils[method](url, params, reqConfig);
          console.log(`------------------ 请求结束:${action}`)
          // console.log( typeof response)
          if (response.code === 0 || response.code === 10000) {
            // console.log(response)
            item.transformResponse && item.transformResponse(response);
            return Promise.resolve(response);
          } else {
            app.aldstat.sendEvent(url, {
              url: url,
              errMsg: response.msg
            })
            // 假如返回未登陆并且当前页面不是登陆页面则进行跳转
            if (response.code === 10009) {
              let callBack = () => {
                global.Tool.navigateTo('/pages/login-wx/login-wx?isBack=true')
              }
              global.Tool.showAlert(response.msg, callBack)
            } else {
              // 是否给出错误提示
              if (reqConfig.isShowErrMsg!==false){
                global.Tool.showAlert(response.msg)
              }
            }
            return Promise.reject(response);
          }
        } catch (err) {
          console.log('<============================== 请求结束：' + action + '第' + that.tryCount + '次请求');
          app.aldstat.sendEvent(url + ':interface error try again', {
            url: url,
            count: that.tryCount,
          })
          that.tryCount++;
          if (that.tryCount <= that.maxTryCount) {
            that.result[name]()
          } else {
            global.Tool.showAlert('请求失败，请稍后重试')
          }
          return Promise.reject(err);
        } finally {
          // console.log('当前并发数:', that.currentConcurrent);
          that.currentConcurrent--;
          that.next();
        }
      }
    });
  }
  startBlocking() {
    let _resolve;
    let promise2 = new Promise((resolve, reject) => _resolve = resolve);
    this.requestQueue.push(_resolve);
    return promise2;
  }
  // 从请求队列里取出队首的resolve并执行。
  next() {
    if (this.requestQueue.length <= 0) return;
    const _resolve = this.requestQueue.shift();
    _resolve();
  }
}