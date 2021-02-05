module.exports = {
    name: '测试checkEvent参数',
    test ({event}) {
        event.clear();
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
        return result;
    },
    expect: [false, true, true, false, true, false],
};