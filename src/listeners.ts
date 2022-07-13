import {IListenerItem} from './type';
import {findPos} from './util';

export function countInsertIndex ({
    listeners,
    eventOrder,
    index, order, orderBefore = false, head, tail
}: {
    listeners: Array<IListenerItem | undefined>,
    eventOrder: number,
    index?: number; order?: number; orderBefore: boolean; head: boolean, tail: boolean
}) {
    let insertIndex: number;
    const n = listeners.length;
    let needAddOrder = false;
    // 优先级 head > tail > index > order
    if (head) {
        index = 0;
    } else if (tail) {
        index = n;
    }
    
    if (typeof index === 'number') {
        if (index > n) {index = n;}
        else if (index < 0) {index = 0;}
        // index 插入的order等于插入位置的order
        const item = listeners[index === n ? index - 1 : index];
        if (item) {
            order = item.order;
        } else {
            order = eventOrder + 1;
            needAddOrder = true;
        }
        insertIndex = index;
    } else {
        if (typeof order !== 'number') {
            // 默认插入的监听 按照事件的order排序
            order = eventOrder + 1;
            needAddOrder = true;
        }
        insertIndex = (n === 0 || order > findLastOrder(listeners)) ?
            n :
            findPos(listeners, order, orderBefore);
    }
    return {insertIndex, order, needAddOrder};
}

function findLastOrder (listeners: Array<IListenerItem | undefined>) {
    for (let i = listeners.length - 1; i >= 0; i--) {
        if (listeners[i]) {
            return (listeners[i] as IListenerItem).order;
        }
    }
    return 0;
}