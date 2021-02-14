module.exports = {
    name: '测试single参数',
    test ({event}) {
        event.clear();
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
        return result;
    },
    expect: [1, 2, 4, 5],
};