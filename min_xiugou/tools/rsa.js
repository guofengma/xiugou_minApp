import jsrsasign from './jsrassign';
import rsa_config from './ras_config';
import config from '../config.js'

let key = '-----BEGIN PRIVATE KEY-----' + rsa_config.rsa_key + '-----END PRIVATE KEY-----';

function getRandomString(len) {
  len = len || 32;
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  let maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

const RSA = {
  sign(params = {}) {
    let result = [];
    let nonce = getRandomString(16);
    let timestamp = +new Date();
    let client = rsa_config.client;
    let version = rsa_config.version;
    let map = {
      nonce,
      timestamp,
      client,
      version,
      ...params
    };
    for (let key in map) {
      result.push(key + '=' + map[key]);
    }
    result.sort();
    try {
      let sig = new jsrsasign.crypto.Signature({ 'alg': 'SHA256withRSA' });
      sig.init(key);
      sig.updateString(result.join('&'));
      let s = sig.sign();
      return {
        nonce,
        timestamp,
        client,
        version,
        sign: jsrsasign.hex2b64(s)
      };
    } catch (e) {
      console.log(e);
      return '';
    }
  },
  // checkInWhiteList(url) {
  //   return rsa_config.whiteList.includes(url.replace(config.baseUrl,''));
  // }
}
export default RSA;