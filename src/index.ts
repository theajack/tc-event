
import {isObject, isUndf} from './util';
import {TEventName, IEventListener, IEventRegistOption, IEventItem, IRegistObject, IJson, ILink} from './type';
import {clearEvent, delEvent, getEVENT, getEvent, setEvent} from './event-pool';
import version from './version';
import {onRegist, onEmit} from './interceptor';
import {createEventLink} from './link-use';

function checkEvent (eventName: TEventName) {
    if (getEvent(eventName)) {
        return true;
    } else {
        return false;
    }
}

// 初始化一个事件
function init (eventName: TEventName) {
    if (isUndf(getEVENT(eventName))) {
        setEvent(eventName);
    }
}

// 注册某个事件的一个或多个回调
function regist(eventName: TEventName, listener: IEventListener | IEventRegistOption): IEventItem;
function regist(eventName: IRegistObject, listener: IEventListener | IEventRegistOption): IEventItem;
function regist(eventName: IJson<IEventRegistOption>): IJson<IEventItem>;
// 链式调用
function regist(eventName: TEventName): ILink;


function regist (
    eventName: TEventName | IRegistObject | IJson<IEventRegistOption>,
    listener?: IEventListener | IEventRegistOption
): IEventItem | null | IJson<IEventItem> | ILink {
    // json 格式传入可以注册个事件
    if (isObject(eventName)) {
        const result: IJson<IEventItem> = {};
        for (const key in eventName as IRegistObject) {
            result[key] = regist(key, (eventName as IJson<IEventRegistOption>)[key]) as IEventItem;
        }
        return result;
    }
    if (typeof listener === 'function') {
        return registBase({eventName: eventName as TEventName, listener});
    } else if (typeof listener === 'object') {
        return registBase({eventName: eventName as TEventName, ...listener});
    } else if (typeof listener === 'undefined') {
        if (typeof eventName === 'string' || typeof eventName === 'number') {
            return createEventLink(eventName);
        }
    }
    console.warn('错误的listener', eventName, listener);
    return null;
}

function registNotImmediate (eventName: TEventName, listener: IEventListener) {
    return regist(eventName, {
        immediate: false,
        listener
    });
}

function registOnce (eventName: TEventName, listener: IEventListener) {
    return regist(eventName, {
        once: true,
        listener
    });
}
function registNotImmediateOnce (eventName: TEventName, listener: IEventListener) {
    return regist(eventName, {
        immediate: false,
        once: true,
        listener
    });
}
function registSingle (eventName: TEventName, listener: IEventListener) {
    return regist(eventName, {
        single: true,
        listener,
    });
}

export function registBase ({
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
    if (!checkEvent(eventName)) {
        init(eventName);
    }
    return getEvent(eventName).regist({
        listener, once, immediate, order, orderBefore, index, single, name, head, tail, times
    });
}

// 移除事件回调
function remove (eventName: TEventName, cond: number | IEventListener, immediate?: boolean): boolean;
function remove (eventItem: IEventItem, immediate?: boolean): boolean;

function remove (
    eventName: TEventName | IEventItem,
    cond?: number | IEventListener | boolean,
    immediate?: boolean
): boolean {
    if (typeof eventName === 'object') {
        immediate = cond as boolean;
        if (eventName === null) {
            console.error('参数错误', eventName);
            return false;
        }
        return remove(eventName.eventName, eventName.id, immediate);
    }
    if (typeof eventName === 'object') {
        const item = eventName as IEventItem;
        return remove(item.eventName, item.id);
    }

    if (!checkEvent(eventName)) {
        console.warn('removeEvent:未找到事件 ' + eventName);
        return false;
    }
    if (isUndf(cond)) {
        console.error('请传入要移除的listener 或 id');
        return false;
    } else {// 移除单个监听
        return getEvent(eventName).remove(cond as number | IEventListener, immediate);
    }
}
// 移除单个事件或是所有
function clear (eventName?: TEventName | TEventName[]) {
    if (typeof eventName === 'string' || typeof eventName === 'number') {
        if (checkEvent(eventName)) {
            getEvent(eventName).clear();
            delEvent(eventName);
        }
    } else if (eventName instanceof Array) {
        eventName.forEach(n => {
            clear(n);
        });
    } else {
        clearEvent();
    }
}

// 触发事件
function emit (eventName: TEventName, data?: any) {
    // 此处是为了 all 参数，当没有regist之前emit了，all的listener也能被触发
    if (!checkEvent(eventName)) {
        init(eventName);
    }
    return getEvent(eventName).emit(data);
}

function order (eventName: TEventName) {
    if (checkEvent(eventName)) {
        return getEvent(eventName).order;
    } else {
        // console.warn('错误的事件：' + name);
        return -1;
    }
}

export default {
    version,
    EVENT: getEVENT(), // 事件枚举
    // init, // 初始化一个事件（注册一个发布者） // 初始化与注册和到一起
    emit, // 触发事件
    onEmit,
    regist, // 注册一个监听者
    onRegist,
    checkEvent, // 检查是否存在事件
    remove,
    clear,
    order,
    registNotImmediate,
    registNotImmediateOnce,
    registOnce,
    registSingle,
};