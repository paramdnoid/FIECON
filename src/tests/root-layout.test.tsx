import { describe, it, expect, vi, beforeEach } from "vitest";

// Mutable stand-in for the x-locale header the middleware forwards
const requestHeaders = vi.hoisted(() => ({ locale: null as string | null }));

// ---------------------------------------------------------------------------
// Mock next/font/google — returns fake font objects
// ---------------------------------------------------------------------------
vi.mock("next/font/google", () => ({
  Playfair_Display: () => ({ variable: "--font-playfair" }),
  DM_Sans: () => ({ variable: "--font-dm-sans" }),
  Noto_Sans_Arabic: () => ({ variable: "--font-arabic" }),
}));

vi.mock("next/headers", () => ({
  headers: async () => ({
    get: (name: string) => (name === "x-locale" ? requestHeaders.locale : null),
  }),
}));

vi.mock("next-intl/server", () => ({
  getLocale: vi.fn(async () => "de"),
  getMessages: async () => ({}),
  getTranslations: async () => (key: string) => key,
  setRequestLocale: () => {},
}));

vi.mock("@/app/globals.css", () => ({}));

// ---------------------------------------------------------------------------
// Root Layout
// ---------------------------------------------------------------------------
describe("RootLayout", () => {
  beforeEach(() => {
    requestHeaders.locale = null;
  });

  it("returns JSX for ltr locale", async () => {
    const RootLayout = (await import("@/app/layout")).default;
    const result = await RootLayout({
      children: <div data-testid="child" />,
    });

    // Verify it returns an html element
    expect(result).toBeDefined();
    expect(result.type).toBe("html");
    expect(result.props.lang).toBe("de");
    expect(result.props.dir).toBe("ltr");
    expect(result.props.className).toContain("--font-playfair");
    expect(result.props.className).toContain("--font-dm-sans");
    expect(result.props.className).toContain("--font-arabic");
  });

  it("returns JSX for rtl locale", async () => {
    const { getLocale } = await import("next-intl/server");
    vi.mocked(getLocale).mockResolvedValueOnce("ar");

    const RootLayout = (await import("@/app/layout")).default;
    const result = await RootLayout({
      children: <div data-testid="child" />,
    });

    expect(result.props.lang).toBe("ar");
    expect(result.props.dir).toBe("rtl");
  });

  it("prefers the x-locale header over getLocale", async () => {
    // getLocale() resolves above the [locale] segment and returns the default,
    // so only the forwarded header can produce the correct lang/dir here.
    requestHeaders.locale = "ar";

    const RootLayout = (await import("@/app/layout")).default;
    const result = await RootLayout({ children: <div /> });

    expect(result.props.lang).toBe("ar");
    expect(result.props.dir).toBe("rtl");
  });

  it("ignores an unknown x-locale and falls back to getLocale", async () => {
    requestHeaders.locale = "not-a-locale";

    const RootLayout = (await import("@/app/layout")).default;
    const result = await RootLayout({ children: <div /> });

    expect(result.props.lang).toBe("de");
    expect(result.props.dir).toBe("ltr");
  });

  it("renders body with children", async () => {
    const RootLayout = (await import("@/app/layout")).default;
    const child = <div data-testid="child" />;
    const result = await RootLayout({ children: child });

    // body is the first child of html
    const body = result.props.children;
    expect(body).toBeDefined();
    expect(body.type).toBe("body");
  });
});

// ---------------------------------------------------------------------------
// Root Page (redirect)
// ---------------------------------------------------------------------------
describe("Root Page", () => {
  it("calls redirect to /de", async () => {
    const redirectMock = vi.fn();
    vi.doMock("next/navigation", () => ({
      redirect: redirectMock,
    }));

    vi.resetModules();
    const RootPage = (await import("@/app/page")).default;
    try {
      RootPage();
    } catch {
      // redirect may throw in test environment
    }
    expect(redirectMock).toHaveBeenCalledWith("/de");
  });
});
