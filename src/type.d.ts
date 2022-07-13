export type TEventName = string | number;
export type TModuleName = string | number;

export interface IEventListener {
    (data: any, listenOption: {
        firstEmit: boolean;
        item: IListenerItem;
        remove: () => boolean;
        clear: () => boolean;
    }): void;
}

export interface IEventRegistOption {
    listener: IEventListener;
    immediate?: boolean;
    once?: boolean;
    times?: number;
    order?: number;
    orderBefore?: boolean;
    index?: number;
    single?: boolean;
    head?: boolean;
    tail?: boolean;
    name?: string;
}

export interface IEventJson<T> {
    [prop: string]: T;
}

export interface IRegistObject {
    [key: string]: IEventListener | IEventRegistOption;
}

export interface IListenerItem {
    eventName: TEventName;
    listener: IEventListener;
    immediate: boolean;
    once: boolean;
    order: number;
    orderBefore: boolean;
    hasTrigger: boolean;
    id: number;
    single: boolean;
    name: string;
    head: boolean;
    tail: boolean;
    times: number;
    timesLeft: number;
}

export interface ILockerFn {index: number, func:()=>any}

export interface IOnInterceptorRegist {
    (data: {
        eventName: TEventName,
        item: IListenerItem
    }): void
}

export interface IOnInterceptorEmit {
    (data: {
        eventName: TEventName;
        data: any;
        firstEmit: boolean;
        item: IListenerItem;
        remove: () => boolean;
        clear: () => boolean;
    }): void
}

export interface IEventLink {
    single: (single?: boolean) => IEventLink;
    notImmediate: (immediate?: boolean) => IEventLink;
    once: (once?: boolean) => IEventLink;
    index: (index: number) => IEventLink;
    order: (order: number) => IEventLink;
    orderBefore: (orderBefore?: boolean) => IEventLink;
    listener: (listener: IEventListener) => IEventLink;
    name: (name: string) => IEventLink;
    head: () => IEventLink;
    tail: ()=> IEventLink;
    times: (times: number)=> IEventLink;
    listen: (listener?: IEventListener) => IListenerItem;
}

export interface CEvent {
    eventName: TEventName;
    id: number;
    hasTrigger: boolean;
    order: number;
    singleMode: boolean;
    regist(options: IEventRegistOption): IListenerItem;
    emit(data?: any): boolean;
    remove(cond: number | IEventListener, immediate?: boolean): boolean;
    clear(): boolean;
}

export interface IRegistMethod {
    (eventName: TEventName, listener: IEventListener | IEventRegistOption): IListenerItem;
    (eventName: IRegistObject): IEventJson<IListenerItem>;
    // 链式调用
    (eventName: TEventName): IEventLink;
}

export interface IRemoveMethod {
    (name: TEventName, cond: number | IEventListener, imme?: boolean): boolean;
    (eventItem: IListenerItem, imme?: boolean): boolean;
}

export interface IEventInterceptor {
    onRegist (fn: IOnInterceptorRegist): void;
    triggerOnRegist: IOnInterceptorRegist;
    onEmit (fn: IOnInterceptorEmit): void;
    triggerOnEmit: IOnInterceptorEmit;
    clearInterceptor (): void;
}

export interface IEventEmitter {
    removed: boolean;
    interceptor: IEventInterceptor;
    name: string;
    getEventNames(): string[]; // 事件枚举
    getEvent(): IEventJson<CEvent>;
    getEvent(name: TEventName): CEvent;
    emit(name: TEventName, data?: any): boolean; // 触发事件
    onEmit(fn: IOnInterceptorEmit): void;
    regist: IRegistMethod;
    registObject(options: IEventRegistOption & {eventName: TEventName}): IListenerItem;
    onRegist(fn: IOnInterceptorRegist): void;
    checkEvent(name: TEventName): boolean; // 检查是否存在事件
    remove: IRemoveMethod;
    clear(name?: TEventName | TEventName[]): void;
    order(name: TEventName): number;
    registNotImmediate(name: TEventName, listener: IEventListener): IListenerItem;
    registNotImmediateOnce(name: TEventName, listener: IEventListener): IListenerItem;
    registOnce(name: TEventName, listener: IEventListener): IListenerItem;
    registSingle(name: TEventName, listener: IEventListener): IListenerItem;
}

export interface IEventStatic extends IEventEmitter {
    version: string;
    createModule (name: TModuleName): IEventEmitter;
    getModule (): IEventJson<IEventEmitter>;
    getModule (name: TModuleName): IEventEmitter;
    removeModule(name: TModuleName): void;
    clearModule(): void;
}