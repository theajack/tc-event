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
        event.regist(eventName, (method, {firstEmit, remove, item}) => {
            result.push(firstEmit, item.id);
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
    expect: [
        // 第一次emit
        1,
        true, 2,
        // 第二次emit
        1,
        false, 2,
        // 第三次emit
        1,
        false, 2,
        // 第四次emit
        1
    ],
};

