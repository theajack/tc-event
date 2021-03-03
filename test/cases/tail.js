module.exports = {
    name: '测试 tail',
    test ({event}) {
        event.clear();
        const eventName = 'test-tail';
        const result = [];
        event.regist(eventName, () => {
            result.push(1);
        });
        event.regist(eventName, {
            order: 100,
            listener () {result.push(2);}
        });
        event.regist(eventName, {
            index: 100,
            listener () {result.push(3);}
        });
        event.regist(eventName, {
            listener () {result.push(4);}
        });
        event.regist(eventName, {
            tail: true,
            listener () {result.push(5);}
        });
        event.regist(eventName, {
            tail: true,
            listener () {result.push(6);}
        });
        event.emit(eventName);
        return result;
    },
    expect: [1, 4, 2, 3, 5, 6],
};

