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