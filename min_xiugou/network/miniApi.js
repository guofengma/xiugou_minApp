import ApiUtils from './api/ApiUtils';

const api = 
{
  /***************************** 秀场 ************************ */
  "getDiscoverById": [
    "/discover/getById",
    {
      "action": "获取文章详情",
      "method": "get",
      "encrypt": false
    }
  ],
  /***************************** 注册 ************************ */
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
  /********************* 设置 ************************ */
  'updateUserById': [ // type:1:修改头像 2:修改名字 3:修改省市区 6:修改导师简介
    '/user/updateUserById',
    {
      "action": "修改用户信息",
      "method": "post",
      "encrypt": false
    }
  ],
  /********************* 注册 ************************ */
  'findMemberByPhone': [
    '/user/userSign/findMemberByPhone',
    {
      "action": "手机号注册",
      "method": "post",
      "encrypt": true
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
  /***************** 产品相关********************** */
  'getKeywords': [
    '/product/getKeywords',
    {
      "action": "动态搜索框关键词匹配",
      "method": "get",
      "encrypt": false,
      'isShowLoading': false,
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
      "action": "产品详情",
      "method": "get",
      "encrypt": false
    }
  ],
  'activityByProductId': [
    '/operator/activity/queryByProductCode',
    {
      "action": "获取是否是活动产品",
      "method": "get",
      "encrypt": false,
    }
  ],
  /***************** 营销模块********************** */
  'getActivityDepreciateById': [
    '/operator/activityDepreciate/findById',
    {
      "action": "获取降价拍详情",
      "method": "get",
      "encrypt": false,
      'isShowLoading': false,
    }
  ],
  'getActivitySeckillById': [
    '/operator/seckill/findByCode',
    {
      "action": "获取秒杀详情",
      "method": "get",
      "encrypt": false,
      'isShowLoading': false,
    }
  ],
  'getGiftBagDetail': [
    '/operator/activitypackage/findActivityPackageDetail',
    {
      "action": "礼包详情",
      "method": "get",
      "encrypt": false,
    }
  ],
  'addActivitySubscribe': [ //  type: 1,  1订阅 0 取消订阅
    '/activity/activitySubscribe/addActivitySubscribe',
    {
      "action": "订阅提醒",
      "method": "post",
      "encrypt": false,
    }
  ],
  /********************** 购物车 ******************************/
  'getShoppingCartList': [
    '/user/shoppingcart/list',
    {
      "action": "查询购物车",
      "method": "post",
      "encrypt": false,
    }
  ],
  'addToShoppingCart': [
    '/user/shoppingcart/addItem',
    {
      "action": "加入购物车",
      "method": "post",
      "encrypt": false,
    }
  ],
  'deleteShoppingCart': [
    '/user/shoppingcart/deleteItem',
    {
      "action": "删除购物车",
      "method": "post",
      "encrypt": false,
    }
  ],
  'getRichItemList': [
    '/user/shoppingcart/getRichItemList',
    {
      "action": "未登录时，获取购物车详细信息列表",
      "method": "post",
      "encrypt": false,
    }
  ],
  'shoppingCartFormCookieToSession': [
    '/user/shoppingcart/loginArrange',
    {
      "action": "登录合并购物车",
      "method": "post",
      "encrypt": false,
    }
  ],
  'shoppingcart0neMoreOrder': [
    '/user/shoppingcart/oneMoreOrder',
    {
      "action": "再来一单",
      "method": "post",
      "encrypt": false,
    }
  ],
  'updateShoppingCart': [
    '/user/shoppingcart/updateItem',
    {
      "action": "购物车更新商品",
      "method": "post",
      "encrypt": false,
      'isShowLoading': false,
    }
  ],
}

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