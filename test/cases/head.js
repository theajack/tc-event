module.exports = {
    name: '测试 head',
    test ({event}) {
        event.clear();
        const eventName = 'test-head';
        const result = [];
        event.regist(eventName, () => {
            result.push(1);
        });
        event.regist(eventName, {
            order: -1,
            listener () {result.push(2);}
        });
        event.regist(eventName, {
            index: -1,
            listener () {result.push(3);}
        });
        event.regist(eventName, {
            head: true,
            listener () {result.push(4);}
        });
        event.regist(eventName, {
            head: true,
            listener () {result.push(5);}
        });
        event.emit(eventName);
        return result;
    },
    expect: [5, 4, 3, 2, 1],
};

