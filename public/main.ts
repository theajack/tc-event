// import event from '../npm';
import event from '../src';


function registEvent () {
    const e1 = event.regist('aa', () => {
        console.log('1');
    });
    event.regist('aa', () => {
        console.log('2');
    });
    event.regist('aa', {
        order: 0, listener () {
            console.log('i0');
            event.remove(e1);
        }, once: true
    });
    event.regist('aa', {
        order: 2, listener () {console.log('2a');}, immediate: true
    });
    event.regist('aa', {
        order: 2, listener () {console.log('2b');}, orderBefore: true
    });
    event.regist('aa', {
        listener () {console.log('3');}, once: true, immediate: true
    });
    event.regist('aa', {
        listener () {console.log('1000');}, order: 1000
    });
    event.regist('aa', {
        listener () {console.log('4');}
    });
    event.regist('aa', {
        order: 0, listener () {console.log('ib0');}, orderBefore: true
    });
    event.regist('aa', {
        order: 0, listener () {console.log('ibb0');}, orderBefore: true
    });
}

function t2 () {
    const eventName = 'test-clear';
    const result: number[] = [];
    event.regist(eventName, () => {
        result.push(1);
    });
    event.emit(eventName);
    event.clear(eventName);
    event.emit(eventName);
    event.regist(eventName, {
        immediate: false,
        listener: () => {
            result.push(2);
        }
    });
    event.emit(eventName);
    event.clear();
    event.emit(eventName);
    console.log(result);
}
 
declare global {
    interface Window  {
        registEvent: ()=>void;
        ev: any;
        t2: any;
    }
}
window.registEvent = registEvent;
window.ev = event;
window.t2 = t2;
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