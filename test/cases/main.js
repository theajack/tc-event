module.exports = {
    name: '测试event时序', // 可选
    plugin: 'asyncPlugin',
    async test ({event, lib}) {
        event.clear();
        const eventName = 'test';
        return new Promise((resolve) => {
            const result = [];
            lib.registInterceptor({
                event,
                eventName,
                done () {
                    resolve(result);
                }
            });
            const e1 = event.regist(eventName, () => {
                result.push('1');
            });
            event.regist(eventName, () => {
                result.push('2');
            });
            event.regist(eventName, {
                order: 0, listener () {
                    result.push('i0');
                    event.remove(e1);
                }, once: true
            });
            event.regist(eventName, {
                order: 2, listener () {result.push('2a');}, all: true
            });
            event.regist(eventName, {
                order: 2, listener () {result.push('2b');}, orderBefore: true
            });
            event.regist(eventName, {
                listener () {result.push('3');}, once: true, all: true
            });
            event.regist(eventName, {
                listener () {result.push('1000');}, order: 1000
            });
            event.regist(eventName, {
                listener () {result.push('4');}
            });
            event.regist(eventName, {
                order: 0, listener () {result.push('ib0');}, orderBefore: true
            });
            event.regist(eventName, {
                order: 0, listener () {result.push('ibb0');}, orderBefore: true
            });
            event.regist(eventName, () => {
                result.push('5');
            });
            event.emit(eventName);
        });
    },
    expect: [
        'ibb0', 'ib0', 'i0', '1', '2b', '2', '2a', '3', '4', '5', '1000'
    ],
};