import { expect, test } from "bun:test";
import { isClientError } from "./errors";

const routeError = (status: number) => ({
  status,
  statusText: "Status",
  data: null,
  internal: false,
});

test("returns true for 4xx route error responses", () => {
  expect(isClientError(routeError(400))).toBe(true);
  expect(isClientError(routeError(404))).toBe(true);
  expect(isClientError(routeError(499))).toBe(true);
});

test("returns false for 5xx and non-4xx route error responses", () => {
  expect(isClientError(routeError(399))).toBe(false);
  expect(isClientError(routeError(500))).toBe(false);
  expect(isClientError(routeError(503))).toBe(false);
});

test("returns false for plain errors and non-objects", () => {
  expect(isClientError(new Error("boom"))).toBe(false);
  expect(isClientError(null)).toBe(false);
  expect(isClientError("404")).toBe(false);
});
