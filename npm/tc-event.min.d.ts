import {
    IJson, TEventName, IRegistObject,
    IEventListener, IEventRegistOption,
    IEventItem,
    IOnInterceptorRegist,
    IOnInterceptorEmit,
    ILink
} from './type';

interface IEventStatic {
    version: string;
    EVENT: IJson<string>; // 事件枚举
    emit(name: TEventName, data?: any): boolean; // 触发事件
    onEmit(fn: IOnInterceptorEmit): void;
    regist(name: TEventName, listener: IEventListener | IEventRegistOption): IEventItem;
    regist(name: TEventName): ILink;
    regist(name: IJson<IEventRegistOption>): IJson<IEventItem>;
    regist(name: IRegistObject): IEventItem;
    onRegist(fn: IOnInterceptorRegist): void;
    checkEvent(name: TEventName): boolean; // 检查是否存在事件
    remove(name: TEventName, cond: number | IEventListener, imme?: boolean): boolean;
    remove(eventItem: IEventItem, imme?: boolean): boolean;
    clear(name?: TEventName | TEventName[]): void;
    order(name: TEventName): number;
    registNotImmediate(name: TEventName, listener: IEventListener): IEventItem;
    registNotImmediateOnce(name: TEventName, listener: IEventListener): IEventItem;
    registOnce(name: TEventName, listener: IEventListener): IEventItem;
    registSingle(name: TEventName, listener: IEventListener): IEventItem;
}

export {
    IRegistObject, IEventListener,
    IEventRegistOption, IEventItem
};

declare const event: IEventStatic;

export default event;
