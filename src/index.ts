
import {isObject, isUndf} from './util';
import {TEventName, IEventListener, IEventRegistOption, IEventItem, IRegistObject, IJson} from './type';
import {clearEvent, delEvent, getEVENT, getEvent, setEvent} from './event-pool';
import version from './version';
import {onRegist, onEmit} from './interceptor';

function checkEvent (name: TEventName) {
    if (getEvent(name)) {
        return true;
    } else {
        return false;
    }
}

// 初始化一个事件
function init (name: TEventName) {
    if (isUndf(getEVENT(name))) {
        setEvent(name);
    }
}

// 注册某个事件的一个或多个回调
function regist(name: TEventName, listener: IEventListener | IEventRegistOption): IEventItem;
function regist(name: IRegistObject, listener: IEventListener | IEventRegistOption): IEventItem;
function regist(name: IJson<IEventRegistOption>): IJson<IEventItem>;

function regist (
    name: TEventName | IRegistObject | IJson<IEventRegistOption>,
    listener?: IEventListener | IEventRegistOption
): IEventItem | null | IJson<IEventItem> {
    // json 格式传入可以注册个事件
    if (isObject(name)) {
        const result: IJson<IEventItem> = {};
        for (const key in name as IRegistObject) {
            result[key] = regist(key, (name as IJson<IEventRegistOption>)[key]) as IEventItem;
        }
        return result;
    }
    if (typeof listener === 'function') {
        return registBase({name: name as TEventName, listener});
    } else if (typeof listener === 'object') {
        return registBase({name: name as TEventName, ...listener});
    } else {
        console.warn('错误的listener', name, listener);
        return null;
    }
}


function registBase ({
    once = false, // 只触发一次
    all = true, // 始终起作用
    name,
    listener,
    index,
    indexBefore,
}: IEventRegistOption & {name: TEventName}) {
    if (!checkEvent(name)) {
        init(name);
    }
    return getEvent(name).regist({listener, once, all, index, indexBefore});
}

// 移除事件回调
function remove (name: TEventName, cond: number | IEventListener, imme?: boolean): boolean;
function remove (eventItem: IEventItem, imme?: boolean): boolean;

function remove (
    name: TEventName | IEventItem,
    cond?: number | IEventListener | boolean,
    imme?: boolean
): boolean {
    if (typeof name === 'object') {
        imme = cond as boolean;
        if (name === null) {
            console.error('参数错误', name);
            return false;
        }
        return remove(name.name, name.id, imme);
    }
    if (typeof name === 'object') {
        const item = name as IEventItem;
        return remove(item.name, item.id);
    }

    if (!checkEvent(name)) {
        console.warn('removeEvent:未找到事件 ' + name);
        return false;
    }
    if (isUndf(cond)) {
        console.error('请传入要移除的listener 或 id');
        return false;
    } else {// 移除单个监听
        return getEvent(name).remove(cond as number | IEventListener, imme);
    }
}
// 移除单个事件或是所有
function clear (name: TEventName | TEventName[]) {
    if (typeof name === 'string' || typeof name === 'number') {
        if (checkEvent(name)) {
            getEvent(name).clear();
            delEvent(name);
        }
    } else if (name instanceof Array) {
        name.forEach(n => {
            clear(n);
        });
    } else {
        clearEvent();
    }
}

// 触发事件
function emit (name: TEventName, data: any) {
    // 此处是为了 all 参数，当没有regist之前emit了，all的listener也能被触发
    if (!checkEvent(name)) {
        init(name);
    }
    return getEvent(name).emit(data);
}

function index (name: TEventName) {
    if (checkEvent(name)) {
        return getEvent(name).index;
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
    index,
};