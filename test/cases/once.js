module.exports = {
    name: '测试once参数',
    test ({event}) {
        event.clear();
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
        return result;
    },
    expect: [1, 2, 3, 1, 3],
};