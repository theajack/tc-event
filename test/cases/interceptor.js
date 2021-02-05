module.exports = {
    name: '测试interceptor参数',
    test ({event}) {
        event.clear();
        const eventName1 = 'test-interceptor1';
        const eventName2 = 'test-interceptor2';
        const result = [];
        event.onRegist(({name}) => {
            result.push(`onRegist: ${name}`);
        });
        event.onEmit(({name, data, firstEmit}) => {
            result.push(`onEmit: ${name} ${data} ${firstEmit}`, );
        });
        event.regist(eventName1, () => {});
        event.regist(eventName2, () => {});
        event.emit(eventName1, `${eventName1} data`);
        event.emit(eventName2, `${eventName2} data`);
        event.emit(eventName2, `${eventName2} data2`);
        return result;
    },
    expect: [
        'onRegist: test-interceptor1',
        'onRegist: test-interceptor2',
        'onEmit: test-interceptor1 test-interceptor1 data true',
        'onEmit: test-interceptor2 test-interceptor2 data true',
        'onEmit: test-interceptor2 test-interceptor2 data2 false'
    ],
};