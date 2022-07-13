import {IEventStatic} from './type';
import {clearModule, createModule, getModule, removeModule} from './objects/modules';
import version from './version';

const DefaultEvent = createModule() as any as IEventStatic;

DefaultEvent.version = version;

DefaultEvent.createModule = createModule;

DefaultEvent.getModule = getModule;

DefaultEvent.clearModule = clearModule;

DefaultEvent.removeModule = removeModule;

export default DefaultEvent;