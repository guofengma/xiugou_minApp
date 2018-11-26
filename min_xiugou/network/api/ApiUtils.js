const regeneratorRuntime = require('../../libs/asyncRuntime/runtime.js');
import HttpUtils from './HttpUtils';
import config from '../../config.js'

// export default function ApiUtils(Urls) {
//   let result = {}, list = [];
//   const baseUrl = config.baseUrl;
//   Object.keys(Urls).forEach(function (name) {
//     let value = Urls[name];
//     if (typeof value === 'string') {
//       list.push({
//         name,
//         uri: baseUrl + value,
//         action: '未知'
//       });
//     } else if (value.length) {
//       list.push({
//         name,
//         uri: baseUrl + value[0],
//         ...value[1]
//       });
//     }
//   });

//   list.forEach(function (item) {
//     let name = item.name, url = item.uri, method = item.method || 'post', action = item.action;
//     result[name] = async function (params, config = {}) {
//       const response = await HttpUtils[method](url, params, config);
//       console.log(`------------------ 请求结束:${action}`)
//       if (response.code === 0 || response.code === 10000) {
//         return Promise.resolve(response);
//       } else {
//         return Promise.reject(response);
//       }
//     };
//   });

//   return result;

// }
export default class ApiUtils {
  constructor(Urls) {
    this.Urls = Urls
    // 最大并发量
    this.maxLimit = 5;
    // 请求队列,若当前请求并发量已经超过maxLimit,则将该请求加入到请求队列中
    this.requestQueue = [];
    // 当前并发量数目
    this.currentConcurrent = 0;
    this.result = {}
    this.list = []
    // 基本请求地址
    this.baseUrl = config.baseUrl
    this.init()
  }
  init(){
    let that = this
    let Urls = this.Urls
    let result = {}, list = [];
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
          ...value[1]
        });
      }
    });
    that.list.forEach(function (item) {
      let name = item.name, url = item.uri, method = item.method || 'post', action = item.action;
      that.result[name] = async function (params, myConfig = {}) {
        // 若当前请求数并发量超过最大并发量限制，则将其阻断在这里。
        // startBlocking会返回一个promise，并将该promise的resolve函数放在this.requestQueue队列里。这样的话，除非这个promise被resolve,否则不会继续向下执行。
        // 当之前发出的请求结果回来/请求失败的时候，则将当前并发量-1,并且调用this.next函数执行队列中的请求
        // 当调用next函数的时候，会从this.requestQueue队列里取出队首的resolve函数并且执行。这样，对应的请求则可以继续向下执行。
        if (that.currentConcurrent >= that.maxLimit) {
          await that.startBlocking();
        }
        try {
          that.currentConcurrent++;
          const response = await HttpUtils[method](url, params, myConfig);
          console.log(`------------------ 请求结束:${action}`)
          if (response.code === 0 || response.code === 10000) {
            return Promise.resolve(response);
          } else {
            return Promise.reject(response);
          }
        } catch (err) {
          return Promise.reject(err);
        } finally {
          console.log('当前并发数:', that.currentConcurrent);
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