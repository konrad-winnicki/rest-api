import { describe, expect, test } from "@jest/globals";
import { InputTask } from "../Task/Domain/InputTask";

describe("Test class InputTask", () => {
  test("initialize instance of class Task", () => {
    const inputTask = new InputTask("string", "", "", "string");
    expect(inputTask).toBeInstanceOf(InputTask);
  });

  test('constructor should convert deadline to null if date = "" and time: ""', () => {
    const inputTask = new InputTask("task1", "", "", "pending");
    expect(inputTask).toEqual({
      name: "task1",
      deadline: null,
      status: "pending",
    });
  });

  test('constructor should convert deadline to date object if date != "" ', () => {
    const inputTask = new InputTask("task1", "1990-01-01", "", "pending");
    expect(inputTask).toEqual({
      name: "task1",
      deadline: new Date(`1990-01-01:00:00Z`),
      status: "pending",
    });
  });

 
});
