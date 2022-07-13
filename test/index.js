const event = require('../npm/tc-event.min');
const {startTest} = require('easy-test-lib');
const fs = require('fs');
const path = require('path');
const getAllCases = require('./get-cases');
const lib = require('./lib');

startTest({
    args: {event, lib},
    cases: getAllCases(),
    onTestComplete (result) { // 测试全部完成回调 可选
        let txtContent = '';
        const log = (text = '') => {
            console.log(text);
            txtContent += text + '\n';
        };
        log();
        log(`测试结果: ${result.passed ? '' : '不'}通过`);
        
        log(`测试用例数: ${result.results.length}`);
        log(`总耗时: ${result.time}ms`);
        log('----------------------------');
        log(`测试用例详细数据:`);
        log('----------------------------');
        result.results.forEach(item => {
            log(`【${item.name}】: ${item.passed ? '' : '不'}通过 / ${item.time}ms`);
            log(`输出结果: ${JSON.stringify(item.result)}`);
            if (!item.passed) {
                log(`期望结果: ${JSON.stringify(item.expect)}`);
                throw new Error('Test Failed!');
            }
            log();
        });

        
        console.log(`测试结果: ${result.passed ? '' : '不'}通过`);
        console.log(`测试用例数: ${result.results.length}`);
        console.log(`总耗时: ${result.time}ms`);
        log();
        
        
        fs.writeFileSync(path.resolve('./', 'test/test-report.json'), JSON.stringify(result, null, 4), 'utf8');
        fs.writeFileSync(path.resolve('./', 'test/test-report.txt'), txtContent, 'utf8');
    }
});


