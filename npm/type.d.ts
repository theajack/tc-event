export type TEventName = string | number;

export interface IEventListener {
    (data: any, firstEmit: boolean): void;
}

export interface IEventRegistOption {
    listener: IEventListener;
    all?: boolean;
    once?: boolean;
    index?: number;
    indexBefore?: boolean;
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
    all: boolean;
    once: boolean;
    index: number;
    hasTrigger: boolean;
    id: number;
}

export interface IToDo {index: number, func:()=>any}

export interface IOnInterceptor {
    (name?: TEventName, item?: IEventItem): void
}