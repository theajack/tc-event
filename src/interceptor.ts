import {IOnInterceptorRegist, IOnInterceptorEmit} from './type';


let _onRegist: IOnInterceptorRegist[] = [];

export function onRegist (fn: IOnInterceptorRegist) {
    _onRegist.push(fn);
}

export const triggerOnRegist: IOnInterceptorRegist = (option) => {
    _onRegist.forEach(fn => {fn(option);});
};

let _onEmit: IOnInterceptorEmit[] = [];

export function onEmit (fn: IOnInterceptorEmit) {
    _onEmit.push(fn);
}
export const triggerOnEmit: IOnInterceptorEmit = (option) => {
    _onEmit.forEach(fn => {fn(option);});
};

export function clearInterceptor () {
    _onRegist = [];
    _onEmit = [];
}