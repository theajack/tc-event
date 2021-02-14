import {IEventRegistOption, TEventName, IEventListener, ILink} from './type';
import {registBase} from './index';

export function createEventLink (name: TEventName): ILink {
    const options: IEventRegistOption & {
        name: TEventName;
    } = {
        name,
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
        index  (index: number) {
            options.index = index;
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
        listen (listener?: IEventListener) {
            if (listener) {
                options.listener = listener;
            }
            return registBase(options);
        }
    };
}

