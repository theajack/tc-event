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