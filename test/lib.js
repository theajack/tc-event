
function delay (time = 50) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

function registInterceptor ({event, eventName, done}) {
    let total = 0;
    let index = 0;
    event.onRegist((option) => {
        if (option.eventName === eventName) {
            total ++;
        }
    });
    event.onEmit((option) => {
        if (option.eventName === eventName) {
            index ++;
            if (index === total) {
                done();
            }
        }
    });
}

module.exports = {
    delay, registInterceptor
};