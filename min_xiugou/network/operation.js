/**
 * Created by wiewei on 1/6/18.
 */

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;Ï
    }
}());

//操作常量定义
export default class Operation {

    constructor() {
        if (__instance()) return __instance();


    /*************  注册登录相关接口 *********************/
       
        // 验证openid是否注册
        this.verifyWechat = '/user/userLogin/verifyWechat'

        // 微信登陆
        this.wechatLogin = '/user/userLogin/wechatLogin'

        // 判断手机号是否可用
        this.findMemberByPhone = '/user/userSign/findMemberByPhone'

        // 注册
        this.signMember = '/user/userSign/signUser'

        // 获取推荐人列表
        this.queryInviterList = '/user/userSign/queryInviterList'

        // 邀请码注册

        this.updateUserCodeById = '/user/updateUserCodeById'
    
    /**********  获取数据字典 *******************/

      this.queryDictionaryDetailsType = '/config/sysDictionary/queryDictionaryTypeList'

    /********************** 搜索 *********************/  

        // 获取热搜词语
    
        this.getHotWordsListActive = '/config/sysHotWord/queryHotName'

        // 动态搜索框关键词匹配

        this.getKeywords = '/product/getKeywords'

    /********************** 分类 *********************/

        // 热门分类列表

        this.findHotList = '/product/productCategory/findHotList'

        // 一级分类列表

        this.findNameList = '/product/productCategory/findNameList'

        // 二、三级列表

        this.findProductCategoryList = '/product/productCategory/findProductCategoryList'

      /********************** 我的账户 *********************/

        // 我的晋升

        this.getUserLevelInfo = '/user/getUserLevelInfo'

        // 我的秀豆明细

        this.getUserrScore = '/user/userScore/query'

        // 我的余额

        this.getuserBalance= '/user/userBalance/query'



        /******************提交订单 订单结算*********************** */


        // 申请退款
   
        this.wxRefund = '/user/weChatPay/wxRefund'

        // 使用优惠券查询

        this.orderCalcDiscountCouponAndUseScore = '/order/order/orderCalcDiscountCouponAndUseScore'


        /******************我的---设置*********************** */

        //退出登录

        this.exitLogin ='/user/userLogin/signOut';

        // 获取用户信息

        this.getLevel = '/user/getUser'

        // 获取用户下一等级层级信息

        this.getNextLevelInfo ='/user/level/getNextLevelInfo'

        // 查询等级信息

        this.getLevelInfos = '/user/level/get'

        /******************我的---通讯录*********************** */

        //通讯录列表
        this.queryDealerAddressBook ='/user/dealer/queryDealerAddressBook';

        //通讯录详情

        this.findDealerAddressBookDetails ='/user/dealer/findDealerAddressBookDetails';

        // 修改用户信息 type:1:修改头像 2:修改名字 3:修改省市区
        
        this.updateUserById = '/user/updateUserById';

        // 上传图片的地址 

        this.aliyunOSSUploadImage = '/common/upload/oss'

        //  修改密码

        this.updateDealerPassword = '/user/updateLoginPassword';

        // 微信账号解绑 

        this.updateDealerOpenid ='/user/untiedWechat'

        //  修改手机号

        this.updateDealerNewPhone = '/user/updatePhone'

        // 验证旧手机短信是否正确

        this.updateDealerPhoneById = '/user/judgePhoneCode'


        // 邀请码

        this.createWxQrcode = '/user/dealer/createWxQrcode'

        // 邀请码是否过期

        this.sweepCode ='/user/invite/checkValid'

      /* 
        查询广告位列表 
        type：1.APP首页banner广告位   2.APP首页推荐位   3.APP首页明星店铺推荐位    4.APP首页今日榜单广告位
        5.APP首页精品推荐广告位  6.APP首页超值热卖广告位  7.APP首页专题广告位  8.APP首页为你推荐广告位
        9.拼店首页banner推荐位  10.类目搜索banner广告位
        status： 1.有效 2.无效
        linkType：1.链接产品2.链接专题3.降价拍4.秒杀5.礼包
      */

        this.queryAdList = '/config/advertisement/queryAdvertisementList'

        // 获取专题详情页

        this.getTopicDetail = '/user/topic/get'

        // 获取推荐产品

        this.queryFeaturedList = '/config/advertisement/queryRecommendedPageList'

        // 秀场头条

        this.discoverNotice = '/discover/query'

        // 四个分类

        this.indexQueryCategoryList ='/config/advertisement/queryCategoryList'


        /************************** 帮助中心 *******************************/

        // 解决问题是否有用

        this.updateHelpQuestion = '/help/helpQuestion/updateHelpQuestionToClick'

        // 根据ID查询问题详情

        this.findHelpQuestionById = '/help/helpQuestion/findHelpQuestionById'

        // 问题列表 可传参 也可以不传

        this.queryHelpQuestionList = '/help/helpQuestion/queryHelpQuestionList'

        // 添加反馈

        this.addFeedback = '/user/feedback/addFeedback'

        // 获取帮助次数

        this.findQuestionEffectById = '/help/helpQuestion/findQuestionEffectById'

        /************************** 优惠券 *******************************/

        // 未使用优惠劵列表 status 优惠券状态 0-未使用 1-已使用 2-已失效 3-未激活

        this.couponList = '/user/coupon/list';

        // 优惠劵详情

        this.getDiscountCouponById = '/user/discountCouponDealer/getDiscountCouponById';

        // 产品可用优惠劵列表

        this.availableDiscountCouponForProduct = '/user/coupon/listAvailable';


        /************************** 我的消息 *******************************/

        // 未查看消息数量

        this.queryTotalPushNum = '/user/push/queryTotalPushNum';

        // 消息未读详情

        this.queryPushNum = '/notice/newNoticeMessageCount';

        // 消息

        this.queryMessage = '/message/queryMessagePage';

        // 通知详情

        this.queryNoticeMessage = '/notice/queryNoticePage';

        // 拼店消息

        this.queryStoreMessageList = '/user/storeMessage/queryStoreMessageList';

        // 查看消息详情

        this.findMessageDetail = '/message/queryById';

      /************************** 降价秒杀 *******************************/
      
        // 订阅提醒
        
        this.addActivitySubscribe = '/activity/activitySubscribe/addActivitySubscribe';

        // 获取专题信息

        this.getTopicById = '/topic/findByCode';

        // 获取收藏列表

        this.queryCollect = '/discover/queryCollect';

        // 获取发现列表 type { 1：精选 2：热门 3：推荐 4：最新 全部则不传}, page, size

        this.queryDiscoverListByType = '/discover/query';

        // 获取发现详情

        this.getDiscoverById = '/discover/getById';

        // 取消 点赞/收藏

        this.discoverCountCancel = '/discover/count/cancel';

        // 点赞/收藏

        this.discoveerCountSave = '/discover/count/save';

        // 根据openid判断用户是否存在

        this.userExistByOpenid = '/user/userLogin/existedUserByOpenId'

        // 获取刮刮卡

        this.getScratchCard = '/scratch/scratchCard/findByCode'

        // 获取我的任务列表

        this.queryJobsByUserId = '/user/userJobs/queryJobsByUserId'

        // 查询是否有任务

        this.findUserJobsByUserId = '/user/userJobs/findUserJobsByUserId'

        // 领取任务

        this.addJobs = '/user/userJobs/add'

        // 获取任务详情

        this.findByJobId = '/user/userJobs/findByJobId'


      /************************** 优惠券 *******************************/

        // 推广红包列表

        this.queryPromotionPackagePageList = '/user/promotionPackage/queryPromotionPackagePageList';

        // 分页查询用户购买信息列表

        this.queryUserBuyPromotionPromoter = '/promotion/promotionPromoter/queryUserBuyPromotionPromoter';

        // 用户领取红包

        this.userReceivePackage = '/promotion/promotionPromoter/userReceivePackage';

        // 详情页用户领取红包

        this.givingPackageToUser = '/promotion/promotionPromoter/givingPackageToUser'

        // 支付红包费用

        this.promotionPromoterPay='/promotion/promotionPromoter/pay'

        // 分页查询用户领取红包记录列表

        this.queryPromotionReceiveRecordPageList = '/promotion/promotionReceiveRecord/queryPromotionReceiveRecordPageList'


        /************************** 任务 *******************************/

        // 获取分享详情

        this.jobIncrHits = '/user/userJobs/incrHits'

        // 验证刮刮卡使用状态

        this.checkScratchCodeStatus = '/scratch/scratchCardInformation/findByCode'

        // 领取刮刮卡奖励

        this.getScratchAward = '/scratch/scratchCardInformation/findById'

        // 领取任务奖励

        this.receiveJobMoney = '/user/userJobs/receiveMoney'

        // 用户校验

        this.userExtVerify = '/user/userLogin/scratchUserVerify'

        // 根据用户openid检验是否注册

        this.existedUserByOpenId = '/user/userLogin/existedUserByOpenId'

        __instance(this);

    }

    static sharedInstance() {
        return new Operation();
    }
}