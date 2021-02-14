module.exports = {
    name: '测试registOption',
    test ({event}) {
        event.clear();
        const eventName = 'test-regist-option';
            
        const result = [];
        event.regist(eventName, (method, {clear}) => {
            result.push(1);
            if (method === 'clear') {
                clear();
            }
        });
        event.regist(eventName, (method, {firstEmit, remove}) => {
            result.push(firstEmit);
            if (method === 'remove') {
                remove();
            }
        });
        event.emit(eventName);
        event.emit(eventName);
        event.emit(eventName, 'remove');
        event.emit(eventName, 'clear');
        event.emit(eventName);
        event.emit(eventName);
        return result;
    },
    expect: [1, true, 1, false, 1, false, 1],
};

