import { expect, test } from "bun:test";
import { buildReportOnlyCsp } from "./csp";

const policy = buildReportOnlyCsp({
  nonce: "abc-123",
  opApiOrigin: "https://openpanel.example.com",
  glitchtip: {
    origin: "https://glitchtip.example.com",
    cspReportUri:
      "https://glitchtip.example.com/api/1/security/?glitchtip_key=secret",
  },
});

const directives = () =>
  Object.fromEntries(
    policy.split("; ").map((entry) => {
      const [name, ...rest] = entry.split(" ");
      return [name, rest.join(" ")];
    }),
  );

test("script-src permits the per-response nonce without unsafe-inline", () => {
  const map = directives();
  expect(map["script-src"]).toBe("'self' 'nonce-abc-123'");
  expect(map["script-src"]).not.toContain("unsafe-inline");
});

test("connect-src and report-uri include the OpenPanel and GlitchTip origins", () => {
  const map = directives();
  expect(map["connect-src"]).toBe(
    "'self' https://openpanel.example.com https://glitchtip.example.com",
  );
  expect(map["report-uri"]).toBe(
    "https://glitchtip.example.com/api/1/security/?glitchtip_key=secret",
  );
});

test("hardening directives block framing, objects, and external form targets", () => {
  const map = directives();
  expect(map["default-src"]).toBe("'self'");
  expect(map["base-uri"]).toBe("'self'");
  expect(map["object-src"]).toBe("'none'");
  expect(map["frame-ancestors"]).toBe("'none'");
  expect(map["form-action"]).toBe("'self'");
});
