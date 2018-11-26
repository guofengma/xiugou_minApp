import ApiUtils from './api/ApiUtils';

const api = 
{
  "getDiscoverById": [
    "/discover/getById",
    {
      "action": "获取文章详情",
      "method": "get",
      "encrypt": false
    }
  ],
  'queryAdList':[
    '/config/advertisement/queryAdvertisementList',
    {
      "action": "获取文章详情",
      "method": "post",
      "encrypt": false,// 是否加签
      'isShowLoading':true, //是否展示 loading
    }
  ]
}

// const API = ApiUtils(api);
const API = new ApiUtils(api).result;
/*
* 使用说明
      API.queryAdList({
        'type': 1,
      }).then((res) => {
        
      }).catch((res) => {
        
      });
* */

export default API;