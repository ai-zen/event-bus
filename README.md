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

### `on(name: string, handler: EventHandler, error?: ErrorHandler): Disposable`

Subscribes to an event.

- `name` (required): The name of the event to subscribe to.
- `handler` (required): The event handler function.
- `error` (optional): The error handler function.
- Returns: A Disposable object that can be used to unsubscribe from the event.

#### Example

```javascript
const disposable = eventBus.on("eventName", (arg1, arg2) => {
  // Handle the event
});

// Unsubscribe from the event
disposable.dispose();
```

### `off(name: string, handler: EventHandler): boolean`

Unsubscribes from an event.

- `name` (required): The name of the event to unsubscribe from.
- `handler` (required): The event handler function.
- Returns: True if the unsubscribing was successful, otherwise false.

### `offAll(name: string): void`

Unsubscribes all event handlers from an event.

- `name` (required): The name of the event to unsubscribe all handlers from.

### `destroy(): void`

Destroys the event bus by clearing all event subscribers.

### `emit(name: string, ...args: any[]): void`

Emits an event.

- `name` (required): The name of the event to emit.
- `args` (optional): The arguments to pass to the event handlers.

### `error(name: string, reason: any): void`

This method is used to send an error event through the event bus.

- `name` (required): The name of the error event to be sent.
- `reason` (required): The reason for the error.

#### Example

```javascript
try {
  // Do something that might throw an error
  const data = await getData();
  eventBus.emit("fooEvent", data);
} catch (error) {
  eventBus.error("fooEvent", error); // Send an error event
}
```

```javascript
// Use the error handler function for eventBus.on
eventBus.on(
  "fooEvent",
  (data) => {
    // Handle the data
  },
  (error) => {
    // Handle the error
  }
);

// You can also use a promise catch to handle the error
eventBus.promise("fooEvent").catch((error) => {
  // Handle the error
});
```

### `gather<T>(name: string, ...args: any[]): T[]`

Gathers the results from all event handlers of the specified event.

- `name` (required): The name of the event to gather results from.
- `args` (optional): The arguments to pass to the event handlers.
- Returns: An array of results from all event handlers.

### `gatherMap<T>(name: string, ...args: any[]): Map<EventHandler, T>`

Gathers the results from all event handlers of the specified event with a map of the handlers.

- `name` (required): The name of the event to gather results from.
- `args` (optional): The arguments to pass to the event handlers.
- Returns: A map of event handlers and their corresponding results.

### `once(name: string, handler: EventHandler, error?: ErrorHandler): Disposable`

Subscribes to an event and unsubscribes automatically after the event is emitted once.

- `name` (required): The name of the event to subscribe to.
- `handler` (required): The event handler function.
- `error` (optional): The error handler function.
- Returns: A Disposable object that can be used to unsubscribe from the event.

#### Example

```javascript
const disposable = eventBus.once("eventName", (arg1, arg2) => {
  // Handle the event
});

// The handler will be automatically unsubscribed after the first invocation
```

### `promise(name: string): Promise<any>`

Returns a promise that resolves when the specified event is emitted.

- `name` (required): The name of the event to create a promise for.
- Returns: A promise that resolves when the event is emitted.

#### Example

```javascript
const resultPromise = eventBus.promise("eventName");

resultPromise.then((result) => {
  // Handle the result
});
```

### `subscribe(name: string, handler: EventHandler): void`

Alias for the `on` method.

### `unsubscribe(name: string, handler: EventHandler): boolean`

Alias for the `off` method.

### `publish(name: string, ...args: any[]): void`

Alias for the `emit` method.

## License

[MIT](LICENSE)
