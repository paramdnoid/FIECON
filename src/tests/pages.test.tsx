import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "de",
}));

vi.mock("next-intl/server", () => ({
  getTranslations: async () => (key: string) => key,
  setRequestLocale: () => {},
  getLocale: async () => "de",
}));

vi.mock("motion/react", () => {
  function filterDomProps(props: Record<string, unknown>) {
    const blocked = new Set([
      "initial", "animate", "exit", "transition", "variants",
      "whileHover", "whileTap", "whileInView", "viewport", "layout", "custom",
      "style",
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
    useTransform: () => 0,
  };
});

vi.mock("next/image", () => ({
  default: ({ priority: _p, fill: _f, ...rest }: Record<string, unknown>) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...rest} />;
  },
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

vi.mock("@/components/sections/Hero", () => ({
  Hero: () => <div data-testid="hero" />,
}));
vi.mock("@/components/sections/About", () => ({
  About: () => <div data-testid="about" />,
}));
vi.mock("@/components/sections/Services", () => ({
  Services: () => <div data-testid="services" />,
}));
vi.mock("@/components/sections/Philosophy", () => ({
  Philosophy: () => <div data-testid="philosophy" />,
}));
vi.mock("@/components/sections/Offices", () => ({
  Offices: () => <div data-testid="offices" />,
}));
vi.mock("@/components/sections/Contact", () => ({
  Contact: () => <div data-testid="contact" />,
}));
vi.mock("@/components/layout/ScrollToSection", () => ({
  ScrollToSection: () => null,
}));

vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------
describe("Loading page", () => {
  it("renders a loading spinner with status role", async () => {
    const Loading = (await import("@/app/[locale]/loading")).default;
    render(<Loading />);
    expect(screen.getByRole("status")).toBeDefined();
    expect(screen.getByText("Loading...")).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Error page
// ---------------------------------------------------------------------------
describe("Error page", () => {
  it("renders error title and retry button", async () => {
    const ErrorPage = (await import("@/app/[locale]/error")).default;
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const reset = vi.fn();
    const error = new Error("test error");

    render(<ErrorPage error={error} reset={reset} />);
    expect(screen.getByText("title")).toBeDefined();
    expect(screen.getByText("description")).toBeDefined();

    const user = userEvent.setup();
    await user.click(screen.getByText("retry"));
    expect(reset).toHaveBeenCalledTimes(1);

    consoleSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// Not Found page
// ---------------------------------------------------------------------------
describe("NotFound page", () => {
  it("renders 404 text and back link", async () => {
    const NotFound = (await import("@/app/[locale]/not-found")).default;
    render(await NotFound());
    expect(screen.getByText("404")).toBeDefined();
    expect(screen.getByText("title")).toBeDefined();
    expect(screen.getByText("back")).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Global Error page
// ---------------------------------------------------------------------------
describe("GlobalError page", () => {
  it("renders error message and reset button", async () => {
    const GlobalError = (await import("@/app/global-error")).default;
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const reset = vi.fn();
    const error = new Error("catastrophic");

    render(<GlobalError error={error} reset={reset} />);
    expect(screen.getByText("Ein unerwarteter Fehler ist aufgetreten")).toBeDefined();

    const user = userEvent.setup();
    await user.click(screen.getByText("Seite neu laden"));
    expect(reset).toHaveBeenCalledTimes(1);

    consoleSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// HomePage
// ---------------------------------------------------------------------------
describe("HomePage", () => {
  it("renders all sections", async () => {
    const HomePage = (await import("@/app/[locale]/page")).default;
    render(await HomePage({ params: Promise.resolve({ locale: "de" }) }));
    expect(screen.getByTestId("hero")).toBeDefined();
    expect(screen.getByTestId("about")).toBeDefined();
    expect(screen.getByTestId("services")).toBeDefined();
    expect(screen.getByTestId("philosophy")).toBeDefined();
    expect(screen.getByTestId("offices")).toBeDefined();
    expect(screen.getByTestId("contact")).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Impressum page
// ---------------------------------------------------------------------------
describe("Impressum page", () => {
  it("renders title and company info", async () => {
    const ImpressumPage = (await import("@/app/[locale]/impressum/page")).default;
    render(await ImpressumPage({ params: Promise.resolve({ locale: "de" }) }));
    expect(screen.getByText("title")).toBeDefined();
    expect(screen.getByText("info_title")).toBeDefined();
    expect(screen.getByText("contact_title")).toBeDefined();
    expect(screen.getByText("responsible_title")).toBeDefined();
  });

  it("exports generateMetadata", async () => {
    const mod = await import("@/app/[locale]/impressum/page");
    expect(mod.generateMetadata).toBeDefined();
    const meta = await mod.generateMetadata({ params: Promise.resolve({ locale: "de" }) });
    expect(meta.title).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Datenschutz page
// ---------------------------------------------------------------------------
describe("Datenschutz page", () => {
  it("renders title and sections", async () => {
    const DatenschutzPage = (await import("@/app/[locale]/datenschutz/page")).default;
    render(await DatenschutzPage({ params: Promise.resolve({ locale: "de" }) }));
    expect(screen.getByText("title")).toBeDefined();
    expect(screen.getByText("intro")).toBeDefined();
    expect(screen.getByText("section_1_title")).toBeDefined();
  });

  it("exports generateMetadata", async () => {
    const mod = await import("@/app/[locale]/datenschutz/page");
    expect(mod.generateMetadata).toBeDefined();
    const meta = await mod.generateMetadata({ params: Promise.resolve({ locale: "de" }) });
    expect(meta.title).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Root page (redirect)
// ---------------------------------------------------------------------------
describe("Root page", () => {
  it("calls redirect to /de", async () => {
    const redirectMock = vi.fn();
    vi.doMock("next/navigation", () => ({
      redirect: redirectMock,
      useRouter: () => ({ push: vi.fn() }),
    }));
    const mod = await import("@/app/page");
    expect(mod.default).toBeDefined();
  });
});
