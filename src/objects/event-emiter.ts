
import {isObject, isUndf} from '../util';
import {
    TEventName, IEventListener, IEventRegistOption,
    IListenerItem, IRegistObject, IEventJson,
    IEventLink, IEventEmitter, IOnInterceptorEmit, IOnInterceptorRegist, TModuleName,
} from '../type';
import {EventStore} from './event-pool';
import {createEventLink} from './link-use';
import {EventInterceptor} from './interceptor';
import {EventItem} from './event';

export class EventEmitter implements IEventEmitter {
    removed: boolean;
    name: string;

    private eventStore: EventStore;
    interceptor: EventInterceptor;

    constructor (name?: TModuleName) {
        this.name = typeof name === 'undefined' ? '__default__' : `${name}`;
        this.eventStore = new EventStore(this);
        this.interceptor = new EventInterceptor();
    }

    getEvent(): IEventJson<EventItem>;
    getEvent(name: TEventName): EventItem;
    getEvent (name?: TEventName) {
        if (typeof name === 'undefined') return this.eventStore.events;
        return this.eventStore.getEvent(name);
    }

    getEventNames () {
        return this.eventStore.EVENTS;
    }

    onEmit (fn: IOnInterceptorEmit): void {
        this.interceptor.onEmit(fn);
    }
    onRegist (fn: IOnInterceptorRegist): void {
        this.interceptor.onRegist(fn);
    }

    // 注册某个事件的一个或多个回调
    regist(eventName: TEventName, listener: IEventListener | IEventRegistOption): IListenerItem;
    regist(eventName: IRegistObject): IEventJson<IListenerItem>;
    // 链式调用
    regist(eventName: TEventName): IEventLink;
    regist (
        eventName: TEventName | IRegistObject,
        listener?: IEventListener | IEventRegistOption,
    ): IListenerItem | null | IEventJson<IListenerItem> | IEventLink {
        // json 格式传入可以注册个事件
        if (this.removed) return null;
        if (isObject(eventName)) {
            const result: IEventJson<IListenerItem> = {};
            for (const key in eventName as IRegistObject) {
                result[key] = this.regist(key, (eventName as IEventJson<IEventRegistOption>)[key]) as IListenerItem;
            }
            return result;
        }
        if (typeof listener === 'function') {
            return this.registObject({eventName: eventName as TEventName, listener});
        } else if (typeof listener === 'object') {
            return this.registObject({eventName: eventName as TEventName, ...listener});
        } else if (typeof listener === 'undefined') {
            if (typeof eventName === 'string' || typeof eventName === 'number') {
                return createEventLink(eventName, this);
            }
        }
        console.warn('错误的listener', eventName, listener);
        return null;
    }

    checkEvent (eventName: TEventName) {
        return !!(this.eventStore.getEvent(eventName));
    }

    registNotImmediate (eventName: TEventName, listener: IEventListener) {
        return this.regist(eventName, {
            immediate: false,
            listener
        });
    }

    registOnce (eventName: TEventName, listener: IEventListener) {
        return this.regist(eventName, {
            once: true,
            listener
        });
    }
    registNotImmediateOnce (eventName: TEventName, listener: IEventListener) {
        return this.regist(eventName, {
            immediate: false,
            once: true,
            listener
        });
    }
    registSingle (eventName: TEventName, listener: IEventListener) {
        return this.regist(eventName, {
            single: true,
            listener,
        });
    }

    private _init (eventName: TEventName) {
        this.eventStore.setEvent(eventName);
    }

    registObject ({
        once = false, // 只触发一次
        immediate = true, // 始终起作用
        eventName,
        listener,
        order,
        orderBefore,
        index,
        single,
        name,
        head,
        tail,
        times,
    }: IEventRegistOption & {eventName: TEventName}) {
        if (!this.checkEvent(eventName)) {
            this._init(eventName);
        }
        return this.eventStore.getEvent(eventName).regist({
            listener, once, immediate, order, orderBefore, index, single, name, head, tail, times
        });
    }
    remove (eventName: TEventName, cond: number | IEventListener, immediate?: boolean): boolean;
    remove (eventItem: IListenerItem, immediate?: boolean): boolean;
    
    // 移除事件回调
    remove (
        eventName: TEventName | IListenerItem,
        cond?: number | IEventListener | boolean,
        immediate?: boolean
    ): boolean {
        if (typeof eventName === 'object') {
            immediate = cond as boolean;
            if (eventName === null) {
                console.error('参数错误', eventName);
                return false;
            }
            return this.remove(eventName.eventName, eventName.id, immediate);
        }
        if (typeof eventName === 'object') {
            const item = eventName as IListenerItem;
            return this.remove(item.eventName, item.id);
        }
    
        if (!this.checkEvent(eventName)) {
            console.warn('removeEvent:未找到事件 ' + eventName);
            return false;
        }
        if (isUndf(cond)) {
            console.error('请传入要移除的listener 或 id');
            return false;
        } else {// 移除单个监听
            return this.eventStore.getEvent(eventName).remove(cond as number | IEventListener, immediate);
        }
    }


    // 移除单个事件或是所有
    clear (eventName?: TEventName | TEventName[]) {
        if (typeof eventName === 'string' || typeof eventName === 'number') {
            if (this.checkEvent(eventName)) {
                this.eventStore.getEvent(eventName).clear();
                this.eventStore.delEvent(eventName);
            }
        } else if (eventName instanceof Array) {
            eventName.forEach(n => {
                this.clear(n);
            });
        } else {
            this.eventStore.clearEvent();
        }
    }
    // 触发事件
    emit (eventName: TEventName, data?: any) {
        if (this.removed) return false;
        // 此处是为了 all 参数，当没有regist之前emit了，all的listener也能被触发
        if (!this.checkEvent(eventName)) {
            this._init(eventName);
        }
        return this.eventStore.getEvent(eventName).emit(data);
    }
    order (eventName: TEventName) {
        if (this.checkEvent(eventName)) {
            return this.eventStore.getEvent(eventName).order;
        } else {
            // console.warn('错误的事件：' + name);
            return -1;
        }
    }
}
