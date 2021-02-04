const {registInterceptor, promise} = require('../lib');

module.exports = [
    {
        name: '测试event时序', // 可选
        plugin: 'asyncPlugin',
        async test (event) {
            event.clear();
            const eventName = 'test';
            return await promise((resolve) => {
                const result = [];
                registInterceptor({
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
                    index: 0, listener () {
                        result.push('i0');
                        event.remove(e1);
                    }, once: true
                });
                event.regist(eventName, {
                    index: 2, listener () {result.push('2a');}, all: true
                });
                event.regist(eventName, {
                    index: 2, listener () {result.push('2b');}, indexBefore: true
                });
                event.regist(eventName, {
                    listener () {result.push('3');}, once: true, all: true
                });
                event.regist(eventName, {
                    listener () {result.push('1000');}, index: 1000
                });
                event.regist(eventName, {
                    listener () {result.push('4');}
                });
                event.regist(eventName, {
                    index: 0, listener () {result.push('ib0');}, indexBefore: true
                });
                event.regist(eventName, {
                    index: 0, listener () {result.push('ibb0');}, indexBefore: true
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
    },
    {
        name: '测试all参数', // 可选
        plugin: 'asyncPlugin',
        async test (event) {
            event.clear();
            const eventName = 'test-all';
            return await promise((resolve) => {
                const result = [];
                event.emit(eventName);

                event.regist(eventName, () => {
                    result.push(1);
                });
                event.regist(eventName, {
                    all: true,
                    listener () { result.push(2);}
                });
                event.regist(eventName, {
                    all: false,
                    listener () {result.push(3);}
                });
                resolve(result);
            });
        },
        expect: [1, 2],
    },
    {
        name: '测试once参数',
        plugin: 'asyncPlugin',
        async test (event) {
            event.clear();
            const eventName = 'test-all';
            return await promise((resolve) => {
                const result = [];

                event.regist(eventName, () => {
                    result.push(1);
                });
                event.regist(eventName, {
                    once: true,
                    listener () { result.push(2);}
                });
                event.regist(eventName, {
                    once: false,
                    listener () {result.push(3);}
                });
                event.emit(eventName);
                event.emit(eventName);
                resolve(result);
            });
        },
        expect: [1, 2, 3, 1, 3],
    },
    {
        name: '测试index和indexBefore参数',
        plugin: 'asyncPlugin',
        async test (event) {
            event.clear();
            const eventName = 'test-index';
            return await promise((resolve) => {
                const result = [];
                event.regist(eventName, () => {
                    result.push(1); // 1
                });
                event.regist(eventName, () => {
                    result.push(2); // 1 2
                });
                event.regist(eventName, {
                    index: 0, // 0 1 2
                    listener () {result.push(3);}
                });
                event.regist(eventName, {
                    index: 1, // 0 1 *1 2
                    listener () {result.push(4);}
                });
                event.regist(eventName, {
                    index: 1, // 0 1 *1 **1 2
                    listener () {result.push(5);}
                });
                event.regist(eventName, {
                    index: 1, // 0 ***1 1 *1 **1 2
                    indexBefore: true,
                    listener () {result.push(6);}
                });
                event.regist(eventName, {
                    index: 10, // 0 ***1 1 *1 **1 2 10
                    listener () {result.push(7);}
                });
                event.regist(eventName, () => { // 0 ***1 1 *1 **1 2 3 10
                    result.push(8);
                });
                event.emit(eventName);
                resolve(result);
            });
        },
        expect: [3, 6, 1, 4, 5, 2, 8, 7],
    }
];

