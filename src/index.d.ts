/*
 * @Author: tackchen
 * @Date: 2022-07-19 11:11:31
 * @Description: Coding something
 */
import {
    CEvent,
    IEventEmitter, IEventInterceptor, IEventJson, IEventListener, IEventRegistOption, IEventStatic, IListenerItem, IOnInterceptorEmit, IOnInterceptorRegist, IRegistMethod, IRemoveMethod, TEventName, TModuleName
} from './type';

export * from './type';

export const version: string;

export function createModule(name: TModuleName): IEventEmitter;

export function getModule (): IEventJson<IEventEmitter>;
export function getModule (name: TModuleName): IEventEmitter;

export function clearModule(): void;

export function removeModule(name: TModuleName): void;

export const event: IEventStatic;

export const resgist: typeof event.regist;
export const emit: typeof event.emit;


export class EventEmitter implements IEventEmitter {
    removed: boolean;
    interceptor: IEventInterceptor;
    name: string;
    getEventNames (): string[];
    getEvent (): IEventJson<CEvent>;
    getEvent (name: TEventName): CEvent;
    emit (name: TEventName, data?: any): boolean;
    onEmit (fn: IOnInterceptorEmit): void;
    regist: IRegistMethod;
    registObject (options: IEventRegistOption & {eventName: TEventName;}): IListenerItem;
    onRegist (fn: IOnInterceptorRegist): void;
    checkEvent (name: TEventName): boolean;
    remove: IRemoveMethod;
    clear (name?: TEventName | TEventName[] | undefined): void;
    order (name: TEventName): number;
    registNotImmediate (name: TEventName, listener: IEventListener): IListenerItem;
    registNotImmediateOnce (name: TEventName, listener: IEventListener): IListenerItem;
    registOnce (name: TEventName, listener: IEventListener): IListenerItem;
    registSingle (name: TEventName, listener: IEventListener): IListenerItem;
}

export default event;
