/*
 * @Author: tackchen
 * @Date: 2022-07-19 19:25:36
 * @Description: Coding something
 */

module.exports = {
    name: '测试event emitter',
    test ({event, EventEmitter}) {
        event.clear();
        const ee = new EventEmitter();
        const eventName = 'test-checkEvent';
        const result = [];
        ee.regist(eventName, () => {
            result.push('ee');
        });

        event.regist(eventName, () => {
            result.push('event');
        });

        ee.emit(eventName);
        event.emit(eventName);

        return result;
    },
    expect: ['ee', 'event'],
};