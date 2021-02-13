# [tc-event](https://www.github.com/theajack/tc-event)

<p>
    <a href="https://www.github.com/theajack/tc-event"><img src="https://img.shields.io/github/stars/theajack/tc-event.svg?style=social" alt="star"></a>
    <a href="https://theajack.gitee.io"><img src="https://img.shields.io/badge/author-theajack-blue.svg?style=social" alt="Author"></a>
</p> 

<p>
    <a href="https://www.npmjs.com/package/tc-event"><img src="https://img.shields.io/npm/v/tc-event.svg" alt="Version"></a>
    <a href="https://npmcharts.com/compare/tc-event?minimal=true"><img src="https://img.shields.io/npm/dm/tc-event.svg" alt="Downloads"></a>
    <a href="https://cdn.jsdelivr.net/gh/theajack/tc-event/dist/tc-event.latest.min.js"><img src="https://img.shields.io/bundlephobia/minzip/tc-event.svg" alt="Size"></a>
    <a href="https://github.com/theajack/tc-event/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/tc-event.svg" alt="License"></a>
    <a href="https://github.com/theajack/tc-event/search?l=typescript"><img src="https://img.shields.io/github/languages/top/theajack/tc-event.svg" alt="TopLang"></a>
    <a href="https://github.com/theajack/tc-event/issues"><img src="https://img.shields.io/github/issues-closed/theajack/tc-event.svg" alt="issue"></a>
    <a href="https://github.com/theajack/tc-event/blob/master/test/test-report.txt"><img src="https://img.shields.io/badge/test-passed-44BB44" alt="test"></a>
</p>

<h3>🚀 Powerful and easy-to-use event library</h3>

**[中文](https://github.com/theajack/tc-event/blob/master/README.cn.md) | [Update Log](https://github.com/theajack/tc-event/blob/master/helper/version.md) | [Feedback bug](https://github.com/theajack/tc-event/issues/new) | [Gitee](https://gitee.com/theajack/tc-event)**

---

### 1. Features

1. Typescript writing
2. Multi-terminal support
3. Custom event sequence, multiple trigger modes
4. Global interception mechanism
5. Small size, easy to use

### 2. Quick use

#### 2.1 npm installation

```
npm i tc-event
```

```js
import event from 'tc-event';

event.regist('myEvent', (data) => {
    console.log('emited!', data);
})

event.emit('myEvent', 'Aha!');
```

#### 2.2 cdn


```html
<script src="https://cdn.jsdelivr.net/npm/tc-event/tc-event.min.js"></script>
<script>
    TEvent.regist('myEvent', function (data) {
        console.log('emited!', data);
    })

    TEvent.emit('myEvent', 'Aha!');
</script>
```

### 3 api

```ts
interface IEventStatic {
    version: string;
    EVENT: IJson<string>; // event enumeration
    emit(name: TEventName, data?: any): boolean; // trigger event
    onEmit(fn: IOnInterceptorEmit): void;
    regist(name: TEventName, listener: IEventListener | IEventRegistOption): IEventItem;
    regist(name: IRegistObject, listener: IEventListener | IEventRegistOption): IEventItem;
    regist(name: IJson<IEventRegistOption>): IJson<IEventItem>;
    onRegist(fn: IOnInterceptorRegist): void;
    checkEvent(name: TEventName): boolean; // Check if there is an event
    remove(name: TEventName, cond: number | IEventListener, imme?: boolean): boolean;
    remove(eventItem: IEventItem, imme?: boolean): boolean;
    clear(name?: TEventName | TEventName[]): void;
    order(name: TEventName): number;
}
```

### 4 Use case

#### 4.1 checkEvent

```js
const eventName = 'test-checkEvent';
const result = [];
result.push(event.checkEvent(eventName));
event.regist(eventName, () => {});
result.push(event.checkEvent(eventName));
event.emit(eventName);
result.push(event.checkEvent(eventName));
event.clear(eventName);
result.push(event.checkEvent(eventName));
event.regist(eventName, () => {});
result.push(event.checkEvent(eventName));
event.clear();
result.push(event.checkEvent(eventName));
console.log(result);
// [false, true, true, false, true, false]
```

#### 4.2 clear method

Clear single or all events

```js
const eventName = 'test-clear';
const result = [];
event.regist(eventName, () => {
    result.push(1);
});
event.emit(eventName);
event.clear(eventName);
event.emit(eventName);
event.regist(eventName, {
    immediate: false,
    listener: () => {
        result.push(2);
    }
});
event.emit(eventName);
event.clear();
event.emit(eventName);
console.log(result);
// [1, 2]
```

#### 4.3 immediate parameters

The immediate parameter indicates whether the current event needs to be triggered immediately if the event has already been triggered when registering an event

```js
const eventName = 'test-immediate';
const result = [];
event.emit(eventName);

event.regist(eventName, () => {
    result.push(1);
});
event.regist(eventName, {
    immediate: true,
    listener () { result.push(2);}
});
event.regist(eventName, {
    immediate: false,
    listener () {result.push(3);}
});
console.log(result);
// [1, 2]
```

#### 4.4 index parameter

The index parameter indicates the position where you want to insert when registering an event

```js
const eventName = 'test-order';
    
const result = [];
event.regist(eventName, () => {
    result.push(1); // 1
});
event.regist(eventName, () => {
    result.push(2); // 1 2
});
event.regist(eventName, () => {
    result.push(3); // 1 2 3
});
event.regist(eventName, () => {
    result.push(4); // 1 2 3 4
});
event.regist(eventName, {
    index: 0,  // 5 1 2 3 4
    listener () {result.push(5);}
});
event.regist(eventName, {
    index: 2, // 5 1 6 2 3 4
    listener () {result.push(6);}
});
event.regist(eventName, {
    index: 1, // 5 7 1 6 2 3 4
    listener () {result.push(7);}
});
event.regist(eventName, {
    index: 100, // 5 7 1 6 2 3 4 8
    listener () {result.push(8);}
});
event.regist(eventName, {
    index: -3, // 9 5 7 1 6 2 3 4 8
    listener () {result.push(9);}
});
event.emit(eventName);
console.log(result);
// [9, 5, 7, 1, 6, 2, 3, 4, 8]
```

#### 4.5 interceptor

Global interceptor, support onRegist and onEmit

```js
const eventName1 = 'test-interceptor1';
const eventName2 = 'test-interceptor2';
const result = [];
event.onRegist(({name, item}) => {
    result.push(`onRegist: ${name}`);
});
event.onEmit(({name, item, data, firstEmit}) => {
    result.push(`onEmit: ${name} ${data} ${firstEmit}`, );
});
event.regist(eventName1, () => {});
event.regist(eventName2, () => {});
event.emit(eventName1, `${eventName1} data`);
event.emit(eventName2, `${eventName2} data`);
event.emit(eventName2, `${eventName2} data2`);
console.log(result);
/*
    [
        'onRegist: test-interceptor1',
        'onRegist: test-interceptor2',
        'onEmit: test-interceptor1 test-interceptor1 data true',
        'onEmit: test-interceptor2 test-interceptor2 data true',
        'onEmit: test-interceptor2 test-interceptor2 data2 false'
    ]
*/
```

#### 4.6 once parameter

once parameter is only triggered sequentially

```js
const eventName = 'test-once';
const result = [];

event.regist(eventName, () => {
    result.push(1);
});
event.regist(eventName, {
    once: true,
    listener () { result.push(2);}
});
event.regist(eventName, {
    once: false,
    listener () {result.push(3);}
});
event.emit(eventName);
event.emit(eventName);
console.log(result);
// [1, 2, 3, 1, 3]
```

#### 4.7 order parameter

Control the sequence number of the insertion event (different from the index parameter)

```js
const eventName = 'test-order';
            
const result = [];
event.regist(eventName, () => {
    result.push(1); // 1
});
event.regist(eventName, () => {
    result.push(2); // 1 2
});
event.regist(eventName, {
    order: 0, // 0 1 2
    listener () {result.push(3);}
});
event.regist(eventName, {
    order: 1, // 0 1 *1 2
    listener () {result.push(4);}
});
event.regist(eventName, {
    order: 1, // 0 1 *1 **1 2
    listener () {result.push(5);}
});
event.regist(eventName, {
    order: 1, // 0 ***1 1 *1 **1 2
    orderBefore: true,
    listener () {result.push(6);}
});
event.regist(eventName, {
    order: 10, // 0 ***1 1 *1 **1 2 10
    listener () {result.push(7);}
});
event.regist(eventName, () => { // 0 ***1 1 *1 **1 2 3 10
    result.push(8);
});
event.emit(eventName);
console.log(result);
```

#### 4.8 order method

Get the serial number of a monitor

```js
const eventName = 'test-order-fn';
const result = [];

event.regist(eventName, () => {
    result.push(1);
});
event.regist(eventName, () => {
    result.push(2);
});
const e1 = event.regist(eventName, () => {
    result.push(3);
});
const e2 = event.regist(eventName, {
    order: 1,
    listener () { result.push(4);}
});
event.regist(eventName, () => {
    result.push(5);
});
event.emit(eventName);
console.log([result, event.order(eventName), e1.order, e2.order]);
// [[1, 4, 2, 3, 5], 4, 3, 1
```

#### 4.9 remove method

Remove event listener

```js
const eventName = 'test-remove';
const result = [];
const l4 = () => { result.push(4); };
const l5 = () => { result.push(5); };
const l6 = () => { result.push(6); };
const l7 = () => { result.push(7); };
event.regist(eventName, () => {
    result.push(1);
});
event.regist(eventName, () => {
    result.push(2);
});
event.regist(eventName, () => {
    result.push(3);
    event.remove(eventName, l4, true);
    event.remove(eventName, l5);
    event.regist(eventName, l7);
});
event.regist(eventName, l4);
event.regist(eventName, l5);
event.regist(eventName, l6);
event.remove(eventName, l6);
event.emit(eventName);
event.emit(eventName);
console.log(result);
// [1, 2, 3, 7, 5, 1, 2, 3, 7, 7]
```

#### 4.10 registNotImmediate

```js
event.registNotImmediate('xxx', ()=>{})
// equals
event.regist('xxx', {
    immediate: false,
    listener: ()=>{}
})
```

#### 4.11 registOnce

```js
event.registOnce('xxx', ()=>{})
// equals
event.regist('xxx', {
    once: true,
    listener: ()=>{}
})
```

#### 4.12 registNotImmediateOnce

```js
event.registNotImmediateOnce('xxx', ()=>{})
// equals
event.regist('xxx', {
    immediate: false,
    once: true,
    listener: ()=>{}
})
```

### 5 ts interface

 1. IEventRegistOption
 2. IRegistObject
 3. IEventListener
 5. IEventItem

```ts
export interface IEventRegistOption {
    listener: IEventListener;
    immediate?: boolean;
    once?: boolean;
    order?: number;
    orderBefore?: boolean;
    index?: number;
}
export interface IRegistObject {
    [key: string]: IEventRegistOption;
}
export interface IEventListener {
    (data: any, firstEmit: boolean): void;
}
export interface IEventItem {
    name: TEventName;
    listener: IEventListener;
    immediate: boolean;
    once: boolean;
    order: number;
    hasTrigger: boolean;
    id: number;
}
```