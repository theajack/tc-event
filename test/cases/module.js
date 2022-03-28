/*
 * @Author: tackchen
 * @Date: 2022-03-28 09:45:36
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-28 10:04:16
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
            event.getModule('A').moduleName,
            event.getModule('B').moduleName,
        ];
    },
    expect: ['A', 'B'],
}];