/**
 * Created by weiwei on 11/6/18.
 */

import RequestStatus from './request-status';

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

export default class RequestQueue {

    constructor() {
        if (__instance()) return __instance();

        //init
        this.maxRequestCount = 5;//最大并发数
        this.waitingQueue = [];//待start的请求队列
        this.startedQueue = [];//已start的请求队列

        __instance(this);
    }

    static sharedInstance() {
        return new RequestQueue();
    }

    //添加请求到请求队列中
    static addRequest(request){
        let q = RequestQueue.sharedInstance();

        //未超过最大并发数
        if (q.startedQueue.length < q.maxRequestCount) {
            q.startedQueue.push(request);
            request.start();
        }

        //已超，加入等待队列
        else{
            q.waitingQueue.push(request);
        }
    }

    //从已start队列中移除一个请求
    static removeRequest(request){
        let q = RequestQueue.sharedInstance();
        global.Tool.removeObjectFromArray(request,q.startedQueue);

        //补充startedQueue
        if (global.Tool.isValidArr(q.waitingQueue)) {
            let count = q.maxRequestCount - q.startedQueue.length;//待补充的数量
            count = Math.min(count, q.waitingQueue.length);
            let supplyArray = q.waitingQueue.splice(0,count);

            q.startedQueue = q.startedQueue.concat(supplyArray);

            //start requests
            supplyArray.forEach((request,index) => {
                request.start();
            });
        }
    }
}