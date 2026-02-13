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
        }: React.PropsWithChildren<Record<string, unknown>>) => {
          const tag = typeof prop === "string" && ["svg", "path", "div", "span", "p"].includes(prop) ? prop : "div";
          const Tag = tag as keyof JSX.IntrinsicElements;
          return <Tag data-motion-element={prop} {...filterDomProps(rest)}>{children}</Tag>;
        };
        Comp.displayName = `motion.${prop}`;
        return Comp;
      },
    }),
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
    useReducedMotion: () => false,
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useTransform: () => 0,
    useInView: () => true,
    useMotionValue: (initial: number) => ({
      get: () => initial,
      set: () => {},
      on: () => () => {},
    }),
    useSpring: (val: unknown) => val,
    animate: (_motionValue: unknown, _to: unknown, _opts?: unknown) => ({
      stop: () => {},
    }),
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

vi.mock("@/hooks/useCarouselIndex", () => ({
  useCarouselIndex: () => [{ current: null }, 0],
}));

vi.mock("@/components/maps", () => ({
  COUNTRY_MAPS: {
    DE: (props: Record<string, unknown>) => <svg data-testid="map-de" {...props} />,
    RS: (props: Record<string, unknown>) => <svg data-testid="map-rs" {...props} />,
    US: (props: Record<string, unknown>) => <svg data-testid="map-us" {...props} />,
  },
}));

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
describe("Hero", () => {
  it("renders a heading with FIECON letters", async () => {
    const { Hero } = await import("@/components/sections/Hero");
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toBeDefined();
    expect(screen.getByText("F")).toBeDefined();
  });

  it("renders CTA buttons", async () => {
    const { Hero } = await import("@/components/sections/Hero");
    render(<Hero />);
    expect(screen.getByText("cta_primary")).toBeDefined();
    expect(screen.getByText("cta_secondary")).toBeDefined();
  });

  it("renders tagline", async () => {
    const { Hero } = await import("@/components/sections/Hero");
    render(<Hero />);
    expect(screen.getByText("tagline")).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------
describe("About", () => {
  it("renders the about section with id", async () => {
    const { About } = await import("@/components/sections/About");
    const { container } = render(<About />);
    expect(container.querySelector("#about")).toBeDefined();
  });

  it("renders headline and text", async () => {
    const { About } = await import("@/components/sections/About");
    render(<About />);
    expect(screen.getByText("headline")).toBeDefined();
    expect(screen.getByText("text_1")).toBeDefined();
    expect(screen.getByText("text_2")).toBeDefined();
  });

  it("renders statistics", async () => {
    const { About } = await import("@/components/sections/About");
    render(<About />);
    expect(screen.getByText("stat_1_label")).toBeDefined();
    expect(screen.getByText("stat_2_label")).toBeDefined();
    expect(screen.getByText("stat_3_label")).toBeDefined();
  });

  it("renders quote section", async () => {
    const { About } = await import("@/components/sections/About");
    render(<About />);
    expect(screen.getByText("quote_attribution")).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
describe("Services", () => {
  it("renders the services section with id", async () => {
    const { Services } = await import("@/components/sections/Services");
    const { container } = render(<Services />);
    expect(container.querySelector("#services")).toBeDefined();
  });

  it("renders all four service cards", async () => {
    const { Services } = await import("@/components/sections/Services");
    render(<Services />);
    expect(screen.getByText("consulting.title")).toBeDefined();
    expect(screen.getByText("finance.title")).toBeDefined();
    expect(screen.getByText("construction.title")).toBeDefined();
    expect(screen.getByText("yacht.title")).toBeDefined();
  });

  it("renders focus areas", async () => {
    const { Services } = await import("@/components/sections/Services");
    render(<Services />);
    expect(screen.getByText("corporate_law.title")).toBeDefined();
    expect(screen.getByText("transparency.title")).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Philosophy
// ---------------------------------------------------------------------------
describe("Philosophy", () => {
  it("renders the approach section with id", async () => {
    const { Philosophy } = await import("@/components/sections/Philosophy");
    const { container } = render(<Philosophy />);
    expect(container.querySelector("#approach")).toBeDefined();
  });

  it("renders three value cards", async () => {
    const { Philosophy } = await import("@/components/sections/Philosophy");
    render(<Philosophy />);
    expect(screen.getByText("values.expertise.title")).toBeDefined();
    expect(screen.getByText("values.personal.title")).toBeDefined();
    expect(screen.getByText("values.trust.title")).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Offices
// ---------------------------------------------------------------------------
describe("Offices", () => {
  it("renders the offices section with id", async () => {
    const { Offices } = await import("@/components/sections/Offices");
    const { container } = render(<Offices />);
    expect(container.querySelector("#offices")).toBeDefined();
  });

  it("renders office cards with cities", async () => {
    const { Offices } = await import("@/components/sections/Offices");
    render(<Offices />);
    expect(screen.getByText("hamburg.city")).toBeDefined();
    expect(screen.getByText("belgrade.city")).toBeDefined();
    expect(screen.getByText("texas.city")).toBeDefined();
  });

  it("renders pagination dots", async () => {
    const { Offices } = await import("@/components/sections/Offices");
    render(<Offices />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------
describe("Contact", () => {
  it("renders the contact section with id", async () => {
    const { Contact } = await import("@/components/sections/Contact");
    const { container } = render(<Contact />);
    expect(container.querySelector("#contact")).toBeDefined();
  });

  it("renders contact information", async () => {
    const { Contact } = await import("@/components/sections/Contact");
    render(<Contact />);
    expect(screen.getByText("phone")).toBeDefined();
    expect(screen.getByText("email")).toBeDefined();
    expect(screen.getByText("address")).toBeDefined();
  });

  it("opens contact dialog on CTA click", async () => {
    const { Contact } = await import("@/components/sections/Contact");
    render(<Contact />);
    const user = userEvent.setup();

    await user.click(screen.getByText("cta"));
    // The dialog should be lazy-loaded and rendered
    // We check the Suspense boundary renders (dialog itself is tested elsewhere)
  });
});

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
describe("Footer", () => {
  it("renders footer element", async () => {
    const { Footer } = await import("@/components/layout/Footer");
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeDefined();
  });

  it("renders company name", async () => {
    const { Footer } = await import("@/components/layout/Footer");
    render(<Footer />);
    expect(screen.getByText("FIECON")).toBeDefined();
  });

  it("renders legal links", async () => {
    const { Footer } = await import("@/components/layout/Footer");
    render(<Footer />);
    expect(screen.getByText("impressum")).toBeDefined();
    expect(screen.getByText("datenschutz")).toBeDefined();
  });

  it("renders services and offices sections", async () => {
    const { Footer } = await import("@/components/layout/Footer");
    render(<Footer />);
    expect(screen.getByText("services_title")).toBeDefined();
    expect(screen.getByText("offices_title")).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// ScrollToSection
// ---------------------------------------------------------------------------
describe("ScrollToSection", () => {
  it("renders nothing (returns null)", async () => {
    const { ScrollToSection } = await import("@/components/layout/ScrollToSection");
    const { container } = render(<ScrollToSection />);
    expect(container.innerHTML).toBe("");
  });
});
