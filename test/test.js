import EventBus, { eventBus } from "../dist/EventBus.js";

const handler = () => console.log("Hello!");

eventBus.on("test on/off", handler);

eventBus.emit("test on/off");
// Hello!

eventBus.off("test on/off", handler);

eventBus.emit("test on/off");
// ...

eventBus.once("test once", () => console.log("I only be triggered once!"));

eventBus.emit("test once");
// I only be triggered once!

eventBus.emit("test once");
// ...

eventBus.on("test pass arguments", (a, b) =>
  console.log(`I like ${a} and ${b}!`)
);

eventBus.emit("test pass arguments", "🐱", "🐶");
// I like 🐱 and 🐶!

eventBus.emit("test pass arguments", "🍦", "🍰");
// I like 🍦 and 🍰!

(async () => console.log(await eventBus.promise("test async/await")))();

eventBus.emit("test async/await", "Cool!");
// Cool!

eventBus.promise("test promise").then(console.log);

eventBus.emit("test promise", "Love!");
// Love!

class Cat extends EventBus {
  write(data) {
    this.emit("data", data);
  }
}

const cat = new Cat();

cat.on("data", console.log);

cat.write("I need catnip.");
// I need catnip.

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

eventBus.on("test offAll", () => console.error("Failed the test."));
eventBus.on("test offAll", () => console.error("Failed the test."));
eventBus.offAll("test offAll");
eventBus.emit("test offAll");

console.log(eventBus.subscribers.get("test offAll"));
// Set(0) {}

eventBus.on("test destroy A", () => console.error("Failed the test."));
eventBus.on("test destroy B", () => console.error("Failed the test."));
eventBus.destroy();
eventBus.emit("test destroy A");
eventBus.emit("test destroy B");

console.log(eventBus.subscribers);
// Map(0) {}
