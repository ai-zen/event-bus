export declare type EventHandler = (...args: any[]) => any;
export default class EventBus {
    subscribers: Map<string, Set<EventHandler>>;
    on(name: string, handler: EventHandler): void;
    off(name: string, handler: EventHandler): boolean;
    offAll(name: string): void;
    destroy(): void;
    emit(name: string, ...args: any[]): void;
    gather<T>(name: string, ...args: any[]): T[];
    gatherMap<T>(name: string, ...args: any[]): Map<EventHandler, T>;
    once(name: string, handler: EventHandler): void;
    promise(name: string): Promise<any>;
    get subscribe(): (name: string, handler: EventHandler) => void;
    get unsubscribe(): (name: string, handler: EventHandler) => boolean;
    get publish(): (name: string, ...args: any[]) => void;
}
export declare const eventBus: EventBus;
