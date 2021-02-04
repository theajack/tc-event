import event from '../npm';

declare global {
    interface Window  {
        registEvent: ()=>void;
        ev: any;
    }
}

function registEvent () {
    const e1 = event.regist('aa', () => {
        console.log('1');
    });
    event.regist('aa', () => {
        console.log('2');
    });
    event.regist('aa', {
        index: 0, listener () {
            console.log('i0');
            event.remove(e1);
        }, once: true
    });
    event.regist('aa', {
        index: 2, listener () {console.log('2a');}, all: true
    });
    event.regist('aa', {
        index: 2, listener () {console.log('2b');}, indexBefore: true
    });
    event.regist('aa', {
        listener () {console.log('3');}, once: true, all: true
    });
    event.regist('aa', {
        listener () {console.log('1000');}, index: 1000
    });
    event.regist('aa', {
        listener () {console.log('4');}
    });
    event.regist('aa', {
        index: 0, listener () {console.log('ib0');}, indexBefore: true
    });
    event.regist('aa', {
        index: 0, listener () {console.log('ibb0');}, indexBefore: true
    });
}

window.registEvent = registEvent;
window.ev = event;
//     event.emit('aa');
//     // ibb0
//     // ib0
//     // i0
//     // 1
//     // 2b
//     // 2
//     // 2a
//     // 3
//     // 4
//     // 1000
// }
// window.test = test;
// window.event = event;
// window.events = events;