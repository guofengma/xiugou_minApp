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
  ]
}

const API = ApiUtils(api);
/*
* 使用说明
* API.getProductDetail({id:1},{ headers: {'sg-token': token }).then(res=>{}).catch(err=>{})
* */

export default API;