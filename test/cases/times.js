module.exports = {
    name: '测试times参数',
    test ({event}) {
        event.clear();
        const eventName = 'test-times';
        const result = [];

        event.regist(eventName, {
            times: 1,
            listener () { result.push(1);}
        });
        event.regist(eventName, {
            times: 2,
            listener () { result.push(2);}
        });
        event.regist(eventName, {
            times: 3,
            listener () { result.push(3);}
        });
        event.emit(eventName);
        event.emit(eventName);
        event.emit(eventName);
        event.emit(eventName);
        return result;
    },
    expect: [1, 2, 3, 2, 3, 3],
};