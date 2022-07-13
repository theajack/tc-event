import {EventItem} from './objects/event';
import {IListenerItem, IEventRegistOption, IEventEmitter, CEvent} from './type';

export function createListener (event: EventItem, {
    listener,
    immediate = true,
    once = false,
    order,
    orderBefore = false,
    name = '',
    head = false,
    tail = false,
    times = -1,
}: IEventRegistOption & {order: number}): IListenerItem {
    const id = ++ event.id;
    if (once) { times = 1; }
    return {
        eventName: event.eventName,
        listener,
        once,
        immediate,
        hasTrigger: false,
        order,
        id,
        name: name || (`${event.eventName}-${id}`),
        single: event.singleMode,
        head,
        tail,
        orderBefore,
        times,
        timesLeft: times,
    };
}

export function triggerListenerItem (
    parent: IEventEmitter,
    listenerItem?: IListenerItem,
    data?: any,
    firstEmit?: boolean
) {
    if (!listenerItem || listenerItem.timesLeft === 0) return;
    listenerItem.hasTrigger = true;

    if (listenerItem.timesLeft > 0) {
        listenerItem.timesLeft --;
    }

    const event = parent.getEvent(listenerItem.eventName);

    if (typeof firstEmit === 'undefined') {
        firstEmit = event.hasTrigger === false;
    }
    const emitOption = buildListenOption({
        firstEmit,
        item: listenerItem,
        event
    });
    listenerItem.listener(data, emitOption);
    parent.interceptor.triggerOnEmit({
        eventName: event.eventName, data, ...emitOption
    });
}

function buildListenOption ({
    firstEmit, item, event
}: {
    firstEmit: boolean;
    item: IListenerItem;
    event: CEvent;
}) {
    return {
        firstEmit,
        item,
        remove: () => event.remove(item.id),
        clear: () => event.clear()
    };
}