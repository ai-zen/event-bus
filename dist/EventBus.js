export default class EventBus {
    subscribers = new Map();
    on(name, handler) {
        if (!this.subscribers.has(name)) {
            this.subscribers.set(name, new Set());
        }
        this.subscribers.get(name)?.add(handler);
    }
    off(name, handler) {
        return this.subscribers.get(name)?.delete(handler) ?? false;
    }
    offAll(name) {
        this.subscribers.get(name)?.clear();
    }
    destroy() {
        this.subscribers.clear();
    }
    emit(name, ...args) {
        this.subscribers.get(name)?.forEach((handler) => handler(...args));
    }
    gather(name, ...args) {
        const results = [];
        this.subscribers.get(name)?.forEach((handler) => {
            results.push(handler(...args));
        });
        return results;
    }
    gatherMap(name, ...args) {
        const results = new Map();
        this.subscribers.get(name)?.forEach((handler) => {
            results.set(handler, handler(...args));
        });
        return results;
    }
    once(name, handler) {
        const onceHandler = (...args) => {
            this.off(name, onceHandler);
            return handler(...args);
        };
        this.on(name, onceHandler);
    }
    promise(name) {
        return new Promise((resolve) => {
            this.once(name, resolve);
        });
    }
    get subscribe() {
        return this.on;
    }
    get unsubscribe() {
        return this.off;
    }
    get publish() {
        return this.emit;
    }
}
export const eventBus = new EventBus();
