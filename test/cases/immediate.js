
module.exports = {
    name: '测试immediate参数', // 可选
    test ({event}) {
        event.clear();
        const eventName = 'test-immediate';
        const result = [];
        event.emit(eventName);

        event.regist(eventName, () => {
            result.push(1);
        });
        event.regist(eventName, {
            immediate: true,
            listener () { result.push(2);}
        });
        event.regist(eventName, {
            immediate: false,
            listener () {result.push(3);}
        });
        return result;
    },
    expect: [1, 2],
};