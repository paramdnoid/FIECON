import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Toggle for useReducedMotion per-test
// ---------------------------------------------------------------------------
let mockReducedMotion = false;

vi.mock("motion/react", () => {
  const Passthrough = ({
    children,
    ...rest
  }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div {...filterDomProps(rest)}>{children}</div>
  );

  function filterDomProps(props: Record<string, unknown>) {
    const blocked = new Set([
      "initial",
      "animate",
      "exit",
      "transition",
      "variants",
      "whileHover",
      "whileTap",
      "whileInView",
      "viewport",
      "layout",
      "custom",
      "onMouseMove",
      "onMouseLeave",
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
          <div data-motion-element={prop} {...filterDomProps(rest)}>
            {children}
          </div>
        );
        Comp.displayName = `motion.${prop}`;
        return Comp;
      },
    }),
    AnimatePresence: Passthrough,
    useReducedMotion: () => mockReducedMotion,
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useMotionValue: (v: number) => ({ set: vi.fn(), get: () => v }),
    useTransform: (_mv: unknown, fn: (v: number) => number) => fn(0),
    useInView: () => true,
    animate: () => ({ stop: vi.fn() }),
  };
});

// ---------------------------------------------------------------------------
// FadeIn
// ---------------------------------------------------------------------------
describe("FadeIn", () => {
  beforeEach(() => {
    mockReducedMotion = false;
  });

  it("renders children in a motion.div when motion is enabled", async () => {
    const { FadeIn } = await import("@/components/animations/FadeIn");
    render(<FadeIn>Hello</FadeIn>);
    expect(screen.getByText("Hello").closest("[data-motion-element]")).not.toBeNull();
  });

  it("renders children in a plain div when reduced motion is preferred", async () => {
    mockReducedMotion = true;
    const { FadeIn } = await import("@/components/animations/FadeIn");
    render(<FadeIn>Hello</FadeIn>);
    const el = screen.getByText("Hello");
    expect(el.closest("[data-motion-element]")).toBeNull();
  });

  it("passes className through", async () => {
    const { FadeIn } = await import("@/components/animations/FadeIn");
    const { container } = render(<FadeIn className="my-class">Test</FadeIn>);
    expect(container.querySelector(".my-class")).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// StaggerChildren
// ---------------------------------------------------------------------------
describe("StaggerChildren", () => {
  beforeEach(() => {
    mockReducedMotion = false;
  });

  it("renders children in a motion.div when motion is enabled", async () => {
    const { StaggerChildren } = await import(
      "@/components/animations/StaggerChildren"
    );
    render(<StaggerChildren>Items</StaggerChildren>);
    expect(
      screen.getByText("Items").closest("[data-motion-element]"),
    ).not.toBeNull();
  });

  it("renders children in a plain div when reduced motion is preferred", async () => {
    mockReducedMotion = true;
    const { StaggerChildren } = await import(
      "@/components/animations/StaggerChildren"
    );
    render(<StaggerChildren>Items</StaggerChildren>);
    expect(
      screen.getByText("Items").closest("[data-motion-element]"),
    ).toBeNull();
  });

  it("exports staggerItemVariants with hidden/visible keys", async () => {
    const { staggerItemVariants } = await import(
      "@/components/animations/StaggerChildren"
    );
    expect(staggerItemVariants).toHaveProperty("hidden");
    expect(staggerItemVariants).toHaveProperty("visible");
  });

  it("passes className through", async () => {
    const { StaggerChildren } = await import(
      "@/components/animations/StaggerChildren"
    );
    const { container } = render(
      <StaggerChildren className="stagger-class">Test</StaggerChildren>,
    );
    expect(container.querySelector(".stagger-class")).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// CountUp
// ---------------------------------------------------------------------------
describe("CountUp", () => {
  beforeEach(() => {
    mockReducedMotion = false;
  });

  it("renders a span element", async () => {
    const { CountUp } = await import("@/components/animations/CountUp");
    const { container } = render(<CountUp to={100} />);
    expect(container.querySelector("span")).not.toBeNull();
  });

  it("displays prefix and suffix", async () => {
    const { CountUp } = await import("@/components/animations/CountUp");
    const { container } = render(<CountUp to={100} prefix="$" suffix="+" />);
    expect(container.textContent).toContain("$");
    expect(container.textContent).toContain("+");
  });

  it("passes className through", async () => {
    const { CountUp } = await import("@/components/animations/CountUp");
    const { container } = render(
      <CountUp to={50} className="count-class" />,
    );
    expect(container.querySelector(".count-class")).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// TextReveal
// ---------------------------------------------------------------------------
describe("TextReveal", () => {
  beforeEach(() => {
    mockReducedMotion = false;
  });

  it("renders text in motion spans when motion is enabled", async () => {
    const { TextReveal } = await import(
      "@/components/animations/TextReveal"
    );
    render(<TextReveal>Hello World</TextReveal>);
    // Each word gets a motion.span wrapper
    const motionSpans = document.querySelectorAll(
      "[data-motion-element='span']",
    );
    expect(motionSpans.length).toBe(2); // "Hello" and "World"
  });

  it("renders plain text when reduced motion is preferred", async () => {
    mockReducedMotion = true;
    const { TextReveal } = await import(
      "@/components/animations/TextReveal"
    );
    render(<TextReveal>Hello World</TextReveal>);
    const motionSpans = document.querySelectorAll(
      "[data-motion-element='span']",
    );
    expect(motionSpans.length).toBe(0);
  });

  it("renders with the specified tag", async () => {
    mockReducedMotion = true;
    const { TextReveal } = await import(
      "@/components/animations/TextReveal"
    );
    render(<TextReveal as="h2">Title Text</TextReveal>);
    expect(screen.getByRole("heading", { level: 2 })).toBeDefined();
  });

  it("passes className through", async () => {
    const { TextReveal } = await import(
      "@/components/animations/TextReveal"
    );
    const { container } = render(
      <TextReveal className="reveal-class">Test</TextReveal>,
    );
    expect(container.querySelector(".reveal-class")).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// SlideReveal
// ---------------------------------------------------------------------------
describe("SlideReveal", () => {
  beforeEach(() => {
    mockReducedMotion = false;
  });

  it("renders children in a motion.div when motion is enabled", async () => {
    const { SlideReveal } = await import(
      "@/components/animations/SlideReveal"
    );
    render(<SlideReveal>Slide content</SlideReveal>);
    expect(
      screen.getByText("Slide content").closest("[data-motion-element]"),
    ).not.toBeNull();
  });

  it("renders children in a plain div when reduced motion is preferred", async () => {
    mockReducedMotion = true;
    const { SlideReveal } = await import(
      "@/components/animations/SlideReveal"
    );
    render(<SlideReveal>Slide content</SlideReveal>);
    expect(
      screen.getByText("Slide content").closest("[data-motion-element]"),
    ).toBeNull();
  });

  it("passes className through", async () => {
    const { SlideReveal } = await import(
      "@/components/animations/SlideReveal"
    );
    const { container } = render(
      <SlideReveal className="slide-class">Test</SlideReveal>,
    );
    expect(container.querySelector(".slide-class")).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// ScrollProgress
// ---------------------------------------------------------------------------
describe("ScrollProgress", () => {
  beforeEach(() => {
    mockReducedMotion = false;
  });

  it("renders a motion.div when motion is enabled", async () => {
    const { ScrollProgress } = await import(
      "@/components/animations/ScrollProgress"
    );
    const { container } = render(<ScrollProgress />);
    expect(container.querySelector("[data-motion-element='div']")).not.toBeNull();
  });

  it("renders a static div when reduced motion is preferred", async () => {
    mockReducedMotion = true;
    const { ScrollProgress } = await import(
      "@/components/animations/ScrollProgress"
    );
    const { container } = render(<ScrollProgress />);
    expect(container.querySelector("[data-motion-element='div']")).toBeNull();
    expect(container.querySelector(".fixed")).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// MagneticButton
// ---------------------------------------------------------------------------
describe("MagneticButton", () => {
  beforeEach(() => {
    mockReducedMotion = false;
  });

  it("renders children in a motion.div when motion is enabled", async () => {
    const { MagneticButton } = await import(
      "@/components/animations/MagneticButton"
    );
    render(<MagneticButton>Click</MagneticButton>);
    expect(
      screen.getByText("Click").closest("[data-motion-element]"),
    ).not.toBeNull();
  });

  it("renders children in a plain div when reduced motion is preferred", async () => {
    mockReducedMotion = true;
    const { MagneticButton } = await import(
      "@/components/animations/MagneticButton"
    );
    render(<MagneticButton>Click</MagneticButton>);
    expect(
      screen.getByText("Click").closest("[data-motion-element]"),
    ).toBeNull();
  });

  it("passes className through", async () => {
    const { MagneticButton } = await import(
      "@/components/animations/MagneticButton"
    );
    const { container } = render(
      <MagneticButton className="mag-class">Test</MagneticButton>,
    );
    expect(container.querySelector(".mag-class")).not.toBeNull();
  });
});
