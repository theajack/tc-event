import {IEventStatic, IRegistMethod, TEventName} from './type';
import {clearModule, createModule, getModule, removeModule} from './objects/modules';
import version from './version';
export {GlobalEventInterceptor} from './objects/interceptor';

const DefaultEvent = createModule() as any as IEventStatic;

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
};

export const regist = ((eventName: string, listener?: any) => {
    return DefaultEvent.regist(eventName, listener);
}) as IRegistMethod;

// 触发事件
export function emit (name: TEventName, data?: any): boolean {
    return DefaultEvent.emit(name, data);
}

export default DefaultEvent;