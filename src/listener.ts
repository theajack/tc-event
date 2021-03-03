import {Event} from './event';
import {getEvent} from './event-pool';
import {IEventItem, IEventRegistOption} from './type';

export function createListener (event: Event, {
    listener,
    immediate = true,
    once = false,
    order,
    orderBefore = false,
    name = '',
    head = false,
    tail = false,
    times = -1,
}: IEventRegistOption & {order: number}): IEventItem {
    const id = ++ event.id;
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

export function triggerListenerItem (listenerItem: IEventItem) {
    const event = getEvent(listenerItem.eventName);

    listenerItem.listener(event._triggerData, buildListenOption({
        firstEmit: event.hasTrigger === false,
        item: listenerItem,
        event
    }));
}

function buildListenOption ({
    firstEmit, item, event
}: {
    firstEmit: boolean;
    item: IEventItem;
    event: Event;
}) {
    return {
        firstEmit,
        item,
        remove: () => event.remove(item.id),
        clear: () => event.clear()
    };
}