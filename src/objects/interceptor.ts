import {IOnInterceptorRegist, IOnInterceptorEmit} from '../type';


export class EventInterceptor {
    private _onRegist: IOnInterceptorRegist[] = [];
    private _onEmit: IOnInterceptorEmit[] = [];

    onRegist (fn: IOnInterceptorRegist) {
        this._onRegist.push(fn);
    }
    triggerOnRegist: IOnInterceptorRegist = (option) => {
        if (this !== GlobalEventInterceptor) {
            GlobalEventInterceptor.triggerOnRegist(option);
        }
        this._onRegist.forEach(fn => {fn(option);});
    }
    onEmit (fn: IOnInterceptorEmit) {
        this._onEmit.push(fn);
    }
    triggerOnEmit: IOnInterceptorEmit = (option) => {
        if (this !== GlobalEventInterceptor) {
            GlobalEventInterceptor.triggerOnEmit(option);
        }
        this._onEmit.forEach(fn => {fn(option);});
    }
    clearInterceptor () {
        this._onRegist = [];
        this._onEmit = [];
    }
}

export const GlobalEventInterceptor = new EventInterceptor();