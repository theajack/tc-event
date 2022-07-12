/*
 * @Author: tackchen
 * @Date: 2022-01-13 12:16:06
 * @LastEditors: Please set LastEditors
 * @FilePath: /tc-event/src/modules.ts
 * @Description: 事件模块
 */

import {IEventItem, IEventListener, IEventModuleStatic, IEventRegistOption, IEventJson, IEventLink, IRegistMethod, IRegistObject, TEventName, TModuleName} from './type';
import event from './index';

const moduleMap: IEventJson<IEventModuleStatic> = {};

const PREFIX = '$TC_EM$_';

export function removeModule (name: TModuleName) {
    if (moduleMap[name]) {
        moduleMap[name].clear();
        delete moduleMap[name];
    }
}

export function clearModule () {
    for (const k in moduleMap) {
        removeModule(k);
    }
}

export function getModule (): IEventJson<IEventModuleStatic>;
export function getModule (name: TModuleName): IEventModuleStatic;
export function getModule (name?: TModuleName) {
    if (name) {
        return moduleMap[name];
    }
    return moduleMap;
}

function createModuleNameManaer (name: TModuleName) {

    const PrefixName = `${PREFIX}${name}`;
    const en = (eventName: TEventName) => `${PrefixName}_${eventName}`; // 转换名称

    const map: string[] = [];

    return {
        en,
        registEN (name: TModuleName) {
            name = en(name);
            if (map.indexOf(name) === -1) map.push(name);
            return name;
        },
        clearEN (name: TModuleName) {
            name = en(name);
            const index = map.indexOf(name);
            if (index !== -1) map.splice(index, 1);
            return name;
        },
        getENS () {
            return map;
        }
    };

}

export function createModule (name: TModuleName): IEventModuleStatic {
    if (moduleMap[name]) {
        return moduleMap[name];
    }
    
    const {en, registEN, clearEN, getENS} = createModuleNameManaer(name);

    moduleMap[name] = {
        moduleName: name,
        buildEventName: en,
        version: event.version,
        EVENT: event.EVENT, // 事件枚举
        // init, // 初始化一个事件（注册一个发布者） // 初始化与注册和到一起
        emit (eventName: TEventName, data?: any) {
            return event.emit(en(eventName), data);
        }, // 触发事件
        regist: ((
            eventName: TEventName | IRegistObject,
            listener?: IEventListener | IEventRegistOption,
        ): IEventItem | null | IEventJson<IEventItem> | IEventLink => {
            if (typeof eventName === 'object') {
                const newArg: IRegistObject = {};
                for (const key in eventName as IRegistObject) {
                    newArg[registEN(key)] = eventName[key];
                }
                return event.regist(newArg);
            } else if (typeof listener !== 'undefined') {
                eventName = registEN(eventName) as TEventName;
                return event.regist(eventName, listener);
            }
            return event.regist(eventName);
        }) as IRegistMethod, // 注册一个监听者
        onEmit: event.onEmit,
        onRegist: event.onRegist,
        checkEvent: (eventName: TEventName) => event.checkEvent(en(eventName)), // 检查是否存在事件
        remove: (
            eventName: TEventName | IEventItem,
            cond?: number | IEventListener | boolean,
            immediate?: boolean
        ) => {
            if (typeof eventName === 'string') {
                eventName = en(eventName);
                return event.remove(eventName, cond as number | IEventListener, immediate);
            }
            return event.remove(eventName as IEventItem, immediate);
        },
        clear (name?: TEventName | TEventName[]) {
            if (typeof name === 'string' || typeof name === 'number') {
                name = clearEN(name);
            } else if (name instanceof Array) {
                name = name.map(single => clearEN(single));
            } else if (typeof name === 'undefined') {
                debugger;
                return event.clear(getENS());
            } else {
                return false;
            }
            return event.clear(name);
        },
        order (name: TEventName) {return event.order(en(name));},
        registNotImmediate (name: TEventName, listener: IEventListener) {
            return event.registNotImmediate(en(name), listener);
        },
        registNotImmediateOnce (name: TEventName, listener: IEventListener) {
            return event.registNotImmediateOnce(en(name), listener);
        },
        registOnce (name: TEventName, listener: IEventListener) {
            return event.registOnce(en(name), listener);
        },
        registSingle (name: TEventName, listener: IEventListener) {
            return event.registSingle(en(name), listener);
        }
    };

    return moduleMap[name];
}
