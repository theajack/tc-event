module.exports = [
    {
        name: '测试interceptor参数',
        test ({event}) {
            event.clear();
            const eventName1 = 'test-interceptor1';
            const eventName2 = 'test-interceptor2';
            const result = [];
            event.onRegist(({eventName}) => {
                result.push(`onRegist: ${eventName}`);
            });
            event.onEmit(({eventName, data, firstEmit, item}) => {
                result.push(`onEmit: ${eventName} ${data} ${firstEmit} ${item.id}`, );
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
            'onEmit: test-interceptor1 test-interceptor1 data true 1',
            'onEmit: test-interceptor2 test-interceptor2 data true 1',
            'onEmit: test-interceptor2 test-interceptor2 data2 false 1'
        ],
    },
    {
        name: '测试global interceptor',
        test ({event}) {
            event.clear();
            const result = [];
            event.onEmit(d => {result.push(`global:${d.data}`);});
            const moduleA = event.createModule('a');
            moduleA.regist('e', (d) => {result.push(`emit:${d}`);});
            moduleA.onEmit(d => {result.push(`current:${d.data}`);});
            moduleA.emit('e', '1');
            return result;
        },
        expect: ['emit:1', 'global:1', 'current:1']
    }
];

