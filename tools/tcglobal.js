/**
 * Created by weiwei on 11/6/18.
 */

import Tool from './tool';
import RequestFactory from '../network/factory/request-read-factory';
import Operation from '../network/operation';
import Storage from './storage';
import Event from './event';

require('./DateFormat');

let TCGlobal = {
  Tool: Tool,
  Storage: Storage,
  Event: Event,
  RequestFactory: RequestFactory,
  Operation: Operation.sharedInstance(),
  version: 'V2.2.5', // 微信小程序版本
  BaiduMapKey: 'BazNALkeiEEMMvZjWmPeXlRqOyd0BlnL',
  AppId: 'wx228ac7ba52b9b1ed',//小程序AppID
  Secret: 'ac645290e3299966fabe3cf0d0034f9b',//小程序Secret
};

module.exports = TCGlobal;