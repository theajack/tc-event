export type TEventName = string | number;

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

export interface IJson<T> {
    [prop: string]: T;
}

export interface IRegistObject {
    [key: string]: IEventRegistOption;
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

export interface ILink {
    single: (single?: boolean) => ILink;
    notImmediate: (immediate?: boolean) => ILink;
    once: (once?: boolean) => ILink;
    index: (index: number) => ILink;
    order: (order: number) => ILink;
    orderBefore: (orderBefore?: boolean) => ILink;
    listener: (listener: IEventListener) => ILink;
    name: (name: string) => ILink;
    head: () => ILink;
    tail: ()=> ILink;
    listen: (listener?: IEventListener) => IEventItem;
}