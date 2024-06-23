/**
 * Represents a function that handles events.
 */
export type EventHandler = (...args: any[]) => any;

/**
 * Represents a function that handles errors.
 */
export type ErrorHandler = (reason?: any) => void;

/**
 * Represents an object that can be disposed.
 */
export type Disposable = {
  /**
   * Disposes the object.
   */
  dispose: () => void;
};

/**
 * Represents an event bus that allows subscribing to and emitting events.
 */
export default class EventBus {
  /**
   * A map that stores the event subscribers.
   * The key is the event name and the value is another map.
   * The inner map stores the event handlers and their error handlers.
   */
  public subscribers: Map<string, Map<EventHandler, ErrorHandler>> = new Map();

  /**
   * Subscribes to an event.
   *
   * @param name - The name of the event to subscribe to.
   * @param handler - The event handler function.
   * @param error - The error handler function. Optional.
   * @returns A Disposable object that can be used to unsubscribe from the event.
   */
  public on(
    name: string,
    handler: EventHandler,
    error?: ErrorHandler
  ): Disposable {
    if (!this.subscribers.has(name)) {
      this.subscribers.set(name, new Map());
    }

    this.subscribers.get(name)?.set(handler, error);

    return {
      dispose: () => {
        this.off(name, handler);
      },
    };
  }

  /**
   * Unsubscribes from an event.
   *
   * @param name - The name of the event to unsubscribe from.
   * @param handler - The event handler function to unsubscribe.
   * @returns True if the unsubscribing was successful, otherwise false.
   */
  public off(name: string, handler: EventHandler): boolean {
    return this.subscribers.get(name)?.delete(handler) ?? false;
  }

  /**
   * Unsubscribes all event handlers from an event.
   *
   * @param name - The name of the event to unsubscribe all handlers from.
   */
  public offAll(name: string): void {
    this.subscribers.get(name)?.clear();
  }

  /**
   * Destroys the event bus by clearing all event subscribers.
   */
  public destroy(): void {
    this.subscribers.clear();
  }

  /**
   * Emits an event.
   *
   * @param name - The name of the event to emit.
   * @param args - The arguments to pass to the event handlers.
   */
  public emit(name: string, ...args: any[]): void {
    this.subscribers
      .get(name)
      ?.forEach((errorHandler, handler) => handler(...args));
  }

  /**
   * Emits an error event.
   *
   * @param name - The name of the error event to emit.
   * @param reason - The reason for the error.
   */
  public error(name: string, reason: any): void {
    this.subscribers.get(name)?.forEach((errorHandler) => errorHandler(reason));
  }

  /**
   * Gathers the results from all event handlers of the specified event.
   *
   * @param name - The name of the event to gather results from.
   * @param args - The arguments to pass to the event handlers.
   * @returns An array of results from all event handlers.
   */
  public gather<T>(name: string, ...args: any[]): T[] {
    const results: T[] = [];

    this.subscribers.get(name)?.forEach((errorHandler, handler) => {
      results.push(handler(...args));
    });

    return results;
  }

  /**
   * Gathers the results from all event handlers of the specified event with a map of the handlers.
   *
   * @param name - The name of the event to gather results from.
   * @param args - The arguments to pass to the event handlers.
   * @returns A map of event handlers and their corresponding results.
   */
  public gatherMap<T>(name: string, ...args: any[]): Map<EventHandler, T> {
    const results = new Map<EventHandler, T>();

    this.subscribers.get(name)?.forEach((errorHandler, handler) => {
      results.set(handler, handler(...args));
    });

    return results;
  }

  /**
   * Subscribes to an event and unsubscribes automatically after the event is emitted once.
   *
   * @param name - The name of the event to subscribe to.
   * @param handler - The event handler function.
   * @param error - The error handler function. Optional.
   * @returns A Disposable object that can be used to unsubscribe from the event.
   */
  public once(
    name: string,
    handler: EventHandler,
    error?: ErrorHandler
  ): Disposable {
    const onceHandler = (...args: any[]) => {
      this.off(name, onceHandler);
      return handler(...args);
    };

    return this.on(name, onceHandler, error);
  }

  /**
   * Returns a promise that resolves when the specified event is emitted.
   *
   * @param name - The name of the event to create a promise for.
   * @returns A promise that resolves when the event is emitted.
   */
  public promise(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.once(name, resolve, reject);
    });
  }

  /**
   * Alias for the `on` method.
   */
  get subscribe() {
    return this.on;
  }

  /**
   * Alias for the `off` method.
   */
  get unsubscribe() {
    return this.off;
  }

  /**
   * Alias for the `emit` method.
   */
  get publish() {
    return this.emit;
  }
}

/**
 * The global event bus instance.
 */
export const eventBus = new EventBus();
