
import {EventItem} from './event';
import {IEventJson, TEventName, IEventEmitter} from '../type';

function nameToStr (eventName: TEventName) {
    return (typeof eventName === 'number') ? eventName.toString() : eventName;
}

export class EventStore {

    parent: IEventEmitter;
    events: IEventJson<EventItem> = {};
    EVENTS: string[] = [];

    constructor (parent: IEventEmitter) {
        this.parent = parent;
    }

    delEvent (eventName: TEventName) {
        const name = nameToStr(eventName);
        if (!name) return;
        delete this.events[name];
        const index = this.EVENTS.indexOf(name);
        if (index !== -1) {
            this.EVENTS.splice(index, 1);
        }
    }
    
    getEvent (eventName: TEventName) {
        return this.events[nameToStr(eventName)];
    }

    setEvent (eventName: TEventName) {
        const name = nameToStr(eventName);
        if (!name) return;
        this.events[name] = new EventItem(name, this.parent);
        if (this.EVENTS.indexOf(name) === -1) this.EVENTS.push(name);
    }
    clearEvent () {
        this.events = {};
        this.EVENTS = [];
        this.parent.interceptor.clearInterceptor();
    }
}