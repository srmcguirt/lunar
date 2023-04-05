import { expect, test } from "vitest";
import { testLib } from "../source/test-lib";

test("Value with no arguments passed should be string", (): void => {
  expect(testLib()).toBe("test-lib");
});
