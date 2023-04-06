import { expect, test } from "vitest";
import { functional } from "../source/functional";

test("Value with no arguments passed should be string", (): void => {
  expect(functional()).toBe("test-lib");
});
