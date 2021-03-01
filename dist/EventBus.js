export default class EventBus {
    constructor() {
        this.subscribers = new Map();
    }
    on(name, handler) {
        var _a;
        if (!this.subscribers.has(name)) {
            this.subscribers.set(name, new Set());
        }
        (_a = this.subscribers.get(name)) === null || _a === void 0 ? void 0 : _a.add(handler);
    }
    off(name, handler) {
        var _a, _b;
        return (_b = (_a = this.subscribers.get(name)) === null || _a === void 0 ? void 0 : _a.delete(handler)) !== null && _b !== void 0 ? _b : false;
    }
    offAll(name) {
        var _a;
        (_a = this.subscribers.get(name)) === null || _a === void 0 ? void 0 : _a.clear();
    }
    destroy() {
        this.subscribers.clear();
    }
    emit(name, ...args) {
        var _a;
        (_a = this.subscribers.get(name)) === null || _a === void 0 ? void 0 : _a.forEach((handler) => handler(...args));
    }
    gather(name, ...args) {
        var _a;
        const results = [];
        (_a = this.subscribers.get(name)) === null || _a === void 0 ? void 0 : _a.forEach((handler) => {
            results.push(handler(...args));
        });
        return results;
    }
    gatherMap(name, ...args) {
        var _a;
        const results = new Map();
        (_a = this.subscribers.get(name)) === null || _a === void 0 ? void 0 : _a.forEach((handler) => {
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
