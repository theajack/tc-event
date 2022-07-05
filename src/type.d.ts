export type TEventName = string | number;
export type TModuleName = string | number;

export interface IEventListener {
    (data: any, listenOption: {
        firstEmit: boolean;
        item: IEventItem;
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

export interface IEventItem {
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
        item: IEventItem
    }): void
}

export interface IOnInterceptorEmit {
    (data: {
        eventName: TEventName;
        data: any;
        firstEmit: boolean;
        item: IEventItem;
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
    listen: (listener?: IEventListener) => IEventItem;
}

export interface CEvent {
    eventName: TEventName;
    id: number;
    hasTrigger: boolean;
    order: number;
    singleMode: boolean;
    regist(options: IEventRegistOption): IEventItem;
    emit(data?: any): boolean;
    remove(cond: number | IEventListener, immediate?: boolean): boolean;
    clear(): boolean;
}

export interface IRegistMethod {
    (eventName: TEventName, listener: IEventListener | IEventRegistOption): IEventItem;
    (eventName: IRegistObject): IEventJson<IEventItem>;
    // 链式调用
    (eventName: TEventName): IEventLink;
}

export interface IRemoveMethod {
    (name: TEventName, cond: number | IEventListener, imme?: boolean): boolean;
    (eventItem: IEventItem, imme?: boolean): boolean;
}

export interface IEventStaticBase {
    version: string;
    EVENT: IEventJson<string>; // 事件枚举
    emit(name: TEventName, data?: any): boolean; // 触发事件
    onEmit(fn: IOnInterceptorEmit): void;
    // regist(
    //     eventName: TEventName | IRegistObject,
    //     listener?: IEventListener | IEventRegistOption
    // ): IEventItem  | IEventJson<IEventItem> | IEventLink | null;
    regist: IRegistMethod;
    onRegist(fn: IOnInterceptorRegist): void;
    checkEvent(name: TEventName): boolean; // 检查是否存在事件
    remove: IRemoveMethod;
    clear(name?: TEventName | TEventName[]): void;
    order(name: TEventName): number;
    registNotImmediate(name: TEventName, listener: IEventListener): IEventItem;
    registNotImmediateOnce(name: TEventName, listener: IEventListener): IEventItem;
    registOnce(name: TEventName, listener: IEventListener): IEventItem;
    registSingle(name: TEventName, listener: IEventListener): IEventItem;
}
export interface IEventStatic extends IEventStaticBase {
    createModule (name: TModuleName): IEventModuleStatic;
    getModule (): IEventJson<IEventModuleStatic>;
    getModule (name: TModuleName): IEventModuleStatic;
    removeModule(name: TModuleName): void;
    clearModule(): void;
}

export interface IEventModuleStatic extends IEventStaticBase {
    moduleName: string | number;
    buildEventName(eventName: TEventName): string;
}