import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
vi.mock("next-intl", () => ({
  NextIntlClientProvider: ({ children }: React.PropsWithChildren) => <>{children}</>,
  useTranslations: () => (key: string) => key,
  useLocale: () => "de",
}));

vi.mock("next-intl/server", () => ({
  getMessages: async () => ({}),
  getTranslations: async () => (key: string) => key,
  setRequestLocale: () => {},
  getLocale: async () => "de",
}));

vi.mock("next/headers", () => ({
  headers: async () => ({
    get: (name: string) => (name === "x-nonce" ? "test-nonce-123" : null),
  }),
  cookies: async () => ({
    get: () => undefined,
  }),
}));

vi.mock("motion/react", () => {
  function filterDomProps(props: Record<string, unknown>) {
    const blocked = new Set([
      "initial", "animate", "exit", "transition", "variants",
      "whileHover", "whileTap", "whileInView", "viewport", "layout", "custom",
    ]);
    const filtered: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(props)) {
      if (!blocked.has(k)) filtered[k] = v;
    }
    return filtered;
  }

  return {
    motion: new Proxy({} as Record<string, unknown>, {
      get: (_target, prop: string) => {
        const Comp = ({
          children,
          ...rest
        }: React.PropsWithChildren<Record<string, unknown>>) => (
          <div data-motion-element={prop} {...filterDomProps(rest)}>{children}</div>
        );
        Comp.displayName = `motion.${prop}`;
        return Comp;
      },
    }),
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
    useReducedMotion: () => false,
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  };
});

vi.mock("next/image", () => ({
  default: ({ priority: _p, fill: _f, ...rest }: Record<string, unknown>) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...rest} />;
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  redirect: vi.fn(),
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    href,
    ...rest
  }: React.PropsWithChildren<{ href: string } & Record<string, unknown>>) => {
    const { locale: _l, prefetch: _p, ...domProps } = rest as Record<string, unknown>;
    return <a href={href} {...domProps}>{children}</a>;
  },
}));

vi.mock("@/hooks/useScrollProgress", () => ({
  useScrollProgress: () => false,
}));

vi.mock("@/hooks/useActiveSection", () => ({
  useActiveSection: () => "",
}));

vi.mock("@/hooks/useFocusTrap", () => ({
  useFocusTrap: () => ({ current: null }),
}));

vi.mock("@/components/flags", () => ({
  FLAGS: new Proxy(
    {},
    {
      get: () => {
        const Flag = (props: Record<string, unknown>) => (
          <span data-testid="flag" {...props} />
        );
        return Flag;
      },
    },
  ),
}));

// ---------------------------------------------------------------------------
// LocaleLayout
// ---------------------------------------------------------------------------
describe("LocaleLayout", () => {
  it("renders skip-to-content link", async () => {
    const LocaleLayout = (await import("@/app/[locale]/layout")).default;
    render(
      await LocaleLayout({
        children: <div data-testid="child" />,
        params: Promise.resolve({ locale: "de" }),
      }),
    );
    expect(screen.getByText("skip_to_content")).toBeDefined();
  });

  it("renders main element", async () => {
    const LocaleLayout = (await import("@/app/[locale]/layout")).default;
    render(
      await LocaleLayout({
        children: <div data-testid="child" />,
        params: Promise.resolve({ locale: "de" }),
      }),
    );
    expect(screen.getByRole("main")).toBeDefined();
  });

  it("renders children within main", async () => {
    const LocaleLayout = (await import("@/app/[locale]/layout")).default;
    render(
      await LocaleLayout({
        children: <div data-testid="child" />,
        params: Promise.resolve({ locale: "de" }),
      }),
    );
    expect(screen.getByTestId("child")).toBeDefined();
  });

  it("includes JSON-LD scripts", async () => {
    const LocaleLayout = (await import("@/app/[locale]/layout")).default;
    const { container } = render(
      await LocaleLayout({
        children: <div />,
        params: Promise.resolve({ locale: "de" }),
      }),
    );
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// generateStaticParams
// ---------------------------------------------------------------------------
describe("generateStaticParams", () => {
  it("returns all locales", async () => {
    const { generateStaticParams } = await import("@/app/[locale]/layout");
    const params = generateStaticParams();
    expect(params.length).toBeGreaterThan(0);
    expect(params[0]).toHaveProperty("locale");
  });
});

// ---------------------------------------------------------------------------
// generateMetadata
// ---------------------------------------------------------------------------
describe("generateMetadata", () => {
  it("returns metadata with title and description", async () => {
    const { generateMetadata } = await import("@/app/[locale]/layout");
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "de" }),
    });
    expect(metadata.title).toBeDefined();
    expect(metadata.description).toBeDefined();
  });

  it("includes openGraph locale", async () => {
    const { generateMetadata } = await import("@/app/[locale]/layout");
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "de" }),
    });
    expect(metadata.openGraph).toBeDefined();
  });

  it("includes google verification when env is set", async () => {
    process.env.GOOGLE_SITE_VERIFICATION = "test-code";
    // Re-import to get fresh module
    vi.resetModules();

    // Re-apply mocks
    vi.doMock("next-intl/server", () => ({
      getMessages: async () => ({}),
      getTranslations: async () => (key: string) => key,
      setRequestLocale: () => {},
    }));

    const { generateMetadata } = await import("@/app/[locale]/layout");
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "de" }),
    });
    expect(metadata.verification).toEqual({ google: "test-code" });
    delete process.env.GOOGLE_SITE_VERIFICATION;
  });
});

// ---------------------------------------------------------------------------
// OG Image
// ---------------------------------------------------------------------------
describe("OG Image", () => {
  it("exports alt, size, and contentType", async () => {
    const mod = await import("@/app/[locale]/opengraph-image");
    expect(mod.alt).toBeDefined();
    expect(mod.size).toEqual({ width: 1200, height: 630 });
    expect(mod.contentType).toBe("image/png");
  });

  it("exports a default function", async () => {
    const mod = await import("@/app/[locale]/opengraph-image");
    expect(typeof mod.default).toBe("function");
  });
});
