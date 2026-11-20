import { expect, test } from "bun:test";
import { parseGlitchtipDsn } from "./dsn";

test("parses origin and CSP report URI from a valid DSN", () => {
  expect(
    parseGlitchtipDsn("https://mykey123@glitchtip.example.com/42"),
  ).toEqual({
    origin: "https://glitchtip.example.com",
    cspReportUri:
      "https://glitchtip.example.com/api/42/security/?glitchtip_key=mykey123",
  });
});

test("preserves non-default port in origin and report URI", () => {
  expect(parseGlitchtipDsn("http://k@localhost:8000/1")).toEqual({
    origin: "http://localhost:8000",
    cspReportUri: "http://localhost:8000/api/1/security/?glitchtip_key=k",
  });
});

test("rejects malformed DSNs without leaking the secret key", () => {
  for (const bad of [
    "not-a-url",
    "https://glitchtip.example.com/1",
    "https://secretkey@glitchtip.example.com/",
    "https://secretkey@glitchtip.example.com",
  ]) {
    let caught: unknown;
    try {
      parseGlitchtipDsn(bad);
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(Error);
    expect((caught as Error).message).toBe("Invalid GlitchTip DSN");
    expect((caught as Error).message).not.toContain("secretkey");
  }
});
