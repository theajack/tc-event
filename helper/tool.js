const fs = require('fs');
const childProcess = require('child_process');
const path = require('path');


function read (file, cb) {
    fs.readFile(file, 'utf8', (err, code) => {
        if (err) throw err;
        cb(code);
    });
}

function write (file, txt, cb) {
    fs.writeFile(file, txt, 'utf8', (err) => {
        if (err) throw err;
        if (cb)cb();
    });
}

function pick ({data = {}, target, attrs}) {
    if (!attrs) {
        attrs = Object.keys(target);
    }
    attrs.forEach(name => {
        if (typeof target[name] !== 'undefined')
            data[name] = target[name];
    });
    return data;
}
async function exec (cmd) {
    return new Promise(resolve => {
        childProcess.exec(cmd, function (error, stdout, stderr) {
            if (error) {
                resolve({success: false, stdout, stderr});
            } else {
                resolve({
                    success: true,
                    stdout,
                    stderr
                });
            }
        });
    });
}

function writeJsonFile (filePath, json) {
    fs.writeFileSync(resolvePath(filePath), JSON.stringify(json, null, 4), {encoding: 'utf-8'});
}

function writeFile (filePath, content) {
    fs.writeFileSync(resolvePath(filePath), content, {encoding: 'utf-8'});
}

function readFile (filePath) {
    return fs.readFileSync(resolvePath(filePath), {encoding: 'utf-8'});
}

function mkdirDir (filePath) {
    filePath = resolvePath(filePath);
    if (!fs.existsSync(filePath)) {
        console.log('mkdirSync', filePath);
        fs.mkdirSync(filePath);
    }
}

function replaceFileContent (filePath, regExp, replacement) {
    const content = readFile(filePath);
    const newContent = content.replace(regExp, replacement);
    writeFile(filePath, newContent);
    
}

function resolvePath (filePath) {
    if (filePath[0] === '@' || filePath[0] === '/') {
        filePath = '../' + filePath.substring(1);
    }
    return path.resolve(__dirname, filePath);
}

function clearDirectory (dirPath) {
    dirPath = resolvePath(dirPath);
    if (!fs.existsSync(dirPath)) return;
    clearDirectoryBase(dirPath);
}

function clearDirectoryBase (dirPath) {
    const files = fs.readdirSync(dirPath);
    files.forEach((file) => {
        const filePath = `${dirPath}/${file}`;
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            clearDirectoryBase(filePath);
            fs.rmdirSync(filePath);
        } else {
            fs.unlinkSync(filePath);
        }
    });
};

function buildPackageJson (extract = {}) {
    const pkg = require('../package.json');

    const attrs = ['name', 'version', 'description', 'main', 'unpkg', 'jsdelivr', 'typings', 'repository', 'keywords', 'author', 'license', 'bugs', 'homepage', 'dependencies'];

    const npmPkg = {};

    attrs.forEach(key => {
        npmPkg[key] = pkg[key] || '';
    });

    for (const key in extract) {
        npmPkg[key] = extract[key];
    }

    mkdirDir('@npm');

    writeJsonFile('@npm/package.json', npmPkg);
}

module.exports = {
    read,
    write,
    pick,
    exec,
    replaceFileContent,
    resolvePath,
    writeJsonFile,
    writeFile,
    readFile,
    mkdirDir,
    clearDirectory,
    buildPackageJson,
};