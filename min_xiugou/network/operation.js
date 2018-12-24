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

    /********************** 分类 *********************/

        // 热门分类列表

        this.findHotList = '/product/productCategory/findHotList'

        // 一级分类列表

        this.findNameList = '/product/productCategory/findNameList'

        // 二、三级列表

        this.findProductCategoryList = '/product/productCategory/findProductCategoryList'

        /******************我的---通讯录*********************** */

        //通讯录列表
        this.queryDealerAddressBook ='/user/dealer/queryDealerAddressBook';

        //通讯录详情

        this.findDealerAddressBookDetails ='/user/dealer/findDealerAddressBookDetails';

        // 修改用户信息 type:1:修改头像 2:修改名字 3:修改省市区
        
        this.updateUserById = '/user/updateUserById';

        //  修改密码

        this.updateDealerPassword = '/user/updateLoginPassword';

        // 微信账号解绑 

        this.updateDealerOpenid ='/user/untiedWechat'

        //  修改手机号

        this.updateDealerNewPhone = '/user/updatePhone'

        // 验证旧手机短信是否正确

        this.updateDealerPhoneById = '/user/judgePhoneCode'


        // 获取专题详情页

        this.getTopicDetail = '/user/topic/get'

        // 获取推荐产品

        this.queryFeaturedList = '/config/advertisement/queryRecommendedPageList'

        // 秀场头条

        this.discoverNotice = '/discover/query'

        // 四个分类

        this.indexQueryCategoryList ='/config/advertisement/queryCategoryList'


        /************************** 我的消息 *******************************/

        // 未查看消息数量

        this.queryTotalPushNum = '/user/push/queryTotalPushNum';

        // 消息未读详情

        this.queryPushNum = '/notice/newNoticeMessageCount';

        // 通知详情

        this.queryNoticeMessage = '/notice/queryNoticePage';

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