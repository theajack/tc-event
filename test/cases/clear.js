module.exports = {
    name: '测试clear参数',
    test ({event}) {
        event.clear();
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
        return result;
    },
    expect: [1, 2],
};