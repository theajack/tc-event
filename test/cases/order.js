module.exports = {
    name: '测试index参数',
    test ({event}) {
        event.clear();
        const eventName = 'test-order';
            
        const result = [];
        event.regist(eventName, () => {
            result.push(1); // 1
        });
        event.regist(eventName, () => {
            result.push(2); // 1 2
        });
        event.regist(eventName, {
            order: 0, // 0 1 2
            listener () {result.push(3);}
        });
        event.regist(eventName, {
            order: 1, // 0 1 *1 2
            listener () {result.push(4);}
        });
        event.regist(eventName, {
            order: 1, // 0 1 *1 **1 2
            listener () {result.push(5);}
        });
        event.regist(eventName, {
            order: 1, // 0 ***1 1 *1 **1 2
            orderBefore: true,
            listener () {result.push(6);}
        });
        event.regist(eventName, {
            order: 10, // 0 ***1 1 *1 **1 2 10
            listener () {result.push(7);}
        });
        event.regist(eventName, () => { // 0 ***1 1 *1 **1 2 3 10
            result.push(8);
        });
        event.emit(eventName);
        return result;
    },
    expect: [3, 6, 1, 4, 5, 2, 8, 7],
};

