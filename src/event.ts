
// 事件类

import {findPos} from './util';
import {createLocker} from './locker';
import {TEventName, IEventListener, IEventItem, IToDo} from './type';


export class TCEvent {
    name: TEventName;
    id: number;
    index: number;
    hasTrigger: boolean;
    private listeners: Array<IEventItem | undefined>;
    private _triggerData: any;
    private _locker: {add ({index, func}: IToDo): void; lock (fn: () => any): any;};
    constructor (name: TEventName) {
        // 对于ready之类的事件 增加一个如果已经触发了就马上执行的逻辑
        this.name = name;
        this._init();
    }
    _init () {
        this._locker = createLocker();
        this._triggerData = undefined;
        this.hasTrigger = false;
        this.id = 0;
        this.index = 0;
        this.listeners = [];
    }
    _getListenerNumber () {
        return this.listeners.length;
    }
    reset () {
        this.listeners = [];
    }
    regist ({listener, once = false, all = true, index, indexBefore = false}: {
        listener: IEventListener;
        once?: boolean;
        all?: boolean;
        index?: number;
        indexBefore?: boolean;
    }) {
        if (typeof index !== 'number') {
            index = ++ this.index;
        }
        const n = this.listeners.length;
        const item = {
            name: this.name,
            listener,
            once,
            all,
            hasTrigger: false,
            index,
            id: ++this.id
        };
        const insertIndex = (n === 0 || index > this._findLastIndex()) ? n : findPos(this.listeners, index, indexBefore);
        this._locker.add({
            index: insertIndex,
            func: () => {this.listeners.splice(insertIndex, 0, item);}
        });
        if (all && this.hasTrigger) {
            if (once) {item.hasTrigger = true;}
            listener(this._triggerData, false);
        }
        return item;
    }
    _findLastIndex () {
        for (let i = this.listeners.length - 1; i >= 0; i--) {
            if (this.listeners[i]) {
                return (this.listeners[i] as IEventItem).index;
            }
        }
        return 0;
    }
    emit (data: any) {
        return this._locker.lock(() => {
            const firstEmit = this.hasTrigger === false;
            if (!this.hasTrigger) {this.hasTrigger = true;}
            this._triggerData = data;
            for (let i = 0; i < this.listeners.length; i++) {
                const item = this.listeners[i];
                if (item && (!item.once || !item.hasTrigger)) {
                    item.hasTrigger = true;
                    item.listener(data, firstEmit);
                }
            }
            return firstEmit;
        });
    }
    remove (cond: number | IEventListener, imme: boolean = false) {
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
            console.warn('removeEvent:未找到监听函数 ' + this.name);
            return false;
        }
        const index = this.listeners.indexOf(result);
        if (imme) {this.listeners[index] = undefined;}
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