/*
 * @Author: tackchen
 * @Date: 2022-03-28 09:45:36
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-13 23:12:14
 * @FilePath: /tc-event/test/cases/module.js
 * @Description: Coding something
 */

module.exports = [{
    name: '测试module',
    test ({event}) {
        event.clear();
        const result = [];
        const name = 'module_event';
        const moduleA = event.createModule('A');
        const moduleB = event.createModule('B');

        moduleA.regist(name, data => {result.push('A' + data);});
        moduleB.regist(name, data => {result.push('B' + data);});

        moduleA.emit(name, 1);
        moduleB.emit(name, 2);

        return result;
    },
    expect: ['A1', 'B2']
}, {
    name: '测试getModule',
    test ({event}) {
        event.clear();
        event.clearModule();
        
        event.createModule('A');
        event.createModule('B');

        return [
            event.getModule('A').name,
            event.getModule('B').name,
        ];
    },
    expect: ['A', 'B'],
}];