/**
 * Created by wiewei on 1/6/18.
 */

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
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
        this.signMember = '/user/memberSign/signMember'

        // 获取推荐人列表
        this.queryInviterList = '/user/memberSign/queryInviterList'


    /**********  获取省市区 *******************/

        // 获取省
        this.getProvinceList = '/user/area/getProvinceList'

        // 获取市
        this.getCityList = '/user/area/getCityList'

        // 获取区
        this.getAreaList = '/user/area/getAreaList'
    
    /**********  获取数据字典 *******************/

        // dType 1 取消订单 2 退款理由 3 换货理由 4 退货退款 5 问题类型 

        this.queryDictionaryDetailsType = '/user/dictionary/queryDictionaryDetailsType'

    /********************** 搜索 *********************/  
    
        this.getHotWordsListActive = '/user/hotWord/getHotWordListActive'
          
    /********************** 产品 *********************/

        // 产品列表
        this.queryProductListAPP = '/user/product/queryProductList'

        // 产品详情

        this.findProductByIdApp = '/user/product/findProductById'

        // 搜索产品

        this.searchProduct ='/user/search/searchProduct'
        
        // 根据code获取产品详情

        this.findProductByProdCodeString = '/user/product/findProductByProdCodeString'

        // 获取产品规格有误

        this.findProductStockBySpec = '/user/product/findProductStockBySpec'

        // 礼包规格

        this.getGiftBagSpec = '/order/giftBag/getGiftBagSpec'

        // 礼包详情

        this.getGiftBagDetail = '/order/giftBag/getGiftBagDetail'

        // 是否能购买礼包

        this.checkGiftBagOrder = '/order/order/checkGiftBagOrder'

    /********************** 购物车 *********************/
        // 新增
        
        this.addToShoppingCart  = '/user/shoppingCart/addToShoppingCart'

        // 修改

        this.updateShoppingCart = '/user/shoppingCart/updateShoppingCartItemsByProductId'

        // 同步

        this.shoppingCartFormCookieToSession ='/user/shoppingCart/shoppingCartFormCookieToSession'

        // 查询

        this.getShoppingCartList  ='/user/shoppingCart/getShoppingCartList'

        // 删除

        this.deleteFromShoppingCart = '/user/shoppingCart/deleteFromShoppingCartByProductId'

        // 购物车超过上限

        this.shoppingCartLimit = '/user/shoppingCart/shoppingCartFormCookieToSessionProductNumberIsAble'


    /********************** 地址管理 *********************/
        // 新增地址

        this.addUserAddress  ='/user/userAddress/addUserAddress';

        // 获取列表
        
        this.queryUserAddressList  ='/user/userAddress/queryUserAddressList'
        
        // 更新地址

        this.updateUserAddress = '/user/userAddress/updateUserAddress'

        // 设置默认地址

        this.setDefaultAddress ='/user/userAddress/setDefaultAddress'

        // 删除地址 

        this.deleteUserAddress  ='/user/userAddress/deleteUserAddress'

        // 自提地址

        this.queryStoreHouseList = '/user/userAddress/queryStoreHouseList'

      /********************** 我的账户 *********************/
      
        // 分页查询现金账户收支明细

        this.queryDetailBalanceListAPP  ='/user/detailBalance/queryDetailBalanceListAPP';

        // 分页查询代币账户收支明细

        this.queryDetailTokenCoinListAPP  ='/user/detailTokenCoin/queryDetailTokenCoinListAPP';

        // 分页查询积分账户收支明细

        this.queryDetailUserScorePageListAPP  ='/user/detailUserScore/queryDetailUserScorePageListAPP';

        // 查询经销商账户信息

        this.findDealerAccountByIdAPP  ='/user/dealer/findDealerAccountByIdAPP';

        // 分页查询待提现账户

        this.settlementTotalByDealerId = '/user/settlementTotal/querySettlementTotalByDealerId';
        // 查询待提现账户

        this.findSettlementTotalByBalance = '/user/settlementTotal/findSettlementTotalByBalance';

        /********************** 我的订单 *********************/

        // 全部订单

        this.queryAllOrderPageList  ='/order/order/queryAllOrderPageList';

        // 已完成订单

        this.queryCompletedOrderPageList  ='/order/order/queryCompletedOrderPageList';

        // 待支付订单

        this.queryUnPaidOrderPageList  ='/order/order/queryUnPaidOrderPageList';

        // 待发货订单

        this.queryUnSendOutOrderPageList  ='/order/order/queryUnSendOutOrderPageList';

        // 待收货订单

        this.queryWaitReceivingOrderPageList  ='/order/order/queryWaitReceivingOrderPageList';

        // 已完成订单详情

        this.getOrderDetail  ='/order/order/getOrderDetail';

        // 确认收货

        this.confirmReceipt  ='/order/order/confirmReceipt';

        // 删除已完成订单

        this.deleteOrder  ='/order/order/deleteOrder';

        // 删除已关闭(取消) 订单

        this.deleteClosedOrder  ='/order/order/deleteClosedOrder';

        // 取消订单

        this.cancelOrder  ='/order/order/cancelOrder';


        /******************提交订单 订单结算*********************** */

        // 购物车结算
        
        this.makeSureOrder = '/order/order/makeSureOrder'

        // 提交订单

        this.submitOrder ='/order/order/submitOrder'

        // 订单修改地址 邮费计算

        this.calcFreight  = '/order/order/calcFreight'

        // 预支付

        this.repay = '/order/order/prePay'

        // 第三方支付回调接口

        this.paySuccess = '/order/order/paySuccess'

        // 继续去支付

        this.continueToPay  = '/order/order/continueToPay'

        // 继续支付

        this.continuePay = '/order/order/continuePay'
        
        // 继续去预支付

        this.againToPrePay  ='/order/order/againToPrePay'

        // 主动查询订单状态

        this.orderQuery = '/user/weChatPay/orderQuery'

        // 发起支付
        
        this.wxPay = '/user/weChatPay/wxPay'

        // 申请退款
   
        this.wxRefund = '/user/weChatPay/wxRefund'

        // 使用优惠券查询

        this.orderCalcDiscountCouponAndUseScore = '/order/order/orderCalcDiscountCouponAndUseScore'

        /**********************订单售后**************************/ 

        // 我的售后

        this.queryAftermarketOrderPageList  ='/order/order/queryAftermarketOrderPageList'

        // 申请退款
        
        this.orderRefund = '/order/order/orderRefund'

        // 申请换货

        this.applyExchangeProduct = '/order/order/applyExchangeProduct'

        // 申请退货

        this.applyReturnGoods  = '/order/order/applyReturnGoods'

        // 查看申请退款子订单详情

        this.findOrderProductInfo = '/order/orderProduct/findOrderProductInfo'

        // 查看退款退货换货情况

        this.findReturnProductById = '/order/order/findReturnProductById'

        // 退货换货填写物流信息

        this.fillInExpressInfoById ='/order/order/fillInExpressInfoById'

        // 退换货物流查看

        this.findReturnProduct = '/user/delivery/findReturnProduct'

        // 物流公司选择

        this.findAllExpress = '/user/express/findAllExpress'

        // 根据订单id查询快递信息

        this.findDelivery ='/user/delivery/find'

        // 再次购买

        this.orderOneMore  ='/order/order/orderOneMore'

        
        /******************我的---设置*********************** */

        //退出登录

        this.exitLogin ='/user/memberLogin/exitLogin';

        // 实时更新用户等级

        this.getLevel = '/user/userInfo/getLevel'

        /******************我的---通讯录*********************** */

        //通讯录列表

        this.queryDealerAddressBook ='/user/dealer/queryDealerAddressBook';

        //通讯录详情

        this.findDealerAddressBookDetails ='/user/dealer/findDealerAddressBookDetails';

        // 修改用户头像
        
        this.updateDealerHeadImg = '/user/dealer/updateDealerHeadImgById';

        // 上传图片的地址 commonAPI

        this.aliyunOSSUploadImage ='/user/ossClient/aliyunOSSUploadImage'

        // 修改用户昵称

        this.updateDealerNickname = '/user/dealer/updateDealerNicknameById';

        // 修改所在区域

        this.updateDealerRegion = '/user/dealer/updateDealerRegionById';

        //  修改密码

        this.updateDealerPassword = '/user/dealer/updateDealerPassword';

        // 微信账号解绑 

        this.updateDealerOpenid ='/user/dealer/updateDealerOpenidById'

        //  修改手机号

        this.updateDealerNewPhone = '/user/dealer/updateDealerNewPhoneById'

        // 验证旧手机短信是否正确

        this.updateDealerPhoneById = '/user/dealer/updateDealerPhoneById'


        // 邀请码

        this.createWxQrcode = '/user/dealer/createWxQrcode'

        // 邀请码是否过期

        this.sweepCode ='/user/invite/sweepCode'

        /*************** 短信 ******************************/

        /* 统一的短信接口
          1. code对应传递值-------> 用户注册：MOBILE_REGISTRATION_CODE 
          手机验证码登录：MOBILE_CODELOGIN_CODE 
          设置交易密码：MOBILE_SETDEALPASSWORD_CODE 
          忘记交易密码：MOBILE_FORGETDEALPASSWORD_CODE 
          手机号修改验证旧手机：MOBILE_VERIFYAULDPHONE_CODE 
          手机号修改绑定新手机：MOBILE_VERIFYNEWPHONE_CODE
          登录时忘记密码：MOBILE_FORGETPASSWORD_CODE
          2. phone:string
        */

        this.sendMessage = '/user/phoneCode/sendMessage'

        /*************** 收藏 ******************************/ 

        // 收藏列表

        this.queryProductFaviconList = '/user/productFavicon/queryProductFaviconList'

        //删除

        this.deleteProductFavicon = '/user/productFavicon/deleteProductFavicon'

        // 新增

        this.addProductFavicon = '/user/productFavicon/addProductFavicon'

        /************************** 首页 *******************************/ 

        //轮播图

        this.queryAdList = '/user/ad/queryAdList'

        // 获取专题详情页

        this.getTopicDetail = '/user/topic/get'

        // 获取推荐产品

        this.queryFeaturedList = '/user/featured/queryFeaturedList'


        /************************** 帮助中心 *******************************/

        // 解决问题是否有用

        this.updateHelpQuestion = '/user/helpQuestion/updateHelpQuestion'

        // 根据ID查询问题详情

        this.findHelpQuestionById  = '/user/helpQuestion/findHelpQuestionById'

        // 问题列表 可传参 也可以不传

        this.queryHelpQuestionList = '/user/helpQuestion/queryHelpQuestionList'

        // 添加反馈

        this.addFeedback = '/user/feedback/addFeedback'

        /************************** 优惠券 *******************************/

        // 未使用优惠劵列表

        this.getDiscountCouponNoUse = '/user/discountCouponDealer/getDiscountCouponNoUse';

        // 已经优惠劵列表

        this.getDiscountCouponUserd  = '/user/discountCouponDealer/getDiscountCouponUserd';

        // 失效优惠劵列表

        this.getDiscountCouponLosed = '/user/discountCouponDealer/getDiscountCouponLosed';

        // 优惠劵详情

        this.getDiscountCouponById = '/user/discountCouponDealer/getDiscountCouponById';

        // 产品可用优惠劵列表

        this.availableDiscountCouponForProduct = '/order/order/availableDiscountCouponForProduct';


        /************************** 我的消息 *******************************/

        // 未查看消息数量

        this.queryTotalPushNum = '/user/push/queryTotalPushNum';

        // 消息未读详情

        this.queryPushNum = '/user/push/queryPushNum';

        // 消息

        this.queryMessage = '/user/message/queryMessage';

        // 通知详情

        this.queryNoticeMessage = '/user/notice/queryNoticeMessage';

        // 拼店消息

        this.queryStoreMessageList = '/user/storeMessage/queryStoreMessageList';

        // 查看消息详情

        this.findMessageDetail = '/user/message/findMessageDetail';


        __instance(this);

    }

    static sharedInstance() {
        return new Operation();
    }
}