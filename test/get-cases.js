const fs = require('fs');
const path = require('path');

function getAllCases () {
    const result = traverseBase(path.resolve('./', 'test/cases'));
    const cases = [];
    result.forEach(path => {
        const item = require(path);
        if (item instanceof Array) {
            cases.push(...item);
        } else {
            cases.push(item);
        }
    });
    return cases;
}

function traverseBase (filePath) {
    const filePaths = [];
    const files = fs.readdirSync(filePath);
    for (let i = 0; i < files.length; i++) {
        const name = files[i];
        const filePathName = `${filePath}/${files[i]}`;
        const data = fs.statSync(path.join(filePath, name));
        
        if (data.isFile()) {
            filePaths.push(filePathName);
        } else {
            filePaths.push(...traverseBase(filePathName));
        }
    }
    return filePaths;
}

module.exports = getAllCases;