
// 事件类

import {createLocker} from '../locker';
import {TEventName, IEventListener, IListenerItem, ILockerFn, IEventRegistOption, CEvent} from '../type';
import {createListener, triggerListenerItem} from '../listener';
import {countInsertIndex} from '../listeners';
import {IEventEmitter} from 'src/type';

export class EventItem implements CEvent {
    parent: IEventEmitter;
    eventName: TEventName;
    id: number;
    hasTrigger: boolean;
    private listeners: Array<IListenerItem | undefined>;
    order: number;
    private _triggerData: any;
    private _locker: {
        add ({index, func}: ILockerFn): void;
        lock (fn: () => boolean): boolean;
    };
    singleMode: boolean;
    constructor (eventName: TEventName, parent: IEventEmitter) {
        // 对于ready之类的事件 增加一个如果已经触发了就马上执行的逻辑
        this.parent = parent;
        this.eventName = eventName;
        this._init();
    }
    private _init () {
        this._locker = createLocker();
        this._triggerData = undefined;
        this.order = 0;
        this.hasTrigger = false;
        this.id = 0;
        this.singleMode = false;
        this.listeners = [];
    }
    regist ({
        listener,
        immediate = true,
        once = false,
        order,
        orderBefore = false,
        index,
        single = false,
        name = '',
        head = false,
        tail = false,
        times = -1,
    }: IEventRegistOption) {
        this.singleMode = (this.singleMode || single);

        let insertIndex: number;

        if (this.singleMode) {
            this.listeners = [];
            insertIndex = 0;
            order = 0;
        } else {
            const result = countInsertIndex({
                listeners: this.listeners,
                eventOrder: this.order,
                index, order, orderBefore, head, tail
            });
            if (result.needAddOrder) {
                this.order ++;
            }
            insertIndex = result.insertIndex;
            order = result.order;
        }

        const item = createListener(this, {
            listener, immediate, once, order, orderBefore, name, head, tail, times,
        });

        this.parent.interceptor.triggerOnRegist({eventName: this.eventName, item});

        this._locker.add({
            index: insertIndex,
            func: () => {this.listeners.splice(insertIndex, 0, item);}
        });

        if (immediate && this.hasTrigger) {
            triggerListenerItem(this.parent, item, this._triggerData);
        }
        return item;
    }

    emit (data?: any) {
        return this._locker.lock(() => {
            this._triggerData = data;
            const firstEmit = this.hasTrigger === false;
            if (!this.hasTrigger) {this.hasTrigger = true;}
            for (let i = 0; i < this.listeners.length; i++) {
                triggerListenerItem(this.parent, this.listeners[i], data, firstEmit);
            }
            return firstEmit;
        });
    }

    remove (cond: number | IEventListener, immediate: boolean = false) {
        let index: number;
        if (this.singleMode) {
            index = 0;
        } else {
            let attr: 'id' | 'listener';
            const type = typeof cond;
            if (type === 'number') {
                attr = 'id';
            } else if (type === 'function') {
                attr = 'listener';
            } else {
                console.warn('removeEvent 传入的参数有误');
                return false;
            }
            const result = this.listeners.find(item => {
                return item && item[attr] === cond;
            });
            if (!result) {
                // console.warn('removeEvent:未找到监听函数 ' + this.name);
                return false;
            }
            index = this.listeners.indexOf(result);
            if (immediate) {this.listeners[index] = undefined;}
        }
        this._locker.add({
            index,
            func: () => {this.listeners.splice(index, 1);}
        });
        return true;
    }
    clear () {
        this._init();
        return true;
    }
}