
import {Event} from './event';
import {clearInterceptor} from './interceptor';
import {IEventJson, TEventName} from './type';
import {isUndf} from './util';


let events: IEventJson<Event> = {}; // 事件回调函数字典
let EVENT: IEventJson<string> = {}; // 事件名称字典

export function getEvent (eventName: TEventName) {
    return events[nameToStr(eventName)];
}
export function setEvent (eventName: TEventName) {
    const name = nameToStr(eventName);
    events[name] = new Event(name);
    EVENT[name] = name;
}
export function delEvent (eventName: TEventName) {
    delete events[nameToStr(eventName)];
    delete EVENT[nameToStr(eventName)];
}

export function getEVENT(): IEventJson<string>;
export function getEVENT(eventName: TEventName): string;
export function getEVENT (eventName?: TEventName) {
    if (isUndf(eventName)) {
        return EVENT;
    }
    return EVENT[nameToStr(eventName as TEventName)];
}

export function clearEvent () {
    events = {};
    EVENT = {};
    clearInterceptor();
}

function nameToStr (eventName: TEventName) {
    if (typeof eventName === 'number') {
        return eventName.toString();
    }
    return eventName;
}