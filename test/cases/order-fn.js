module.exports = {
    name: '测试order函数',
    test ({event}) {
        event.clear();
        const eventName = 'test-order-fn';
        const result = [];

        event.regist(eventName, () => {
            result.push(1);
        });
        event.regist(eventName, () => {
            result.push(2);
        });
        const e1 = event.regist(eventName, () => {
            result.push(3);
        });
        const e2 = event.regist(eventName, {
            order: 1,
            listener () { result.push(4);}
        });
        event.regist(eventName, () => {
            result.push(5);
        });
        event.emit(eventName);
        return [result, event.order(eventName), e1.order, e2.order];
    },
    expect: [[1, 4, 2, 3, 5], 4, 3, 1],
};