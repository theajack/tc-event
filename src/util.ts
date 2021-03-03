
export function isUndf (v: any) {return typeof v === 'undefined';}
export function isObject (v: any) {return typeof v === 'object';}


export function findPos (array: any[], order: number, orderBefore: boolean) {
    const n = array.length;
    if (n === 0) {return 0;}
    const result = bsearch(array, 0, n - 1, order, orderBefore);
    return result;
}

export function bsearch (array: any[], low: number, high: number, order: number, orderBefore: boolean): number {
    const mid = Math.floor((low + high) / 2);
    if (low > high) return mid + 1;
    if (array[mid].order > order) {
        return bsearch(array, low, mid - 1, order, orderBefore);
    } else if (array[mid].order < order) {
        return bsearch(array, mid + 1, high, order, orderBefore);
    } else {
        if (orderBefore) {
            if (mid === 0 || array[mid - 1].order < order) {return mid;}
            return bsearch(array, low, mid - 1, order, orderBefore);
        } else {
            if (mid === array.length - 1 || array[mid + 1].order > order) {return mid + 1;}
            return bsearch(array, mid + 1, high, order, orderBefore);
        }
    }
}