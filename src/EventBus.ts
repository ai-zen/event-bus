export type EventHandler = (...args: any[]) => any;

export type Disposable = {
  dispose: () => void;
};

export default class EventBus {
  public subscribers: Map<string, Set<EventHandler>> = new Map();

  public on(name: string, handler: EventHandler): Disposable {
    if (!this.subscribers.has(name)) {
      this.subscribers.set(name, new Set());
    }

    this.subscribers.get(name)?.add(handler);

    return {
      dispose: () => {
        this.off(name, handler);
      },
    };
  }

  public off(name: string, handler: EventHandler): boolean {
    return this.subscribers.get(name)?.delete(handler) ?? false;
  }

  public offAll(name: string): void {
    this.subscribers.get(name)?.clear();
  }

  public destroy(): void {
    this.subscribers.clear();
  }

  public emit(name: string, ...args: any[]): void {
    this.subscribers.get(name)?.forEach((handler) => handler(...args));
  }

  public gather<T>(name: string, ...args: any[]): T[] {
    const results: T[] = [];

    this.subscribers.get(name)?.forEach((handler) => {
      results.push(handler(...args));
    });

    return results;
  }

  public gatherMap<T>(name: string, ...args: any[]): Map<EventHandler, T> {
    const results = new Map<EventHandler, T>();

    this.subscribers.get(name)?.forEach((handler) => {
      results.set(handler, handler(...args));
    });

    return results;
  }

  public once(name: string, handler: EventHandler): Disposable {
    const onceHandler = (...args: any[]) => {
      this.off(name, onceHandler);
      return handler(...args);
    };

    return this.on(name, onceHandler);
  }

  public promise(name: string): Promise<any> {
    return new Promise((resolve) => {
      this.once(name, resolve);
    });
  }

  get subscribe(): (name: string, handler: EventHandler) => void {
    return this.on;
  }

  get unsubscribe(): (name: string, handler: EventHandler) => boolean {
    return this.off;
  }

  get publish(): (name: string, ...args: any[]) => void {
    return this.emit;
  }
}

export const eventBus = new EventBus();
