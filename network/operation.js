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
        this.verifyWechat = '/user/memberLogin/verifyWechat'



        __instance(this);

    }

    static sharedInstance() {
        return new Operation();
    }
}