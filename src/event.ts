
// 事件类

import {findPos} from './util';
import {createLocker} from './locker';
import {TEventName, IEventListener, IEventItem, ILockerFn} from './type';
import {triggerOnRegist, triggerOnEmit} from './interceptor';


export class Event {
    name: TEventName;
    id: number;
    hasTrigger: boolean;
    private listeners: Array<IEventItem | undefined>;
    order: number;
    private _triggerData: any;
    private _locker: {add ({index, func}: ILockerFn): void; lock (fn: () => any): any;};
    constructor (name: TEventName) {
        // 对于ready之类的事件 增加一个如果已经触发了就马上执行的逻辑
        this.name = name;
        this._init();
    }
    _init () {
        this._locker = createLocker();
        this._triggerData = undefined;
        this.order = 0;
        this.hasTrigger = false;
        this.id = 0;
        this.listeners = [];
    }
    _getListenerNumber () {
        return this.listeners.length;
    }
    reset () {
        this.listeners = [];
    }
    regist ({listener, once = false, immediate = true, order, orderBefore = false, index}: {
        listener: IEventListener;
        once?: boolean;
        immediate?: boolean;
        order?: number;
        orderBefore?: boolean;
        index?: number;
    }) {
        let insertIndex: number;
        const n = this.listeners.length;
        if (typeof index === 'number') {
            if (index > n) {index = n;}
            else if (index < 0) {index = 0;}
            const item = this.listeners[index];
            order = item ? item.order : ++ this.order;
            insertIndex = index;
        } else {
            if (typeof order !== 'number') {
                order = ++ this.order;
            }
            insertIndex = (n === 0 || order > this._findLastOrder()) ? n : findPos(this.listeners, order, orderBefore);
        }
        const item: IEventItem = {
            name: this.name,
            listener,
            once,
            immediate,
            hasTrigger: false,
            order,
            id: ++this.id
        };
        
        triggerOnRegist({name: this.name, item});
        this._locker.add({
            index: insertIndex,
            func: () => {this.listeners.splice(insertIndex, 0, item);}
        });
        if (immediate && this.hasTrigger) {
            if (once) {item.hasTrigger = true;}
            listener(this._triggerData, false);
        }
        return item;
    }
    _findLastOrder () {
        for (let i = this.listeners.length - 1; i >= 0; i--) {
            if (this.listeners[i]) {
                return (this.listeners[i] as IEventItem).order;
            }
        }
        return 0;
    }
    emit (data?: any) {
        return this._locker.lock(() => {
            const firstEmit = this.hasTrigger === false;
            if (!this.hasTrigger) {this.hasTrigger = true;}
            this._triggerData = data;
            for (let i = 0; i < this.listeners.length; i++) {
                const item = this.listeners[i];
                if (item && (!item.once || !item.hasTrigger)) {
                    item.hasTrigger = true;
                    item.listener(data, firstEmit);
                    triggerOnEmit({name: this.name, item, data, firstEmit});
                }
            }
            return firstEmit;
        });
    }
    remove (cond: number | IEventListener, immediate: boolean = false) {
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
        const index = this.listeners.indexOf(result);
        if (immediate) {this.listeners[index] = undefined;}
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