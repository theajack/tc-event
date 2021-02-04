
import {isObject, isUndf} from './util';
import {TEventName, IEventListener, IEventRegistOption, IEventItem, IRegistObject, IJson} from './type';
import {clearEvent, delEvent, getEVENT, getEvent, setEvent} from './event-pool';

export function checkEvent (name: TEventName) {
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
function regist (
    name: TEventName | IRegistObject | IJson<IEventRegistOption>,
    listener: IEventListener | IEventRegistOption
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


const event = {
    EVENT: getEVENT(), // 事件枚举
    // init, // 初始化一个事件（注册一个发布者） // 初始化与注册和到一起
    emit, // 触发事件
    regist, // 注册一个监听者
    checkEvent, // 检查是否存在事件
    remove,
    clear,
    index,
};

export default event;

// function test () {
//     let e1 = event.regist('aa', () => {
//         console.log('1');
//     });
//     window.item = event.regist('aa', () => {
//         console.log('2');
//     });
//     event.regist('aa', {
//         index: 0, listener () {
//             console.log('i0');
//             event.remove(e1);
//         }, once: true
//     });
//     event.regist('aa', {
//         index: 2, listener () {console.log('2a');}, all: true
//     });
//     event.regist('aa', {
//         index: 2, listener () {console.log('2b');}, indexBefore: true
//     });
//     event.regist('aa', {
//         listener () {console.log('3');}, once: true, all: true
//     });
//     event.regist('aa', {
//         listener () {console.log('1000');}, index: 1000
//     });
//     event.regist('aa', {
//         listener () {console.log('4');}
//     });
//     event.regist('aa', {
//         index: 0, listener () {console.log('ib0');}, indexBefore: true
//     });
//     event.regist('aa', {
//         index: 0, listener () {console.log('ibb0');}, indexBefore: true
//     });
//     event.emit('aa');
//     // ibb0
//     // ib0
//     // i0
//     // 1
//     // 2b
//     // 2
//     // 2a
//     // 3
//     // 4
//     // 1000
// }
// window.test = test;
// window.event = event;
// window.events = events;