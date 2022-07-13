const https = require('https');

function main () {
    https.get(`https://purge.jsdelivr.net/npm/tc-event/tc-event.min.js`, () => {
    });
}

main();

