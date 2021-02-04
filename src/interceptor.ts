import {IOnInterceptor} from './type';


let _onRegist: IOnInterceptor | undefined;

export function onRegist (fn: IOnInterceptor) {
    _onRegist = fn;
}

export const triggerOnRegist: IOnInterceptor = (name, data) => {
    if (_onRegist)_onRegist(name, data);
};

let _onEmit: IOnInterceptor | undefined;

export function onEmit (fn: IOnInterceptor) {
    _onEmit = fn;
}
export const triggerOnEmit: IOnInterceptor = (name, item) => {
    if (_onEmit)_onEmit(name, item);
};

export function clearInterceptor () {
    _onRegist = undefined;
    _onEmit = undefined;
}