import { jest } from "@jest/globals";
import { eventBus } from "./EventBus.js";

describe("EventBus", () => {
  let handler1: jest.Mock;
  let handler2: jest.Mock;
  let handler3: jest.Mock;

  beforeEach(() => {
    handler1 = jest.fn();
    handler2 = jest.fn();
    handler3 = jest.fn();
  });

  afterEach(() => {
    eventBus.destroy();
  });

  test("subscribing to an event", () => {
    eventBus.on("eventName", handler1);
    eventBus.on("eventName", handler2);
    eventBus.emit("eventName", "arg1", "arg2");

    expect(handler1).toHaveBeenCalledWith("arg1", "arg2");
    expect(handler2).toHaveBeenCalledWith("arg1", "arg2");
    expect(handler3).not.toHaveBeenCalled();
  });

  test("unsubscribing from an event", () => {
    eventBus.on("eventName", handler1);
    eventBus.on("eventName", handler2);
    eventBus.off("eventName", handler1);
    eventBus.emit("eventName", "arg1", "arg2");

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalledWith("arg1", "arg2");
    expect(handler3).not.toHaveBeenCalled();
  });

  test("unsubscribing all handlers of an event", () => {
    eventBus.on("eventName", handler1);
    eventBus.on("eventName", handler2);
    eventBus.on("eventName", handler3);
    eventBus.offAll("eventName");
    eventBus.emit("eventName", "arg1", "arg2");

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();
    expect(handler3).not.toHaveBeenCalled();
  });

  test("destroying the event bus", () => {
    eventBus.on("eventName", handler1);
    eventBus.on("eventName", handler2);
    eventBus.on("eventName", handler3);
    eventBus.destroy();
    eventBus.emit("eventName", "arg1", "arg2");

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();
    expect(handler3).not.toHaveBeenCalled();
  });

  test("gathering results of handlers of an event", () => {
    handler1.mockReturnValue("result1");
    handler2.mockReturnValue("result2");
    handler3.mockReturnValue("result3");

    eventBus.on("eventName", handler1);
    eventBus.on("eventName", handler2);
    eventBus.on("eventName", handler3);

    const results = eventBus.gather<string>("eventName", "arg1", "arg2");

    expect(results).toEqual(["result1", "result2", "result3"]);
  });

  test("gathering results of handlers of an event as a map", () => {
    handler1.mockReturnValue("result1");
    handler2.mockReturnValue("result2");
    handler3.mockReturnValue("result3");

    eventBus.on("eventName", handler1);
    eventBus.on("eventName", handler2);
    eventBus.on("eventName", handler3);

    const resultsMap = eventBus.gatherMap<string>("eventName", "arg1", "arg2");

    expect(resultsMap).toEqual(
      new Map([
        [handler1, "result1"],
        [handler2, "result2"],
        [handler3, "result3"],
      ])
    );
  });

  test("subscribing to an event and automatically unsubscribing after the first invocation", () => {
    eventBus.once("eventName", handler1);
    eventBus.emit("eventName", "arg1", "arg2");
    eventBus.emit("eventName", "arg3", "arg4");

    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler1).toHaveBeenCalledWith("arg1", "arg2");
  });

  test("subscribing to an event and returning a promise that resolves when the event is emitted", async () => {
    setTimeout(() => {
      eventBus.emit("eventName", "arg1");
    }, 1000);

    const result = await eventBus.promise("eventName");
    expect(result).toEqual("arg1");
  });

  test("subscribing to an event and unsubscribing using disposable", () => {
    const disposable = eventBus.on("eventName", handler1);
    eventBus.emit("eventName", "arg1", "arg2");

    expect(handler1).toHaveBeenCalledWith("arg1", "arg2");

    disposable.dispose(); // Unsubscribe using disposable

    eventBus.emit("eventName", "arg3", "arg4");

    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler1).toHaveBeenCalledWith("arg1", "arg2");
  });

  test("subscribing to an event and automatically unsubscribing after the first invocation using disposable", () => {
    const disposable = eventBus.once("eventName", handler1);
    eventBus.emit("eventName", "arg1", "arg2");
    eventBus.emit("eventName", "arg3", "arg4");

    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler1).toHaveBeenCalledWith("arg1", "arg2");

    disposable.dispose(); // Automatically unsubscribed after the first invocation
  });

  test("handling errors emitted by eventBus.error()", () => {
    const errorHandler1 = jest.fn();
    const errorHandler2 = jest.fn();

    class MyError extends Error {}

    eventBus.on("errorEvent", () => {}, errorHandler1);
    eventBus.on("errorEvent", () => {}, errorHandler2);
    eventBus.error("errorEvent", new MyError("Error occurred"));

    expect(errorHandler1).toHaveBeenCalledWith(expect.any(MyError));
    expect(errorHandler2).toHaveBeenCalledWith(expect.any(MyError));
  });

  test("handling errors of eventBus.promise()", async () => {
    const errorHandler = jest.fn();

    class MyError extends Error {}

    setTimeout(() => {
      eventBus.error("errorEvent", new MyError("Error occurred"));
    }, 1000);

    await eventBus.promise("errorEvent").catch(errorHandler);

    expect(errorHandler).toHaveBeenCalledWith(expect.any(MyError));
  });
});
