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
  ],
  'updateUserById': [ // type:1:修改头像 2:修改名字 3:修改省市区 6:修改导师简介
    '/user/updateUserById',
    {
      "action": "修改用户信息",
      "method": "post",
      "encrypt": false
    }
  ],
  'findLeader': [
    '/user/findLeader',
    {
      "action": "查看导师详情",
      "method": "get",
      "encrypt": false
    }
  ],
  'queryInviterList': [
    '/user/userSign/queryInviterList',
    {
      "action": "注册时随机显示的八个V4层级邀请人",
      "method": "post",
      "encrypt": false
    }
  ],
  'mentorBind': [
    '/user/userSign/mentorBind',
    {
      "action": "导师绑定<为你转身!>",
      "method": "get",
      "encrypt": false
    }
  ],
  'findMemberByPhone': [
    '/user/userSign/findMemberByPhone',
    {
      "action": "手机号注册",
      "method": "post",
      "encrypt": true
    }
  ],
  'searchProduct': [
    '/product/productList',
    {
      "action": "搜索产品",
      "method": "post",
      "encrypt": false
    }
  ],
  'getProductDetailByCode': [
    '/product/getProductDetailByCode',
    {
      "action": "搜索产品",
      "method": "get",
      "encrypt": false
    }
  ],
  'getKeywords': [
    '/product/getKeywords',
    {
      "action": "动态搜索框关键词匹配",
      "method": "get",
      "encrypt": false,
      'isShowLoading': false,
    }
  ],
  'activityByProductId': [
    '/operator/activity/queryByProductId',
    {
      "action": "获取是否是活动产品",
      "method": "get",
      "encrypt": false,
    }
  ],
  'getHotWordsListActive': [
    '/config/sysHotWord/queryHotName',
    {
      "action": "获取是否是活动产品",
      "method": "get",
      "encrypt": false,
    }
  ],
}

// const API = ApiUtils(api);
const API = new ApiUtils(api).result;
/*
* 使用说明
      API.queryAdList({
        'type': 1,
      },{xxx:xxxx}).then((res) => {
        
      }).catch((res) => {
        
      });
* */

export default API;