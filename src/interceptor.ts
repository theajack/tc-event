import {IOnInterceptorRegist, IOnInterceptorEmit} from './type';


let _onRegist: IOnInterceptorRegist | undefined;

export function onRegist (fn: IOnInterceptorRegist) {
    _onRegist = fn;
}

export const triggerOnRegist: IOnInterceptorRegist = ({name, item}) => {
    if (_onRegist)_onRegist({name, item});
};

let _onEmit: IOnInterceptorEmit | undefined;

export function onEmit (fn: IOnInterceptorEmit) {
    _onEmit = fn;
}
export const triggerOnEmit: IOnInterceptorEmit = ({name, item, data, firstEmit}) => {
    if (_onEmit)_onEmit({name, item, data, firstEmit});
};

export function clearInterceptor () {
    _onRegist = undefined;
    _onEmit = undefined;
}