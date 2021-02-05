
import {ILockerFn} from './type';

export function createLocker () {
    let list: Array<ILockerFn> = [];
    let locked = false;
    function exec () {
        if (list.length === 0) {return;}
        // 根据index倒序
        list.sort((a, b) => b.index - a.index);
        for (let i = 0; i < list.length; i++) {
            list[i].func();
        }
        list = [];
    }
    return {
        add ({index, func}: ILockerFn) {
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