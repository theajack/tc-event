import {
    IJson, TEventName, IRegistObject,
    IEventListener, IEventRegistOption,
    IEventItem,
    IOnInterceptor,
} from './type';

interface IEventStatic {
    version: string;
    EVENT: IJson<string>; // 事件枚举
    emit(name: TEventName, data: any): boolean; // 触发事件
    onEmit(fn: IOnInterceptor): void;
    regist(name: TEventName, listener: IEventListener | IEventRegistOption): IEventItem;
    regist(name: IRegistObject, listener: IEventListener | IEventRegistOption): IEventItem;
    regist(name: IJson<IEventRegistOption>): IJson<IEventItem>;
    onRegist(fn: IOnInterceptor): void;
    checkEvent(name: TEventName): boolean; // 检查是否存在事件
    remove(name: TEventName, cond: number | IEventListener, imme?: boolean): boolean;
    remove(eventItem: IEventItem, imme?: boolean): boolean;

    clear(name: TEventName | TEventName[]): void;
    index(name: TEventName): number;
    
}

export {
    IRegistObject, IEventListener,
    IEventRegistOption, IEventItem
};

declare const event: IEventStatic;

export default event;
