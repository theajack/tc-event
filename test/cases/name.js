module.exports = {
    name: '测试name',
    test ({event}) {
        event.clear();
        const eventName = 'test-name';
            
        const item1 = event.regist(eventName, () => {
        });
        const item2 = event.regist(eventName, {
            name: 'listener-name',
            listener () {}
        });

        return [item1.name, item2.name];
    },
    expect: ['test-name-1', 'listener-name'],
};

