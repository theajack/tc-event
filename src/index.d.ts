import {
    IEventEmitter, IEventJson, IEventStatic, TModuleName
} from './type';

export * from './type';

export const version: string;

export function createModule(name?: TModuleName): IEventEmitter;

export function getModule (): IEventJson<IEventEmitter>;
export function getModule (name: TModuleName): IEventEmitter;

export function clearModule(): void;

export function removeModule(name: TModuleName): void;

export const event: IEventStatic;

export const resgist: typeof event.regist;
export const emit: typeof event.emit;

export default event;
