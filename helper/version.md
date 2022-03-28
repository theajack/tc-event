## 0.0.2

1. 初始版本
2. 测试覆盖

## 0.0.3

1. 增加 registNotImmediate、registNotImmediateOnce、registOnce

## 0.0.4

1. 修改 ts 声明文件

## 0.0.5 

1. listener 第二个参数改为 {firstEmit, remove, clear}
2. 增加 single 参数 用于注册单例事件
3. 增加 registSingle 方法
4. 增加链式调用

## 0.0.6

1. 增加 listener name参数，将事件name参数重命名为eventName参数
2. 增加 head 和 tail 参数
3. 修复 order 参数的一个bug
4. listener 第二个参数改为 {firstEmit, remove, clear, item} 加上了 eventItem

## 0.0.7

1. 增加事件模块系统，避免事件冲突

----

### ENGLISH

##0.0.2

1. Initial version
2. Test Coverage

##0.0.3

1. Add registNotImmediate, registNotImmediateOnce, registOnce

##0.0.4

1. Modify the ts declaration file

##0.0.5

1. The second parameter of listener is changed to {firstEmit, remove, clear}
2. Add single parameter to register singleton events
3. Add the registerSingle method
4. Add chain call

##0.0.6

1. Add the listener name parameter and rename the event name parameter to the eventName parameter
2. Add head and tail parameters
3. Fix a bug in the order parameter
4. The second parameter of listener is changed to {firstEmit, remove, clear, item} and eventItem is added

##0.0.7

1. Add event module system to avoid event conflict