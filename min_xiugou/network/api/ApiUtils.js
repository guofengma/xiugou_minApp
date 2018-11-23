const regeneratorRuntime = require('../../libs/asyncRuntime/runtime.js');
import HttpUtils from './HttpUtils';
import config from '../../config.js'

export default function ApiUtils(Urls) {
  let result = {}, list = [];
  const baseUrl = config.baseUrl;
  Object.keys(Urls).forEach(function (name) {
    let value = Urls[name];
    if (typeof value === 'string') {
      list.push({
        name,
        uri: baseUrl + value,
        action: '未知'
      });
    } else if (value.length) {
      list.push({
        name,
        uri: baseUrl + value[0],
        ...value[1]
      });
    }
  });

  list.forEach(function (item) {
    let name = item.name, url = item.uri, method = item.method || 'post', action = item.action;
    result[name] = async function (params, config = {}) {
      const response = await HttpUtils[method](url, params, config);
      console.log(`------------------ 请求结束:${action}`)
      if (response.code === 0 || response.code === 10000) {
        return Promise.resolve(response);
      } else {
        return Promise.reject(response);
      }
    };
  });

  return result;

}
