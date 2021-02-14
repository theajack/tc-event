module.exports = {
    name: '测试链式调用',
    test ({event}) {
        event.clear();
        const eventName = 'test-link';
        const result = [];
        event.regist(eventName).listen(() => {
            result.push(1);
        });
        event.regist(eventName).listener(() => {
            result.push(2);
        }).listen();
        event.emit(eventName);
        event.clear(eventName);

        event.regist(eventName)
            .once()
            .listen(() => {
                result.push(3);
            });
        event.emit(eventName);
        event.emit(eventName);
        event.emit(eventName);
        event.clear(eventName);
        
        event.emit(eventName);
        event.regist(eventName)
            .once()
            .notImmediate()
            .listen(() => {
                result.push(4);
            });
        event.emit(eventName);
        event.clear(eventName);

        event.regist(eventName)
            .single()
            .listen(() => {
                result.push(5);
            });
        event.regist(eventName)
            .single()
            .listen(() => {
                result.push(6);
            });
        event.emit(eventName);

        return result;
    },
    expect: [1, 2, 3, 4, 6],
};