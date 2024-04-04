# EventBus

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

EventBus is a simple event management library for TypeScript.

## Installation

```bash
npm install @ai-zen/event-bus
```

## Usage

```javascript
import EventBus from "@ai-zen/event-bus";

// Create a new instance of EventBus
const eventBus = new EventBus();

// Subscribe to an event
eventBus.on("eventName", (arg1, arg2) => {
  // Handle the event
});

// Unsubscribe from an event
eventBus.off("eventName", handler);

// Unsubscribe from all handlers of an event
eventBus.offAll("eventName");

// Destroy the event bus and remove all event subscriptions
eventBus.destroy();

// Emit an event
eventBus.emit("eventName", arg1, arg2);

// Gather the results returned by all handlers of an event
const results = eventBus.gather < T > ("eventName", arg1, arg2);

// Gather the results returned by all handlers of an event as a map
const resultsMap = eventBus.gatherMap < T > ("eventName", arg1, arg2);

// Subscribe to an event and automatically unsubscribe after the first invocation
eventBus.once("eventName", (arg1, arg2) => {
  // Handle the event
});

// Subscribe to an event and return a promise that resolves when the event is emitted
const resultPromise = eventBus.promise("eventName");
```

## API

### `on(name: string, handler: EventHandler): Disposable`

Subscribe to an event.

- `name` (required): The name of the event to subscribe to.
- `handler` (required): The event handler function.
- Returns: A Disposable object with a `dispose` method that can be used to unsubscribe from the event.

#### Example

```javascript
const disposable = eventBus.on("eventName", (arg1, arg2) => {
  // Handle the event
});

// Unsubscribe from the event
disposable.dispose();
```

### `off(name: string, handler: EventHandler): boolean`

Unsubscribe from an event.

- `name` (required): The name of the event to unsubscribe from.
- `handler` (required): The event handler function.
- Returns: `true` if the handler was successfully removed, `false` otherwise.

### `offAll(name: string): void`

Unsubscribe from all handlers of an event.

- `name` (required): The name of the event to unsubscribe from.

### `destroy(): void`

Destroy the event bus and remove all event subscriptions.

### `emit(name: string, ...args: any[]): void`

Emit an event.

- `name` (required): The name of the event to emit.
- `args` (optional): Arguments to pass to the event handlers.

### `gather<T>(name: string, ...args: any[]): T[]`

Gather the results returned by all handlers of an event.

- `name` (required): The name of the event to gather results from.
- `args` (optional): Arguments to pass to the event handlers.
- Returns: An array containing the results returned by the event handlers.

### `gatherMap<T>(name: string, ...args: any[]): Map<EventHandler, T>`

Gather the results returned by all handlers of an event as a map.

- `name` (required): The name of the event to gather results from.
- `args` (optional): Arguments to pass to the event handlers.
- Returns: A map containing the event handler functions as keys and the results returned by the event handlers as values.

### `once(name: string, handler: EventHandler): Disposable`

Subscribe to an event and automatically unsubscribe after the first invocation.

- `name` (required): The name of the event to subscribe to.
- `handler` (required): The event handler function.
- Returns: A Disposable object with a `dispose` method that can be used to unsubscribe from the event.

#### Example

```javascript
const disposable = eventBus.once("eventName", (arg1, arg2) => {
  // Handle the event
});

// The handler will be automatically unsubscribed after the first invocation
```

### `promise(name: string): Promise<any>`

Subscribe to an event and return a promise that resolves when the event is emitted.

- `name` (required): The name of the event to subscribe to.
- Returns: A promise that resolves with the result of the event handler when the event is emitted.

#### Example

```javascript
const resultPromise = eventBus.promise("eventName");

resultPromise.then((result) => {
  // Handle the result
});
```

### `subscribe(name: string, handler: EventHandler): void`

Alias for `on(name, handler)`.

### `unsubscribe(name: string, handler: EventHandler): boolean`

Alias for `off(name, handler)`.

### `publish(name: string, ...args: any[]): void`

Alias for `emit(name, ...args)`.

## License

[MIT](LICENSE)
