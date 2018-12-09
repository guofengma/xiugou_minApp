import ApiUtils from './api/ApiUtils';

const api = {
  /***************************** 秀场 ************************ */
  "getDiscoverById": [
    "/discover/getById",
    {
      "action": "获取文章详情",
      "method": "get",
      "encrypt": false
    }
  ],
  /***************************** 短信 ************************ */
  /* 统一的短信接口
        1. code对应传递值-------> 用户注册：MOBILE_REGISTRATION_CODE 
        手机验证码登录：MOBILE_CODELOGIN_CODE 
        设置交易密码：MOBILE_SETDEALPASSWORD_CODE 
        忘记交易密码：MOBILE_FORGETDEALPASSWORD_CODE 
        手机号修改验证旧手机：MOBILE_VERIFYAULDPHONE_CODE 
        手机号修改绑定新手机：MOBILE_VERIFYNEWPHONE_CODE
        登录时忘记密码：MOBILE_FORGETPASSWORD_CODE
        2. phone:string
        2018年10月18日接口修改 短信接口只需传phone即可  @ydg
  */
  'sendMessage': [
    '/sms/sendRegMessage',
    {
      "action": "获取验证码",
      "method": "get",
      "encrypt": true,// 是否加签
    }
  ],
  /***************************** 设置 ************************ */
  'updateDealerPhoneById': [
    '/user/judgePhoneCode',
    {
      "action": "验证旧手机短信是否正确",
      "method": "post",
      "encrypt": false,// 是否加签
    }
  ],
  'updateDealerNewPhone': [
    '/user/updatePhone',
    {
      "action": "修改手机号",
      "method": "post",
      "encrypt": false,// 是否加签
    }
  ],
  'exitLogin': [
    '/user/userLogin/signOut',
    {
      "action": "退出登录",
      "method": "get",
      "encrypt": false,// 是否加签
    }
  ],
  'queryDictionaryDetailsType': [
    '/config/sysDictionary/queryDictionaryTypeList',
    {
      "action": "获取数据字典",
      "method": "get",
      "encrypt": false,// 是否加签
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
  /**********************分享**************************/
  "shareClick": [
    "/user/shareClick",
    {
      "method": "get",
      "action": "分享点击",
      "isShowErrMsg": false,
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
    '/operator/activityDepreciate/findByCode',
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
      "action": "获取秒杀详情",
      "method": "get",
      "encrypt": false,
      'isShowLoading': false,
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
  /**********************订单售后**************************/
  'afterSaleList': [
    '/after-sale/list',
    {
      "action": "售后列表查询",
      "method": "post",
      "encrypt": false,
    }
  ],
  'applyAfterSale': [  //type 1.仅退款 2.退货退款 3.换货
    '/after-sale/apply',
    {
      "action": "申请售后",
      "method": "post",
      "encrypt": false,
    }
  ],
  'afterSaleDetail': [
    '/after-sale/detail',
    {
      "action": "售后详情",
      "method": "post",
      "encrypt": false,
    }
  ],
  'afterSaleOrderDetail': [
    '/after-sale/order-detail',
    {
      "action": "售后子订单详情",
      "method": "post",
      "encrypt": false,
    }
  ],
  'cancelAfterSale': [
    '/after-sale/cancel',
    {
      "action": "撤销售后",
      "method": "post",
      "encrypt": false,
    }
  ],
  'modifyAfterSale': [
    '/after-sale/modify',
    {
      "action": "修改售后申请",
      "method": "post",
      "encrypt": false,
    }
  ],
  'afterSaleExpress': [
    '/after-sale/express',
    {
      "action": "填写寄回物流单号接口",
      "method": "post",
      "encrypt": false,
    }
  ],
  /**********************订单**************************/
  'makeSureOrder': [
    '/order/confirm',
    {
      "action": "确认订单",
      "method": "post",
      "encrypt": false,
    }
  ],
  'submitOrder': [
    '/order/submit',
    {
      "action": "确认订单",
      "method": "post",
      "encrypt": false,
    }
  ],
  'queryOrderPageList': [
    '/order/list',
    {
      "action": "用户订单列表",
      "method": "get",
      "encrypt": false,
    }
  ],
  'searchOrder': [
    '/order/search',
    {
      "action": "订单搜索",
      "method": "post",
      "encrypt": false,
    }
  ],
  'getOrderDetail': [
    '/order/detail',
    {
      "action": "订单详情",
      "method": "post",
      "encrypt": false,
    }
  ],
  'confirmReceipt': [
    '/order/confirm-receipt',
    {
      "action": "订单确认收货",
      "method": "post",
      "encrypt": false,
    }
  ],
  'cancelOrder': [
    '/order/cancel',
    {
      "action": "取消订单",
      "method": "post",
      "encrypt": false,
    }
  ],
  'deleteOrder': [
    '/order/delete',
    {
      "action": "删除订单",
      "method": "post",
      "encrypt": false,
    }
  ],
  'orderOneMore': [
    '/order/another',
    {
      "action": "再次购买",
      "method": "post",
      "encrypt": false,
    }
  ],
  /************************** 优惠券 *******************************/
  "availableDiscountCouponForProduct": [
    "/user/coupon/listAvailable",
    {
      "method": "post",
      "action": "产品可用优惠劵列表",
      "isShowErrMsg": false,
    }
  ],
  "couponList": [ // status 优惠券状态 0-未使用 1-已使用 2-已失效 3-未激活
    "/user/coupon/listAvailable",
    {
      "method": "post",
      "action": "优惠劵列表",
      "isShowErrMsg": false,
    }
  ],
  /************************** 支付 *******************************/
  "wxPay": [ // status 优惠券状态 0-未使用 1-已使用 2-已失效 3-未激活
    "/pay/wxminipay",
    {
      "method": "post",
      "action": "微信支付",
    }
  ],
  'sgpay':[
    "/pay/sgpay",
    {
      "method": "post",
      "action": "平台支付",
    }
  ],
   /************************** 物流 *******************************/
  'findAllExpress': [
    "/express/query",
    {
      "method": "get",
      "action": "物流公司选择",
    }
  ],
  'getOrderDeliverInfo': [
    '/order/deliverInfo',
    {
      "action": "订单物流信息",
      "method": "post",
      "encrypt": false,
    }
  ],
  'getOrderDeliverInfoDetail': [
    '/order/deliverInfoDetail',
    {
      "action": "单个物流详情",
      "method": "post",
      "encrypt": false,
    }
  ],
  /************************** 帮助中心 *******************************/
  'addFeedback': [
    '/user/feedback/addFeedback',
    {
      "action": "添加反馈",
      "method": "post",
      "encrypt": false,
    }
  ],
  'queryHelpQuestionList': [
    '/help/helpQuestion/queryHelpQuestionList',
    {
      "action": "问题列表",
      "method": "get",
      "encrypt": false,
    }
  ],
  'updateHelpQuestion': [
    '/help/helpQuestion/updateHelpQuestionToClick',
    {
      "action": "解决问题是否有用",
      "method": "post",
      "encrypt": false,
    }
  ],
  'findHelpQuestionById': [
    '/help/helpQuestion/findHelpQuestionById',
    {
      "action": "根据ID查询问题详情",
      "method": "get",
      "encrypt": false,
    }
  ],
  'findQuestionEffectById': [
    '/help/helpQuestion/findQuestionEffectById',
    {
      "action": "获取帮助次数",
      "method": "get",
      "encrypt": false,
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