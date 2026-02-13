import { describe, it, expect, vi } from "vitest";

// ---------------------------------------------------------------------------
// i18n/navigation.ts
// ---------------------------------------------------------------------------
vi.mock("next-intl/navigation", () => ({
  createNavigation: () => ({
    Link: "MockedLink",
    redirect: "MockedRedirect",
    usePathname: "MockedUsePathname",
    useRouter: "MockedUseRouter",
  }),
}));

describe("i18n/navigation", () => {
  it("exports Link, redirect, usePathname, useRouter", async () => {
    const nav = await import("@/i18n/navigation");
    expect(nav.Link).toBeDefined();
    expect(nav.redirect).toBeDefined();
    expect(nav.usePathname).toBeDefined();
    expect(nav.useRouter).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// i18n/request.ts — detect locale logic
// ---------------------------------------------------------------------------
describe("i18n/request", () => {
  it("exports a default config function", async () => {
    vi.doMock("next-intl/server", () => ({
      getRequestConfig: (fn: (...args: unknown[]) => unknown) => fn,
    }));
    vi.doMock("next/headers", () => ({
      cookies: async () => ({
        get: () => undefined,
      }),
      headers: async () => ({
        get: () => "",
      }),
    }));

    const mod = await import("@/i18n/request");
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe("function");
  });
});

// ---------------------------------------------------------------------------
// i18n/routing.ts
// ---------------------------------------------------------------------------
describe("i18n/routing", () => {
  it("exports routing with locales and defaultLocale", async () => {
    const { routing } = await import("@/i18n/routing");
    expect(routing.locales).toBeDefined();
    expect(routing.locales.length).toBeGreaterThan(0);
    expect(routing.defaultLocale).toBe("de");
  });
});
