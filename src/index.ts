/*
 * @Author: tackchen
 * @Date: 2022-07-19 11:10:25
 */
import {IEventStatic, IRegistMethod, TEventName} from './type';
import {clearModule, createModule, getDefaultEventEmitter, getModule, removeModule} from './objects/modules';
import version from './version';
import {EventEmitter} from './objects/event-emiter';
export {GlobalEventInterceptor} from './objects/interceptor';

const DefaultEvent = getDefaultEventEmitter() as any as IEventStatic;

DefaultEvent.version = version;

DefaultEvent.createModule = createModule;

DefaultEvent.getModule = getModule;

DefaultEvent.clearModule = clearModule;

DefaultEvent.removeModule = removeModule;

export {
    DefaultEvent as event,
    version,
    createModule,
    getModule,
    clearModule,
    removeModule,
    EventEmitter,
};

export const regist = ((eventName: string, listener?: any) => {
    return DefaultEvent.regist(eventName, listener);
}) as IRegistMethod;

// 触发事件
export function emit (name: TEventName, data?: any): boolean {
    return DefaultEvent.emit(name, data);
}

export default DefaultEvent;