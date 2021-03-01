# Event Bus

A simple JavaScript library for managing events.

## Table of Contents

- [Advantage](#advantage)
- [Install](#install)
- [Usage](#usage)
- [Basic functions](#basic-functions)
- [Contribute](#contribute)
- [License](#license)

## Advantage

```typescript
public subscribers: Map<string, Set<EventHandler>> = new Map();
```

The `EventBus` uses [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) to store `EventHandler`. has better performance and more concise code to implement core functions than using `Object` and `Array`.

> The disadvantage is that it only native support `ES6` or above, and no longer has performance advantage after compiling to `ES5`.

## Install

```
npm i @ai-zen/event-bus -S
```

## Usage

```javascript
import EventBus from "@ai-zen/event-bus";

const eventBus = new EventBus();
```

Or use global instance

```javascript
import { eventBus } from "@ai-zen/event-bus";
```

## Basic functions

`on()` and `off()`:

```javascript
const handler = () => console.log("Hello!");

eventBus.on("test on/off", handler);

eventBus.emit("test on/off");
// Hello!

eventBus.off("test on/off", handler);

eventBus.emit("test on/off");
// ...
```

`once()`:

```javascript
eventBus.once("test once", () => console.log("I only be triggered once!"));

eventBus.emit("test once");
// I only be triggered once!

eventBus.emit("test once");
// ...
```

Pass arguments:

```javascript
eventBus.on("test pass arguments", (a, b) =>
  console.log(`I like ${a} and ${b}!`)
);

eventBus.emit("test pass arguments", "🐱", "🐶");
// I like 🐱 and 🐶!

eventBus.emit("test pass arguments", "🍦", "🍰");
// I like 🍦 and 🍰!
```

Support Async/Await:

```javascript
(async () => console.log(await eventBus.promise("test async/await")))();

eventBus.emit("test async/await", "Cool!");
// Cool!
```

Support Promise:

```javascript
eventBus.promise("test promise").then(console.log);

eventBus.emit("test promise", "Love!");
// Love!
```

Extends:

```javascript
class Cat extends EventBus {
  write(data) {
    this.emit("data", data);
  }
}

const cat = new Cat();

cat.on("data", console.log);

cat.write("I need catnip.");
// I need catnip.
```

`gather()`, Gather event feedback:

```javascript
eventBus.on("What's your favorite drink?", () => ["Jack", "coffee"]);
eventBus.on("What's your favorite drink?", () => ["Lucy", "tea"]);
eventBus.on("What's your favorite drink?", () => ["John", "milk"]);
eventBus.on("What's your favorite drink?", () => ["Tom", "milk"]);

eventBus
  .gather("What's your favorite drink?")
  .forEach(([name, like]) => console.log(`${name} likes ${like}.`));

// Jack likes coffee.
// Lucy likes tea.
// John likes milk.
// Tom likes milk.
```

`offAll()`, Remove all handlers of the event:

```javascript
eventBus.on("test offAll", () => console.error("Failed the test."));
eventBus.on("test offAll", () => console.error("Failed the test."));

eventBus.offAll("test offAll");

eventBus.emit("test offAll");
// ...

console.log(eventBus.subscribers.get("test offAll"));
// Set(0) {}
```

`destroy()`, Remove all handlers of the eventBus：

```javascript
eventBus.on("test destroy A", () => console.error("Failed the test."));
eventBus.on("test destroy B", () => console.error("Failed the test."));

eventBus.destroy();

eventBus.emit("test destroy A");
// ...

eventBus.emit("test destroy B");
// ...

console.log(eventBus.subscribers);
// Map(0) {}
```

## Contribute

1. Fork the repository
2. Create Feat_xxx branch
3. Commit your code
4. Create Pull Request

## License

[MIT](LICENSE) © AI-ZEN
