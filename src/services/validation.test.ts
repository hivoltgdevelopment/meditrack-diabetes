import test from "node:test";
import assert from "node:assert/strict";
import { isNameValid, isDateValid } from "./validation";

test("isNameValid", () => {
  assert.equal(isNameValid(""), false);
  assert.equal(isNameValid("Metformin"), true);
  assert.equal(isNameValid("  "), false);
});

test("isDateValid", () => {
  assert.equal(isDateValid("2023-12-01"), true);
  assert.equal(isDateValid("2023/12/01"), false);
  assert.equal(isDateValid(""), true);
  assert.equal(isDateValid("2023-2-01"), false);
});
