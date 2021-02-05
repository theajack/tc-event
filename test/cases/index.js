module.exports = {
    name: '测试order和orderBefore参数',
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
        event.regist(eventName, () => {
            result.push(3); // 1 2 3
        });
        event.regist(eventName, () => {
            result.push(4); // 1 2 3 4
        });
        event.regist(eventName, {
            index: 0,  // 5 1 2 3 4
            listener () {result.push(5);}
        });
        event.regist(eventName, {
            index: 2, // 5 1 6 2 3 4
            listener () {result.push(6);}
        });
        event.regist(eventName, {
            index: 1, // 5 7 1 6 2 3 4
            listener () {result.push(7);}
        });
        event.regist(eventName, {
            index: 100, // 5 7 1 6 2 3 4 8
            listener () {result.push(8);}
        });
        event.regist(eventName, {
            index: -3, // 9 5 7 1 6 2 3 4 8
            listener () {result.push(9);}
        });
        event.emit(eventName);
        return result;
    },
    expect: [9, 5, 7, 1, 6, 2, 3, 4, 8],
};

