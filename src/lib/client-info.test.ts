import { expect, test } from "bun:test";
import { getClientInfo } from "./client-info";

const req = (headers: Record<string, string> = {}) =>
  new Request("https://themkvz.com/", { headers });

test("prefers cf-connecting-ip over forwarded and real-ip headers", () => {
  expect(
    getClientInfo(
      req({
        "cf-connecting-ip": "203.0.113.10",
        "x-forwarded-for": "198.51.100.1, 198.51.100.2",
        "x-real-ip": "192.0.2.1",
        "user-agent": "TestAgent/1.0",
      }),
    ),
  ).toEqual({
    ip: "203.0.113.10",
    userAgent: "TestAgent/1.0",
  });
});

test("falls back to the first trimmed entry in x-forwarded-for", () => {
  expect(
    getClientInfo(
      req({
        "x-forwarded-for": "  198.51.100.5 , 10.0.0.1 ",
        "x-real-ip": "192.0.2.1",
      }),
    ),
  ).toEqual({
    ip: "198.51.100.5",
    userAgent: null,
  });
});

test("falls back to x-real-ip when cf-connecting-ip and x-forwarded-for are absent", () => {
  expect(getClientInfo(req({ "x-real-ip": "192.0.2.9" }))).toEqual({
    ip: "192.0.2.9",
    userAgent: null,
  });
});

test("returns nulls when no IP or user-agent headers are present", () => {
  expect(getClientInfo(req())).toEqual({
    ip: null,
    userAgent: null,
  });
});
