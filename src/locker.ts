
import {IToDo} from './type';

export function createLocker () {
    let list: Array<IToDo> = [];
    let locked = false;
    function exec () {
        if (list.length === 0) {return;}
        // 根据index倒序
        list.sort((a, b) => b.index - a.index);
        for (let i = list.length - 1; i >= 0; i--) {
            list[i].func();
        }
        list = [];
    }
    return {
        add ({index, func}: IToDo) {
            locked ? list.push({index, func}) : func();
        },
        lock (fn: ()=>any) {
            locked = true;
            const ret = fn();
            exec();
            locked = false;
            return ret;
        }
    };
}