module.exports = {
    name: '测试remove参数',
    test ({event}) {
        event.clear();
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
            event.regist(eventName, {
                listener: l7,
                name: 'xxx'
            });
        });
        event.regist(eventName, l4);
        event.regist(eventName, l5);
        event.regist(eventName, l6);
        event.remove(eventName, l6);
        event.emit(eventName);
        event.emit(eventName);
        return result;
    },
    expect: [1, 2, 3, 7, 5, 1, 2, 3, 7, 7],
};