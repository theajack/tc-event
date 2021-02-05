export type TEventName = string | number;

export interface IEventListener {
    (data: any, firstEmit: boolean): void;
}

export interface IEventRegistOption {
    listener: IEventListener;
    immediate?: boolean;
    once?: boolean;
    order?: number;
    orderBefore?: boolean;
    index?: number;
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
}

export interface ILockerFn {index: number, func:()=>any}

export interface IOnInterceptorRegist {
    (data: {name?: TEventName, item?: IEventItem}): void
}

export interface IOnInterceptorEmit {
    (data: {name?: TEventName, item?: IEventItem, data?: any, firstEmit?: boolean}): void
}