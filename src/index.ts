/*
 * @Author: tackchen
 * @Date: 2022-07-19 11:10:25
 */
import {IEventStatic} from './type';
import {clearModule, createModule, getDefaultEventEmitter, getModule, removeModule} from './objects/modules';
import version from './version';
import {
    EventEmitter
} from './objects/event-emiter';
export {GlobalEventInterceptor} from './objects/interceptor';

const DefaultEvent = getDefaultEventEmitter() as any as IEventStatic;

DefaultEvent.version = version;

DefaultEvent.createModule = createModule;

DefaultEvent.getModule = getModule;

DefaultEvent.clearModule = clearModule;

DefaultEvent.removeModule = removeModule;

DefaultEvent.EventEmitter = EventEmitter;

export default DefaultEvent;