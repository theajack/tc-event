
export function isUndf (v: any) {return typeof v === 'undefined';}
export function isObject (v: any) {return typeof v === 'object';}


export function findPos (array: any[], index: number, indexBefore: boolean) {
    const n = array.length;
    if (n === 0) {return 0;}
    return bsearch(array, 0, n - 1, index, indexBefore);
}

export function bsearch (array: any[], low: number, high: number, index: number, indexBefore: boolean): number {
    const mid = Math.floor((low + high) / 2);
    if (low > high) return mid + 1;
    if (array[mid].index > index) {
        return bsearch(array, low, mid - 1, index, indexBefore);
    } else if (array[mid].index < index) {
        return bsearch(array, mid + 1, high, index, indexBefore);
    } else {
        if (indexBefore) {
            if (mid === 0 || array[mid - 1].index < index) {return mid;}
            return bsearch(array, low, mid - 1, index, indexBefore);
        } else {
            if (mid === array.length - 1 || array[mid + 1].index > index) {return mid + 1;}
            return bsearch(array, mid + 1, high, index, indexBefore);
        }
    }
}