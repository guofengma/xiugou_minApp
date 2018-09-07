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
};

module.exports = TCGlobal;