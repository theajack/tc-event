/*
 * @Author: tackchen
 * @Date: 2022-01-13 12:16:06
 * @LastEditors: Please set LastEditors
 * @FilePath: /tc-event/src/modules.ts
 * @Description: 事件模块
 */
import {EventEmitter} from './event-emiter';
import {IEventEmitter, IEventJson, TModuleName} from '../type';
import {GlobalEventInterceptor} from './interceptor';

const DefaultEventEmitter = new EventEmitter();

(GlobalEventInterceptor as any).id = 'g';

DefaultEventEmitter.interceptor = GlobalEventInterceptor;

const moduleMap: IEventJson<IEventEmitter> = {};

export function removeModule (name: TModuleName) {
    if (moduleMap[name]) {
        moduleMap[name].clear();
        moduleMap[name].removed = true;
        delete moduleMap[name];
    }
}

export function clearModule () {
    for (const k in moduleMap) {
        if (k)
            removeModule(k);
    }
}

export function getModule (): IEventJson<IEventEmitter>;
export function getModule (name: TModuleName): IEventEmitter;
export function getModule (name?: TModuleName) {
    if (name) {
        return moduleMap[name];
    }
    return moduleMap;
}

export function createModule (name?: TModuleName): IEventEmitter {
    if (typeof name === 'undefined') return DefaultEventEmitter;
    if (!moduleMap[name]) {
        moduleMap[name] = new EventEmitter(name);
    }

    return moduleMap[name];
}
