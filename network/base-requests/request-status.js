/**
 * Created by weiwei on 11/6/18.
 */
export default class RequestStatus {}
RequestStatus.waiting = 'waiting';
RequestStatus.requesting = 'requesting';
RequestStatus.finish = 'finish';
Object.freeze(RequestStatus);// 冻结对象，防止修改