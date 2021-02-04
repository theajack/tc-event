
import {Event} from './event';
import {clearInterceptor} from './interceptor';
import {IJson, TEventName} from './type';
import {isUndf} from './util';


let events: IJson<Event> = {}; // 事件回调函数字典
let EVENT: IJson<string> = {}; // 事件名称字典

export function getEvent (name: TEventName) {
    return events[nameToStr(name)];
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

export function getEVENT (name?: TEventName) {
    if (isUndf(name)) {
        return EVENT;
    }
    return EVENT[nameToStr(name as TEventName)];
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