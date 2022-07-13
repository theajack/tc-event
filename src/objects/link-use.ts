import {IEventRegistOption, TEventName, IEventListener, IEventLink} from '../type';
import {EventEmitter} from './event-emiter';

export function createEventLink (eventName: TEventName, event: EventEmitter): IEventLink {
    const options: IEventRegistOption & {
        eventName: TEventName;
    } = {
        eventName,
        listener: () => {}
    };
    return {
        single (single = true) {
            options.single = single;
            return this;
        },
        notImmediate (immediate = false) {
            options.immediate = immediate;
            return this;
        },
        once (once = true) {
            options.once = once;
            return this;
        },
        index (index: number) {
            options.index = index;
            return this;
        },
        head () {
            options.head = true;
            return this;
        },
        tail () {
            options.tail = true;
            return this;
        },
        name (name) {
            options.name = name;
            return this;
        },
        orderBefore (orderBefore = true) {
            options.orderBefore = orderBefore;
            return this;
        },
        order (order: number) {
            options.order = order;
            return this;
        },
        listener (listener: IEventListener) {
            options.listener = listener;
            return this;
        },
        times (times: number) {
            options.times = times;
            return this;
        },
        listen (listener?: IEventListener) {
            if (listener) {
                options.listener = listener;
            }
            return event.registObject(options);
        }
    };
}

