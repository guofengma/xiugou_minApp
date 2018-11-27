import RSA from '../../tools/rsa.js';
import {
  Tool,
  Storage
} from '../../tools/tcglobal';

export default class HttpUtils {
  constructor() {
    this.Headers = {
      'content-type': 'application/json',
      'device': Storage.getPlatform() || '',
      'platform': 'mini',
      'version': wx.getSystemInfoSync(),
      'sg-token': Storage.getToken() || '',
    }
    //当前尝试的次数
    this.tryCount = 0;
    //最多尝试重发请求的次数
    this.maxTryCount = 2;
  }
  static get(url, params, config = {}) {
    
    const rsa_headers = config.encrypt ? this.getRsaHeaders(url, params, 'get') : {};
    const isShowLoading = this.showLoading(config)
    if (isShowLoading){
      Tool.showLoading();
    }
    const headers = {
      ...this.Headers,
      ...rsa_headers
    };
    return new Promise((resolve, reject)=> {
      wx.request({
        url: url,
        data: params,
        dataType: 'json',
        method: 'get',
        header: headers,
        success: function (res) {
          if (isShowLoading) {
            Tool.hideLoading();
          }
          if (res.data.code == '10000' || res.data.code === 0) {
            resolve(res.data);
          }
          else {
            reject(res.data);
          }
        },
        fail: function () {
          reject(res.data);
        },
        complete: function (res) {

        }
      });
    }) 
    
  }

  static post(url, params, config = {}) {
    const rsa_headers = config.encrypt ? this.getRsaHeaders(url, params, 'post') : {};
    const isShowLoading = this.showLoading(config)
    if (isShowLoading) {
      global.Tool.showLoading();
    }
    const headers = {
      ...this.Headers,
      ...rsa_headers
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: params,
        dataType: 'json',
        method: 'post',
        header: headers,
        success: function (res) {
          if (isShowLoading) {
            global.Tool.hideLoading();
          }
          if (res.data.code == '10000' || res.data.code === 0) {
            resolve(res.data);
          }
          else {
            reject(res.data);
          }
        },
        fail: function () {
          reject(res.data);
        },
        complete: function (res) {

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