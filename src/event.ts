
// 事件类

import {findPos} from './util';
import {createLocker} from './locker';
import {TEventName, IEventListener, IEventItem, ILockerFn, IEventRegistOption} from './type';
import {triggerOnRegist, triggerOnEmit} from './interceptor';
// import {createListener, triggerListenerItem} from './listener';


export class Event {
    eventName: TEventName;
    id: number;
    hasTrigger: boolean;
    private listeners: Array<IEventItem | undefined>;
    order: number;
    _triggerData: any;
    private _locker: {add ({index, func}: ILockerFn): void; lock (fn: () => any): any;};
    singleMode: boolean;
    constructor (eventName: TEventName) {
        // 对于ready之类的事件 增加一个如果已经触发了就马上执行的逻辑
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
    private _countInsertIndex ({
        index, order, orderBefore = false, head, tail
    }: {
        index?: number; order?: number; orderBefore: boolean; head: boolean, tail: boolean
    }) {
        let insertIndex: number;
        const n = this.listeners.length;
        // 优先级 head > tail > index > order
        if (head) {
            index = 0;
        } else if (tail) {
            index = n;
        }
        
        if (typeof index === 'number') {
            if (index > n) {index = n;}
            else if (index < 0) {index = 0;}
            // index 插入的order等于插入位置的order
            const item = this.listeners[index === n ? index - 1 : index];
            order = item ? item.order : ++ this.order;
            insertIndex = index;
        } else {
            if (typeof order !== 'number') {
                // 默认插入的监听 按照事件的order排序
                order = ++ this.order;
            }
            insertIndex = (n === 0 || order > this._findLastOrder()) ? n : findPos(this.listeners, order, orderBefore);
        }
        return {insertIndex, order};
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
            const result = this._countInsertIndex({
                index, order, orderBefore, head, tail
            });
            insertIndex = result.insertIndex;
            order = result.order;
        }
        const id = ++ this.id;
        const item: IEventItem = {
            eventName: this.eventName,
            listener,
            once,
            immediate,
            hasTrigger: false,
            order,
            id,
            name: name || (`${this.eventName}-${id}`),
            single: this.singleMode,
            head,
            tail,
            orderBefore,
            times,
            timesLeft: times,
        };
        // const item = createListener(this, {
        //     listener,
        //     immediate,
        //     once,
        //     order,
        //     orderBefore,
        //     name,
        //     head,
        //     tail,
        //     times,
        // });
        
        triggerOnRegist({eventName: this.eventName, item});

        this._locker.add({
            index: insertIndex,
            func: () => {this.listeners.splice(insertIndex, 0, item);}
        });
        if (immediate && this.hasTrigger) {
            // triggerListenerItem(item);
            listener(this._triggerData, this._buildListenOption({
                firstEmit: false,
                item
            }));
        }
        return item;
    }
    private _findLastOrder () {
        for (let i = this.listeners.length - 1; i >= 0; i--) {
            if (this.listeners[i]) {
                return (this.listeners[i] as IEventItem).order;
            }
        }
        return 0;
    }
    private _buildListenOption ({
        firstEmit, item
    }: {
        firstEmit: boolean;
        item: IEventItem;
    }) {
        return {
            firstEmit,
            item,
            remove: () => this.remove(item.id),
            clear: () => this.clear()
        };
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
                    const emitOption = this._buildListenOption({firstEmit, item});
                    item.listener(data, emitOption);
                    triggerOnEmit({
                        eventName: this.eventName, data, ...emitOption
                    });
                }
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