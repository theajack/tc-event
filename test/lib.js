
function promise (fn) {
    return new Promise(res => {
        fn(res);
    });
}

function delay (time = 50) {
    return promise((resolve) => {
        setTimeout(resolve, time);
    });
}

function registInterceptor ({event, eventName, done}) {
    let total = 0;
    let index = 0;
    event.onRegist((name) => {
        if (name === eventName) {
            total ++;
        }
    });
    event.onEmit((name) => {
        if (name === eventName) {
            index ++;
            if (index === total) {
                done();
            }
        }
    });
}

module.exports = {
    delay, registInterceptor, promise
};