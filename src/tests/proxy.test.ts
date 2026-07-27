import { describe, it, expect, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

// next-intl's locale routing is covered by its own package. The proxy only
// needs a response object to decorate, so hand back a plain pass-through.
vi.mock("next-intl/middleware", () => ({
  default: () => () => NextResponse.next(),
}));

const { default: proxy, config } = await import("@/proxy");

function request(path: string) {
  return new NextRequest(new URL(path, "https://www.fiecon-consulting.eu"));
}

function csp(path = "/de") {
  return proxy(request(path)).headers.get("content-security-policy") ?? "";
}

// ---------------------------------------------------------------------------
// Locale forwarding
//
// The root layout renders <html> but sits above the [locale] segment, so it
// cannot resolve the locale itself — it depends entirely on this header.
// ---------------------------------------------------------------------------
describe("proxy — locale forwarding", () => {
  it("forwards the locale from the URL as x-locale", () => {
    expect(proxy(request("/de")).headers.get("x-locale")).toBe("de");
    expect(proxy(request("/ar/team/rene-marquard")).headers.get("x-locale")).toBe(
      "ar",
    );
  });

  it("forwards locales with a script subtag and non-default ones", () => {
    for (const locale of ["en", "fr", "sr-Latn", "sr-Cyrl", "nds"]) {
      expect(proxy(request(`/${locale}/impressum`)).headers.get("x-locale")).toBe(
        locale,
      );
    }
  });

  it("ignores a first segment that is not a known locale", () => {
    expect(proxy(request("/fa/team")).headers.get("x-locale")).toBeNull();
    expect(proxy(request("/impressum")).headers.get("x-locale")).toBeNull();
  });

  it("sets no locale on the root path", () => {
    expect(proxy(request("/")).headers.get("x-locale")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Content Security Policy
// ---------------------------------------------------------------------------
describe("proxy — CSP", () => {
  it("emits a nonce that matches the x-nonce header the layout reads", () => {
    const response = proxy(request("/de"));
    const nonce = response.headers.get("x-nonce");

    expect(nonce).toBeTruthy();
    expect(response.headers.get("content-security-policy")).toContain(
      `'nonce-${nonce}'`,
    );
  });

  it("uses a fresh nonce per request", () => {
    const first = proxy(request("/de")).headers.get("x-nonce");
    const second = proxy(request("/de")).headers.get("x-nonce");

    expect(first).not.toBe(second);
  });

  it("keeps the restrictive directives in place", () => {
    const directives = csp();

    expect(directives).toContain("default-src 'self'");
    expect(directives).toContain("frame-ancestors 'none'");
    expect(directives).toContain("object-src 'none'");
    expect(directives).toContain("base-uri 'self'");
    expect(directives).toContain("form-action 'self'");
    expect(directives).toContain("connect-src 'self' https://*.ingest.sentry.io");
  });

  it("omits unsafe-eval and upgrades to https outside development", () => {
    const directives = csp();

    expect(directives).not.toContain("unsafe-eval");
    expect(directives).toContain("upgrade-insecure-requests");
  });

  it("allows unsafe-eval and skips the https upgrade in development", () => {
    // isDev is evaluated per request, so stubbing the env is enough
    vi.stubEnv("NODE_ENV", "development");
    const directives = csp();
    vi.unstubAllEnvs();

    expect(directives).toContain("'unsafe-eval'");
    expect(directives).not.toContain("upgrade-insecure-requests");
  });

  it("sets the headers even when no locale is forwarded", () => {
    const response = proxy(request("/impressum"));

    expect(response.headers.get("x-nonce")).toBeTruthy();
    expect(response.headers.get("content-security-policy")).toContain(
      "default-src 'self'",
    );
  });
});

// ---------------------------------------------------------------------------
// Matcher
//
// Approximates Next's matching: the pattern is applied as a plain regex here,
// which is close enough to catch an accidental widening of the exclusions.
// ---------------------------------------------------------------------------
describe("proxy — matcher", () => {
  const pattern = new RegExp(`^${config.matcher[0]}$`);

  it("covers locale-prefixed pages", () => {
    expect(pattern.test("/de")).toBe(true);
    expect(pattern.test("/de/team/rene-marquard")).toBe(true);
    expect(pattern.test("/ar/gesetze")).toBe(true);
  });

  it("excludes API routes, Next internals and files with an extension", () => {
    expect(pattern.test("/api/contact")).toBe(false);
    expect(pattern.test("/_next/static/chunk.js")).toBe(false);
    expect(pattern.test("/_vercel/insights")).toBe(false);
    expect(pattern.test("/robots.txt")).toBe(false);
  });
});
