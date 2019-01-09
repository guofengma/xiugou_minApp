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
    "getDiscoverByCode": [
        "/discover/getByCode",
        {
            "action": "获取文章详情",
            "method": "get",
            "encrypt": false
        }
    ],
    "queryDiscoverListByType": [ // 获取发现列表 type { 1：精选 2：热门 3：推荐 4：最新 全部则不传}, page, size
        "/discover/query",
        {
            "action": " 获取发现列表",
            "method": "get",
            "encrypt": false
        }
    ],
    "discoverCountCancel": [
        "/discover/count/cancel",
        {
            "action": "取消 点赞/收藏",
            "method": "post",
            "encrypt": false
        }
    ],
    "discoverCountSave": [
        "/discover/count/save",
        {
            "action": "点赞/收藏",
            "method": "post",
            "encrypt": false
        }
    ],
    "queryDiscoverCollect": [
        "/discover/queryCollect",
        {
            "action": "获取收藏列表",
            "method": "get",
            "encrypt": false
        }
    ],
    "discoverNotice": [
        "/discover/query",
        {
            "action": "秀场头条",
            "method": "get",
            "encrypt": false,
            'isShowLoading': false,
            "isShowErrMsg": false,
        }
    ],
    /***************************** 任务 ************************ */
    "addJobs": [
        "/user/userJobs/add",
        {
            "action": "领取任务",
            "encrypt": false,
            "method": "post",
            "isShowErrMsg": false,
        }
    ],
    "findUserJobsByUserId": [
        "/user/userJobs/findUserJobsByUserId",
        {
            "action": "查询是否有任务",
            "method": "get",
            "encrypt": false,
            "isShowErrMsg": false,
        }
    ],
    "findByJobId": [
        "/user/userJobs/findByJobId",
        {
            "action": "获取任务详情",
            "method": "get",
            "encrypt": false,
            "isShowErrMsg": false,
        }
    ],
    "queryJobsByUserId": [
        "/user/userJobs/queryJobsByUserId",
        {
            "action": "获取我的任务列表",
            "method": "get",
            "encrypt": false,
            "isShowErrMsg": false,
        }
    ],
    "jobIncrHits": [
        "/user/userJobs/incrHits",
        {
            "action": "获取分享详情",
            "method": "post",
            "encrypt": false
        }
    ],
    "checkScratchCodeStatus": [
        "/scratch/scratchCardInformation/findByCode",
        {
            "action": "验证刮刮卡使用状态",
            "method": "post",
            "encrypt": false
        }
    ],
    "userExtVerify": [
        "/user/userLogin/scratchUserVerify",
        {
            "action": "查询用户是否已注册",
            "method": "get",
            "encrypt": false
        }
    ],
    "getScratchCard": [
        "/scratch/scratchCard/findByCode",
        {
            "action": "获取刮刮卡",
            "method": "post",
            "encrypt": false
        }
    ],
    "getScratchAward": [
        "/scratch/scratchCardInformation/findById",
        {
            "action": "领取刮刮卡奖励",
            "method": "get",
            "encrypt": false
        }
    ],
    "existedUserByOpenId": [
        "/user/userLogin/existedUserByOpenId",
        {
            "action": "根据用户openid检验是否注册",
            "method": "post",
            "encrypt": false
        }
    ],
    /***************************** 上传图片 ************************ */
    'aliyunOSSUploadImage': [
        '/common/upload/oss',
        {
            "action": "获上传图片",
            "method": "uploadImage",
            "encrypt": true,// 是否加签
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
    'updateDealerPassword': [
        '/user/updateLoginPassword',
        {
            "action": "修改密码",
            "method": "post",
            "encrypt": false,// 是否加签
        }
    ],
    /* QXDD  取消订单
     TKLY  退款理由
     HHLY  换货理由
     THYK  退货退款
     WTLX  问题类型
     SMBH  实名驳回
     JJTK  拒接退款
     CPBS  产品报损
     GGW  广告位
     JSBH  结算驳回 */
    'queryDictionaryDetailsType': [
        '/config/sysDictionary/queryDictionaryTypeList',
        {
            "action": "获取数据字典",
            "method": "get",
            "encrypt": false,// 是否加签
        }
    ],
    /***************************** 地址 ************************ */
    'addUserAddress': [
        '/user/userAddress/save',
        {
            "action": "新增地址 或 修改地址(传id)",
            "method": "post",
            "encrypt": false,// 是否加签
        }
    ],
    'queryUserAddressList': [
        '/user/userAddress/query',
        {
            "action": "获取列表",
            "method": "get",
            "encrypt": false,// 是否加签
        }
    ],
    'setDefaultAddress': [
        '/user/userAddress/setDefault',
        {
            "action": "设置默认地址",
            "method": "post",
            "encrypt": false,// 是否加签
        }
    ],
    'deleteAddress': [
        '/user/userAddress/delete',
        {
            "action": "删除地址 ",
            "method": "post",
            "encrypt": false,// 是否加签
        }
    ],
    /***************************** 首页接口 ************************ */
    /*
     查询广告位列表
     type：1.APP首页banner广告位   2.APP首页推荐位   3.APP首页明星店铺推荐位    4.APP首页今日榜单广告位
     5.APP首页精品推荐广告位  6.APP首页超值热卖广告位  7.APP首页专题广告位  8.APP首页为你推荐广告位
     9.拼店首页banner推荐位  10.类目搜索banner广告位
     status： 1.有效 2.无效
     linkType：1.链接产品2.链接专题3.降价拍4.秒杀5.礼包
     */
    'queryAdList': [
        '/config/advertisement/queryAdvertisementList',
        {
            "action": "获取文章详情",
            "method": "post",
            "encrypt": false,// 是否加签
            'isShowErrMsg': false, // 是否弹出接口的报错信息  默认打印
        }
    ],
    'indexQueryCategoryList': [
        '/config/advertisement/queryCategoryList',
        {
            "action": "获取首页4个分类",
            "method": "get",
            "encrypt": false
        }
    ],
    'queryFeaturedList': [
        '/config/advertisement/queryRecommendedPageList',
        {
            "action": "获取首页4个分类",
            "method": "post",
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
    'givePackage': [
        '/user/userSign/givePackage',
        {
            "action": "获取红包",
            "method": "get",
            "encrypt": false
        }
    ],
    /********************* 登录 ************************ */
    'verifyWechat': [
        '/user/userLogin/verifyWechat',
        {
            "action": "验证openid是否注册",
            "method": "post",
            "encrypt": false,
            "isShowErrMsg": false,
        }
    ],
    'wechatLogin': [
        '/user/userLogin/wechatLogin',
        {
            "action": "微信登陆",
            "method": "post",
            "encrypt": false,
            "isShowErrMsg": false,
        }
    ],
    'sweepCode': [
        '/user/invite/checkValid',
        {
            "action": "邀请码是否过期",
            "method": "post",
            "encrypt": false,
            "isShowErrMsg": false,
        }
    ],
    'getLevel': [
        '/user/getUser',
        {
            "action": "获取用户信息",
            "method": "get",
            "encrypt": false,
            'isShowLoading': false,
            "isShowErrMsg": false,
        }
    ],
    /**********************消息**************************/
    'noticeMessageCount': [
        '/notice/newNoticeMessageCount',
        {
            "action": "获取用户信息",
            "method": "get",
            "encrypt": false,
            "isShowErrMsg": false,
            'isShowLoading': false,
        }
    ],
    'queryNoticeMessage': [
        '/notice/queryNoticePage',
        {
            "action": "通知详情",
            "method": "post",
            "encrypt": false
        }
    ],
    'queryMessage': [
        '/message/queryMessagePage',
        {
            "action": "消息",
            "method": "post",
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
            "method": "get",
            "encrypt": false,
        }
    ],
    'addToShoppingCart': [
        '/user/shoppingcart/save',
        {
            "action": "加入购物车",
            "method": "post",
            "encrypt": false,
        }
    ],
    'deleteShoppingCart': [
        '/user/shoppingcart/delete',
        {
            "action": "删除购物车",
            "method": "post",
            "encrypt": false,
        }
    ],
    'updateShoppingCart': [
        '/user/shoppingcart/update',
        {
            "action": "购物车更新商品",
            "method": "post",
            "encrypt": false,
            'isShowLoading': false,
        }
    ],
    'getRichItemList': [
        '/user/shoppingcart/getRichItem',
        {
            "action": "未登录时，获取购物车详细信息列表",
            "method": "post",
            "encrypt": false,
        }
    ],
    'shoppingcart0neMoreOrder': [ // 取消了 合并到加入购物车的接口了
        '/user/shoppingcart/oneMoreOrder',
        {
            "action": "再来一单",
            "method": "post",
            "encrypt": false,
        }
    ],
    'shoppingCartFormCookieToSession': [ // 取消了 合并到加入购物车的接口了
        '/user/shoppingcart/loginArrange',
        {
            "action": "登录合并购物车",
            "method": "post",
            "encrypt": false,
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
            transformResponse: (res)=> {
                let datas = res.data || {}
                let imgList = datas.imgList || ''
                datas.showImgList = imgList.split(',')
                datas.createTime = global.Tool.formatTime(datas.createTime)
                // 平台地址
                let refundAddress = datas.refundAddress || {}
                refundAddress.addressInfo = (refundAddress.province || '') + (refundAddress.city || "") + (refundAddress.area || "") + (refundAddress.address || "")
            }
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
            "encrypt": true,
            'isShowErrMsg': false,
        }
    ],
    'submitOrder': [
        '/order/submit',
        {
            "action": "确认订单",
            "method": "post",
            "encrypt": true,
            'isShowErrMsg': false,
        }
    ],
    'depreciateSubmit': [ // submitType:提交类型 1：确认订单，2：提交订单
        '/operator/activityDepreciate/submit',
        {
            "action": "降价拍-提交订单",
            "method": "post",
            "encrypt": true,
            'isShowErrMsg': false,
        }
    ],
    'seckillSubmit': [ // submitType:提交类型 1：确认订单，2：提交订单
        '/operator/seckill/submit',
        {
            "action": "秒杀-提交订单",
            "method": "post",
            "encrypt": true,
            'isShowErrMsg': false,
        }
    ],
    'giftSubmit': [ // submitType:提交类型 1：确认订单，2：提交订单
        '/operator/activitypackage/submit',
        {
            "action": "秒杀-提交订单",
            "method": "post",
            "encrypt": true,
            'isShowErrMsg': false,
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
    'countUserOrderNum': [
        '/order/count',
        {
            "action": "获取订单数量",
            "method": "post",
            "encrypt": false,
            'isShowLoading': false,
            'isShowErrMsg': false,
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
        "/user/coupon/list",
        {
            "method": "post",
            "action": "优惠劵列表",
            "isShowErrMsg": false,
        }
    ],
    "couponListActive": [ // status 优惠券状态 0-未使用 1-已使用 2-已失效
        "/user/coupon/queryByUserCode",
        {
            "method": "get",
            "action": "活动优惠劵列表",
            "isShowErrMsg": false,
        }
    ],
    /************************** 支付 *******************************/
    "wxPay": [ // status 优惠券状态 0-未使用 1-已使用 2-已失效 3-未激活
        "/pay/wxminipay",
        {
            "method": "post",
            "action": "微信支付",
            "encrypt": false,
        }
    ],
    'sgpay': [
        "/pay/sgpay",
        {
            "method": "post",
            "action": "平台支付",
            "encrypt": false,
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
    /**********  获取省市区 *******************/
    'queryAreaList': [
        '/config/sysArea/queryAreaList',
        {
            "action": "获取省市区",
            "method": "get",
            "encrypt": false,
            "isShowErrMsg": false,
            'isShowLoading': false,
        }
    ],
    /**********  签到 *******************/
    'getTokenCionExchange': [
        '/common/config/getExchange',
        {
            "action": "获取秀豆兑换1元卷的比例",
            "method": "get",
            "encrypt": false,
        }
    ],
    'querySignList': [
        '/user/userSign/querySignList',
        {
            "action": "签到",
            "method": "get",
            "encrypt": false,
        }
    ],
    'exchangeTokenCoin': [
        '/user/exchangeTokenCoin',
        {
            "action": "兑换一元券",
            "method": "post",
            "encrypt": false,
        }
    ],
    'tokenCoinSign': [
        '/user/userSign/sign',
        {
            "action": "签到获取秀豆",
            "method": "post",
            "encrypt": false,
        }
    ],
    /***************************** 我的账户 ************************ */
    'getUserrScore': [
        '/user/userScore/query',
        {
            "action": "查询秀豆账户",
            "method": "get",
            "encrypt": false,
        }
    ],
    'getuserBalance': [ // 'type':1 现金
        '/user/userBalance/query',
        {
            "action": "分页查询现金/待提现账户",
            "method": "get",
            "encrypt": false,
        }
    ],
    /***************************** 专题 ************************ */
    'getTopicById': [
        '/topic/findByCode',
        {
            "action": "获取专题列表",
            "method": "get",
            "encrypt": false,
        }
    ],
    /***************************** 推广 ************************ */
    'promotionPromoterPay': [
        '/promotion/promotionPromoter/pay',
        {
            "action": "支付红包费用",
            "method": "get",
            "encrypt": false,
        }
    ],
    /***************************** 我的晋升 ************************ */
    'getUserLevelInfo': [
        '/user/getUserLevelInfo',
        {
            "action": "我的晋升",
            "method": "get",
            "encrypt": false,
        }
    ],
    'getNextLevelInfo': [
        '/user/level/getNextLevelInfo',
        {
            "action": "获取用户下一等级层级信息",
            "method": "get",
            "encrypt": false,
        }
    ],
    /***************************** 我的推广 ************************ */
    'givingPackageToUser': [
        '/promotion/promotionPromoter/givingPackageToUser',
        {
            "action": "详情页用户领取红包",
            "method": "get",
            "encrypt": false,
        }
    ],
    /***************************** 经验值专区 ************************ */

    'getOperatorDetail': [
        '/operator/act-exp/detail',
        {
            "action": "获取经验值专区详情",
            "method": "get",
            "encrypt": false,
        }
    ],
    'userReceivePackage': [
        '/promotion/promotionPromoter/userReceivePackage',
        {
            "action": "用户领取红包",
            "method": "get",
            "encrypt": false,
        }
    ],
    'receiveJobMoney': [
        '/user/userJobs/receiveMoney',
        {
            "action": "领取任务奖励",
            "method": "get",
            "encrypt": false,
        }
    ],
    'queryPromotionReceiveRecordPageList': [
        '/promotion/promotionReceiveRecord/queryPromotionReceiveRecordPageList',
        {
            "action": "分页查询用户领取红包记录列表",
            "method": "post",
            "encrypt": false,
        }
    ],
    'queryPromotionPackagePageList': [
        '/user/promotionPackage/queryPromotionPackagePageList',
        {
            "action": "推广红包列表",
            "method": "post",
            "encrypt": false,
        }
    ],
    'queryUserBuyPromotionPromoter': [
        '/promotion/promotionPromoter/queryUserBuyPromotionPromoter',
        {
            "action": "分页查询用户购买信息列表",
            "method": "post",
            "encrypt": false,
        }
    ],
    /***************************** 分类 ************************ */
    'findProductCategoryList': [
        '/product/productCategory/findProductCategoryList',
        {
            "action": "二、三级列表",
            "method": "get",
            "encrypt": false,
            "isShowErrMsg": false,
            'isShowLoading': false,
        }
    ],
    'findNameList': [
        '/product/productCategory/findNameList',
        {
            "action": "一级分类列表",
            "method": "post",
            "encrypt": false,
            "isShowErrMsg": false,
            'isShowLoading': false,
        }
    ],
    'findHotList': [
        '/product/productCategory/findHotList',
        {
            "action": "热门分类列表",
            "method": "post",
            "encrypt": false,
            "isShowErrMsg": false,
            'isShowLoading': false,
        }
    ],
    /***************************** 经验 ************************ */
    'getExpList': [
        '/user/detail',
        {
            "action": '获取经验列表',
            "method": "post",
            "encrypt": false
        }
    ]
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