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
      'isShowLoading':true, //是否展示 loading 默认打印
      'isShowErrMsg':false, // 是否弹出接口的报错信息  默认打印
    }
  ],
  'indexQueryCategoryList':[
    '/config/advertisement/queryCategoryList',
    {
      "action": "获取首页4个分类",
      "method": "get",
      "encrypt": false
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