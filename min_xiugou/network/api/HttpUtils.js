import RSA from '../../tools/rsa.js';
import {
  Tool,
  Storage
} from '../../tools/tcglobal';

export default class HttpUtils {
  static getHeaders(url, params, config={}, method) {
    // 是否需要加签
    const rsa_headers = config.encrypt ? this.getRsaHeaders(url, params, method) : {};
    return  {
      'content-type': 'application/json',
      'device': global.Storage.getPlatform() || '', // 设备唯一标识
      'platform': 'mini', // 小程序标识
      'deviceVersion': wx.getSystemInfoSync().system || '', // 系统版本号
      'sg-token': global.Storage.getToken() || '', // 用户token
      ...rsa_headers
    }
  }
  static get(url, params, config = {}) {
    return this.request(url, params, config, 'get')
  }

  static post(url, params, config = {}) {
    return this.request(url, params, config,'post')
  }
  static request(url, params, config, method) {
    const isShowLoading = this.showLoading(config)
    if (isShowLoading) {
      global.Tool.showLoading();
    }
    let sysInfo = global.Storage.sysInfo()
    if (sysInfo) { 
      params = {
        ...params,
        device: sysInfo.model,// 手机型号
        wechatVersion: sysInfo.version,// 微信版本
        systemVersion: sysInfo.system, // 系统版本
      }
    }
    const headers = this.getHeaders(url, params, config, method)
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: params,
        dataType: 'json',
        method: method,
        header: headers,
        success: function (res) {
          if (isShowLoading) {
            global.Tool.hideLoading();
          }
          resolve(res.data);
        },
        fail: function (res) {
          reject(res.data);
        },
        complete: function (res) {
          console.log(res.data)
        }
      });
    }) 
  }
  // 获取验签header
  static getRsaHeaders(url, params, method) {
    let rsa_headers = {};
    console.log(`对${url}进行加签处理`);
    rsa_headers = RSA.sign(params);
    if (method.toUpperCase() == 'POST') {
      rsa_headers = RSA.sign(this.query2Object(url));
    }
    return rsa_headers;
  }

  static query2Object(str) {
    let url = str || document.URL;
    // removeURLAnchor
    url.indexOf('#') > 0 && (url = url.substring(0, url.indexOf('#')))
    let e = {},
      t = url,
      o = t.split('?').slice(1).join('');
    if (o.length < 3) {
      return e;
    }
    for (let n = o.split('&'), i = 0; i < n.length; i++) {
      let r = n[i], d = r.indexOf('=');
      if (!(0 > d || d === r.length - 1)) {
        let p = r.substring(0, d), s = r.substring(d + 1);
        0 !== p.length && 0 !== s.length && (e[p] = decodeURIComponent(s));
      }
    }
    return e;
  }
  
  static showLoading(config){
    if (config.isShowLoading !== false) {
      return true
    } else {
      return false
    }
  }
}