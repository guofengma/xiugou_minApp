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


    /**********  获取省市区 *******************/

      // 获取省
      this.queryAreaList = '/config/sysArea/queryAreaList'
    
    /**********  获取数据字典 *******************/

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

      this.queryDictionaryDetailsType = '/config/sysDictionary/queryDictionaryTypeList'

    /********************** 搜索 *********************/  
    
        this.getHotWordsListActive = '/user/hotWord/getHotWordListActive'

        // 动态搜索框关键词匹配

        this.getKeywords = '/product/getKeywords'
          
    /********************** 产品 *********************/

        // 产品详情

        this.findProductByIdApp = '/product/getProductDetail'

        // 搜索产品

        this.searchProduct ='/product/productList'

        // 获取产品规格

        this.findProductStockBySpec = '/product/getProductSpec'


        // 礼包规格

        this.getGiftBagSpec = '/order/giftBag/getGiftBagSpec'

        // 礼包详情

        this.getGiftBagDetail = '/order/giftBag/getGiftBagDetail'

        // 是否能购买礼包

        this.checkGiftBagOrder = '/order/order/checkGiftBagOrder'

    /********************** 购物车 *********************/
        // 新增
        
      this.addToShoppingCart = '/user/shoppingcart/addItem'

        // 修改

      this.updateShoppingCart = '/user/shoppingcart/updateItem'

        // 同步

      this.shoppingCartFormCookieToSession ='/user/shoppingcart/loginArrange'

        // 查询

      this.getShoppingCartList ='/user/shoppingcart/list'

        // 删除

      this.deleteFromShoppingCart = '/user/shoppingcart/deleteItem'

        // 未登录时，获取购物车详细信息列表

      this.getRichItemList  ='/user/shoppingcart/getRichItemList'


    /********************** 地址管理 *********************/
        // 新增地址 或 修改地址(传id)

        this.addUserAddress ='/user/userAddress/save';

        // 获取列表
        
        this.queryUserAddressList ='/user/userAddress/query'

        // 设置默认地址

        this.setDefaultAddress ='/user/userAddress/setDefault'

        // 删除地址 

        this.deleteUserAddress ='/user/userAddress/delete'

        // 自提地址

        // this.queryStoreHouseList = '/user/userAddress/queryStoreHouseList'

      /********************** 我的账户 *********************/

        // 我的晋升

        this.getUserLevelInfo = '/user/getUserLevelInfo'

        // 我的秀豆明细

        this.getUserrScore = '/user/userScore/query'

        // 我的余额

        this.getuserBalance= '/user/userBalance/query'


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

        this.exitLogin ='/user/userLogin/signOut';

        // 获取用户信息

        this.getLevel = '/user/getUser'

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

        /************************** 首页 *******************************/ 

        //轮播图

        this.queryAdList = '/user/ad/queryAdList'

        // 获取专题详情页

        this.getTopicDetail = '/user/topic/get'

        // 获取推荐产品

        this.queryFeaturedList = '/user/featured/queryFeaturedList'


        /************************** 帮助中心 *******************************/

        // 解决问题是否有用

        this.updateHelpQuestion = '/help/helpQuestion/updateHelpQuestionToClick'

        // 根据ID查询问题详情

        this.findHelpQuestionById = '/help/helpQuestion/findHelpQuestionById'

        // 问题列表 可传参 也可以不传

        this.queryHelpQuestionList = '/help/helpQuestion/queryHelpQuestionList'

        // 添加反馈

        this.addFeedback = '/user/feedback/addFeedback'

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