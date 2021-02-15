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

<h3>🚀 功能强大、简单易用的事件库</h3>

**[English](https://github.com/theajack/tc-event/blob/master/README.md) | [更新日志](https://github.com/theajack/tc-event/blob/master/helper/version.md) | [反馈错误/缺漏](https://github.com/theajack/tc-event/issues/new) | [Gitee](https://gitee.com/theajack/tc-event)**

---

### 1. 特性

1. typescript 编写
2. 多端支持
3. 自定义事件顺序、多种触发模式
4. 全局拦截机制
5. 体积小巧，简单易用

### 2. 快速使用

#### 2.1 npm 安装

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
    EVENT: IJson<string>; // 事件枚举
    emit(name: TEventName, data?: any): boolean; // 触发事件
    onEmit(fn: IOnInterceptorEmit): void;
    regist(name: TEventName, listener: IEventListener | IEventRegistOption): IEventItem;
    regist(name: TEventName): ILink;
    regist(name: IJson<IEventRegistOption>): IJson<IEventItem>;
    regist(name: IRegistObject): IEventItem;
    onRegist(fn: IOnInterceptorRegist): void;
    checkEvent(name: TEventName): boolean; // 检查是否存在事件
    remove(name: TEventName, cond: number | IEventListener, imme?: boolean): boolean;
    remove(eventItem: IEventItem, imme?: boolean): boolean;
    clear(name?: TEventName | TEventName[]): void;
    order(name: TEventName): number;
    registNotImmediate(name: TEventName, listener: IEventListener): IEventItem;
    registNotImmediateOnce(name: TEventName, listener: IEventListener): IEventItem;
    registOnce(name: TEventName, listener: IEventListener): IEventItem;
    registSingle(name: TEventName, listener: IEventListener): IEventItem;
}
```

### 4 使用实例

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

#### 4.2 clear 方法

清除单个或所有事件

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

#### 4.3 immediate 参数

immediate 参数表示注册事件时，如果该事件已经被触发过，是否需要立即触发当前的事件

默认值为 true

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

#### 4.4 index 参数

index 参数表示注册事件时，希望插入的位置

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

全局拦截器，支持 onRegist 和 onEmit

```js
const eventName1 = 'test-interceptor1';
const eventName2 = 'test-interceptor2';
const result = [];
event.onRegist(({name, item}) => {
    result.push(`onRegist: ${name}`);
});
event.onEmit(({name, item, data, firstEmit}) => {
    result.push(`onEmit: ${name} ${data} ${firstEmit}`);
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

#### 4.6 once 参数

once 参数 是否只触发依次

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

#### 4.7 order 参数

控制插入事件的序号（和 index参数有区别）

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

#### 4.8 single 参数

单例监听模式，对某个事件名启用 single 参数会覆盖之前该事件的所有监听函数

且之后该事件无需再带上 single 参数

启用single参数时， index order orderBefore 参数无效

```js
const eventName = 'test-single';
const result = [];

event.regist(eventName, () => {
    result.push(1);
});
event.emit(eventName);
// 测试覆盖旧方法
event.regist(eventName, {
    single: true,
    immediate: false,
    listener: () => {
        result.push(2);
    }
});
event.emit(eventName);
event.clear(eventName);

event.regist(eventName, {
    single: true,
    listener () { result.push(3);}
});
event.regist(eventName, {
    single: true,
    listener () { result.push(4);}
});
event.emit(eventName);
// 测试single参数缓存
event.regist(eventName, {
    immediate: false,
    listener () { result.push(5);}
});
event.emit(eventName);
console.log(result);
// [1, 2, 4, 5]
```

#### 4.9 order 函数

获取某个监听的序号

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

#### 4.10 remove 函数

移除事件监听

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

#### 4.11 registNotImmediate

```js
event.registNotImmediate('xxx', ()=>{})
// 等价于
event.regist('xxx', {
    immediate: false,
    listener: ()=>{}
})
```

#### 4.12 registOnce

```js
event.registOnce('xxx', ()=>{})
// 等价于
event.regist('xxx', {
    once: true,
    listener: ()=>{}
})
```

#### 4.13 registNotImmediateOnce

```js
event.registNotImmediateOnce('xxx', ()=>{})
// 等价于
event.regist('xxx', {
    immediate: false,
    once: true,
    listener: ()=>{}
})
```

#### 4.14 registSingle

```js
event.registSingle('xxx', ()=>{})
// 等价于
event.regist('xxx', {
    single: true,
    listener: ()=>{}
})
```

#### 4.15 监听回调参数

监听函数第二个参数是一个json，包含有三个属性

1. firstEmit 表示该监听是否是首次触发
2. remove 是移除当前监听的方法
3. clear 是移除当前事件的方法

```js
event.regist('xxx', (data, {firstEmit, remove, clear})=>{

})
```

#### 4.16 链式调用

regist函数当指传入事件名时会启用链式调用

所有参数都可通过链式调用，所有api都是可选的，最后需要通过 listen 方法触发监听


```js
event.regist('xxx')
    .index(1)
    .order(1)
    .orderBefore()
    .notImmediate()
    .single()
    .once()
    .listener()
    .listen();
```

声明文件如下

```ts
interface ILink {
    single: (single: boolean) => ILink;
    notImmediate: (immediate: boolean) => ILink;
    once: (once: boolean) => ILink;
    index: (index: number) => ILink;
    order: (order: number) => ILink;
    orderBefore: (orderBefore: boolean) => ILink;
    listener: (listener: IEventListener) => ILink;
    listen: (listener?: IEventListener) => IEventItem;
}
```

### 5 ts 接口

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
    single?: boolean;
}
export interface IRegistObject {
    [key: string]: IEventRegistOption;
}
export interface IEventListener {
    (data: any, listenOption: {
        firstEmit: boolean;
        remove: () => boolean;
        clear: () => boolean;
    }): void;
}
export interface IEventItem {
    name: TEventName;
    listener: IEventListener;
    immediate: boolean;
    once: boolean;
    order: number;
    hasTrigger: boolean;
    id: number;
    single: boolean;
}
```