export type TEventName = string | number;

export interface IEventListener {
    (data: any, listenOption: {
        firstEmit: boolean;
        remove: () => boolean;
        clear: () => boolean;
    }): void;
}

export interface IEventRegistOption {
    listener: IEventListener;
    immediate?: boolean;
    once?: boolean;
    order?: number;
    orderBefore?: boolean;
    index?: number;
    single?: boolean;
}

export interface IJson<T> {
    [prop: string]: T;
}

export interface IRegistObject {
    [key: string]: IEventRegistOption;
}

export interface IEventItem {
    name: TEventName;
    listener: IEventListener;
    immediate: boolean;
    once: boolean;
    order: number;
    hasTrigger: boolean;
    id: number;
    single: boolean;
}

export interface ILockerFn {index: number, func:()=>any}

export interface IOnInterceptorRegist {
    (data: {
        name: TEventName,
        item: IEventItem
    }): void
}

export interface IOnInterceptorEmit {
    (data: {
        name: TEventName;
        item: IEventItem;
        data: any;
        firstEmit: boolean;
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
    listen: (listener?: IEventListener) => IEventItem;
}