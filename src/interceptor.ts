import {IOnInterceptorRegist, IOnInterceptorEmit} from './type';


let _onRegist: IOnInterceptorRegist | undefined;

export function onRegist (fn: IOnInterceptorRegist) {
    _onRegist = fn;
}

export const triggerOnRegist: IOnInterceptorRegist = (option) => {
    if (_onRegist)_onRegist(option);
};

let _onEmit: IOnInterceptorEmit | undefined;

export function onEmit (fn: IOnInterceptorEmit) {
    _onEmit = fn;
}
export const triggerOnEmit: IOnInterceptorEmit = (option) => {
    if (_onEmit)_onEmit(option);
};

export function clearInterceptor () {
    _onRegist = undefined;
    _onEmit = undefined;
}