/**
 * Created by weiwei on 11/6/18.
 */
'use strict';

import RequestQueue from './request-queue';
import RequestStatus from './request-status';
import config from '../../config.js'
import RSA from '../../tools/rsa.js'
//请求基类
export default class Request {
  constructor(bParam) {
    //request自己控制loading提示
    this.manageLoadingPrompt = bParam.isShowLoading

    this.baseUrl = config.baseUrl

    //拼接了bodyParam的最终url
    this._url = '';

    //用于日志输出
    this.name = 'base request';

    //请求方法
    this.requestMethod = bParam.requestMethod;

    //接收入参
    this.bodyParam = bParam;

    //最后拼接后传给服务器
    this._body = {};

    //响应结果
    this.responseObject = {};


    //当前尝试的次数
    this.tryCount = 0;

    //最多尝试重发请求的次数
    this.maxTryCount = 2;

    //请求的状态
    this.requestStatus = RequestStatus.waiting;

    //是否有队列管理请求
    this.isManagedByQueue = false;

    // header

    this.header = ''

    // cookie

    this.cookie = ''
    /**
     * 调用finishBlock前的预处理，可作为factory中的统一处理
     */
    this.preprocessCallback = (req, firstData) => { };

    //成功回调
    this.successBlock = (req, firstData) => { };

    //失败回调
    this.failBlock = (req) => { };

    //结束回调，不管成功or失败
    this.completeBlock = (req) => { };
  }

  //添加到请求队列中
  addToQueue() {
    this.isManagedByQueue = true;
    RequestQueue.addRequest(this);
  }

  /**
   * @param {string} query字符串 选填 http://www.mr.com/?a=1&b=2#login
   * @returns {object} {a:1,b:2}
   */
  query2Object(str) {
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

  //发起请求
  start() {
    let that = this;
    this.requestStatus = RequestStatus.requesting;
    if (this.manageLoadingPrompt) {
      global.Tool.showLoading();
    }
    let url = this.url();

    let body = this.body();

    let rsa_headers = '';
    // 只需对白名单内的url做加签处理
    if (RSA.checkInWhiteList(url)) {
      console.log(`对${url}进行加签处理`);
      rsa_headers = RSA.sign(body);
      if (this.requestMethod.toUpperCase() == 'POST') {
        rsa_headers = RSA.sign(this.query2Object(url));
      }
    }
    let app = getApp();
    wx.request({
      url: url,
      data: body,
      dataType: 'json',
      method: this.requestMethod,
      header: {
        'content-type': 'application/json',
        // 'Cookie': this.hasCookie(),
        'device': global.Storage.getPlatform() || '',
        'platform': this.bodyParam.systemVersion,
        'sg-token': global.Storage.getToken() || '',
        ...rsa_headers
      },
      success: function (res) {
        if (that.managerLoadingPrompt) {
          global.Tool.hideLoading();
        }
        that.header = res.header
        console.log('<============================== 请求结束：' + that.name);
        console.debug('result:');
        console.debug('==============================\n\n\n');

        //成功
        that.responseObject = res.data;
        //成功
        if (res.data.code == '10000' || res.data.code === 0) {
          let Datas = that.responseObject.data;
          let firstData = {};
          firstData = Datas
          //预处理，可以重新组织请求结果
          that.preprocessCallback(that, firstData)
          that.successBlock(that, firstData)
        }

        //失败，有异常
        else {
          //弹窗，提示服务器错误
          that.failBlock(that);
          app.aldstat.sendEvent(url,{
            url: url,
            errMsg: res.data.msg
          })
          console.log('==============='+res.data.msg+'===================')
          // global.Tool.showAlert(res.data.msg);
        }
      },
      fail: function () {
        app.aldstat.sendEvent(url+':interface error try again', {
          url: url,
          count: that.tryCount,
        })
        that.tryCount++;

        console.debug('<============================== 请求结束：' + that.name + '第' + that.tryCount + '次请求');
        console.debug('==============================\n\n\n');
        //请求失败重试
        if (that.tryCount < that.maxTryCount) {
          if (that.isManagedByQueue) {
            that.addToQueue();
          }
          else {
            that.start();
          }
        }

        //达到重试上限，提示错误
        else {
          //弹窗，提示服务器错误
          that.failBlock(that);
          global.Tool.showAlert('请求失败，请稍后重试')
        }
      },
      complete: function (res) {
        console.log(res.data)
        that.requestStatus = RequestStatus.finish;
        that.completeBlock(that);
        if(res.statusCode != 200) {
          app.aldstat.sendEvent(url+':interface status code err',{
            url: url,
            code: res.statusCode,
            msg: res.data
          })
        }
        if (that.isManagedByQueue) {
          RequestQueue.removeRequest(that);
        }

        if (that.manageLoadingPrompt) {
          global.Tool.hideLoading();
        }
      }
    });
    return this;
  }

  //拼接url
  url() {
    this._url = this.baseUrl + this.bodyParam.url
    return this._url;
  }

  //拼接body
  body() {
    delete this.bodyParam.url
    delete this.bodyParam.port
    delete this.bodyParam.isShowLoading
    delete this.bodyParam.requestMethod
    this._body = this.bodyParam
    return this._body;
  }

  // 是否带上cookie 请求 
  hasCookie() {
    if (this.bodyParam.hasCookie) {
      delete this.bodyParam.hasCookie
      this.cookie = global.Storage.getUserCookie() || ' '
      return this.cookie
    }
    delete this.bodyParam.hasCookie
  }
}

