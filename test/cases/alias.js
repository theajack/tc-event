module.exports = {
    name: '测试别名函数',
    test ({event}) {
        event.clear();
        const eventName = 'test-alias';
        const result = [];

        event.registOnce(eventName, () => {
            result.push(1);
        });
        event.emit(eventName);
        event.emit(eventName);
        event.emit(eventName);
        event.clear(eventName);


        event.emit(eventName);
        event.registNotImmediate(eventName, () => {
            result.push(2);
        });
        event.emit(eventName);
        event.clear(eventName);

        event.emit(eventName);
        event.registNotImmediateOnce(eventName, () => {
            result.push(3);
        });
        event.emit(eventName);
        event.emit(eventName);
        event.emit(eventName);
        event.clear(eventName);

        event.registSingle(eventName, () => {
            result.push(4);
        });
        event.registSingle(eventName, () => {
            result.push(5);
        });
        event.emit(eventName);
        
        return result;
    },
    expect: [1, 2, 3, 5],
};