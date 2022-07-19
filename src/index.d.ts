/*
 * @Author: tackchen
 * @Date: 2022-07-19 11:11:31
 * @Description: Coding something
 */
import {
    EventEmitter as EE,
    IEventEmitter, IEventJson, IEventStatic, TModuleName
} from './type';

export * from './type';

export const version: string;

export function createModule(name: TModuleName): IEventEmitter;

export function getModule (): IEventJson<IEventEmitter>;
export function getModule (name: TModuleName): IEventEmitter;

export function clearModule(): void;

export function removeModule(name: TModuleName): void;

declare const event: IEventStatic;

export const EventEmitter: typeof EE;

export default event;
