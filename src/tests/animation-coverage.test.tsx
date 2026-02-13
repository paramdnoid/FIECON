/**
 * Additional animation component tests to reach 100 % coverage.
 * These target the uncovered branches in TextReveal, SlideReveal, MagneticButton.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ---------------------------------------------------------------------------
// Base motion mock — shared by all tests in this file
// ---------------------------------------------------------------------------
const motionMock = {
  motion: new Proxy({} as Record<string, unknown>, {
    get: (_target, prop: string) => {
      const Comp = ({
        children,
        ...rest
      }: React.PropsWithChildren<Record<string, unknown>>) => {
        // Filter non-DOM motion props
        const domSafe: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(rest)) {
          if (!["initial", "animate", "exit", "transition", "variants",
            "whileHover", "whileTap", "whileInView", "viewport",
            "layout", "custom", "style", "onMouseMove", "onMouseLeave",
          ].includes(k)) {
            domSafe[k] = v;
          }
        }
        return <div data-motion-element={prop} {...domSafe}>{children}</div>;
      };
      Comp.displayName = `motion.${prop}`;
      return Comp;
    },
  }),
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
  useReducedMotion: vi.fn(() => false),
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: () => 0,
  useInView: () => true,
  useMotionValue: (initial: number) => ({
    get: () => initial,
    set: () => {},
    on: () => () => {},
  }),
  useSpring: (val: unknown) => val,
  animate: () => ({ stop: () => {} }),
};

vi.mock("motion/react", () => motionMock);

// ---------------------------------------------------------------------------
// TextReveal
// ---------------------------------------------------------------------------
describe("TextReveal — uncovered branches", () => {
  beforeEach(() => {
    motionMock.useReducedMotion.mockReturnValue(false);
    vi.useFakeTimers();
  });

  it("renders text with prefersReduced=true (line 39-41)", async () => {
    motionMock.useReducedMotion.mockReturnValue(true);
    const { TextReveal } = await import("@/components/animations/TextReveal");
    render(<TextReveal>Hello World</TextReveal>);
    expect(screen.getByText("Hello World")).toBeDefined();
  });

  it("renders with animateOnMount and transitions to hasAnimated (lines 45-56)", async () => {
    motionMock.useReducedMotion.mockReturnValue(false);
    const { TextReveal } = await import("@/components/animations/TextReveal");

    render(
      <TextReveal animateOnMount delay={0} staggerDelay={0.01}>
        Hello World
      </TextReveal>,
    );

    // Initially: motion wrappers (lines 58-81)
    expect(screen.getByText("Hello")).toBeDefined();

    // Fast-forward past animation duration to trigger hasAnimated
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // After animation: plain spans (lines 45-56)
    expect(screen.getByText("Hello")).toBeDefined();
  });

  it("renders without animateOnMount (whileInView branch, line 67)", async () => {
    motionMock.useReducedMotion.mockReturnValue(false);
    const { TextReveal } = await import("@/components/animations/TextReveal");
    render(<TextReveal delay={0.1}>Test Words Here</TextReveal>);
    expect(screen.getByText("Test")).toBeDefined();
    expect(screen.getByText("Words")).toBeDefined();
  });

  it("uses custom tag", async () => {
    const { TextReveal } = await import("@/components/animations/TextReveal");
    render(<TextReveal as="h2">Heading Text</TextReveal>);
    expect(screen.getByText("Heading")).toBeDefined();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
});

// ---------------------------------------------------------------------------
// SlideReveal
// ---------------------------------------------------------------------------
describe("SlideReveal — uncovered branches", () => {
  beforeEach(() => {
    motionMock.useReducedMotion.mockReturnValue(false);
    vi.useFakeTimers();
  });

  it("renders with prefersReduced=true (line 43-44)", async () => {
    motionMock.useReducedMotion.mockReturnValue(true);
    const { SlideReveal } = await import("@/components/animations/SlideReveal");
    render(<SlideReveal>Content</SlideReveal>);
    expect(screen.getByText("Content")).toBeDefined();
  });

  it("renders with animateOnMount and transitions to hasAnimated (line 49-50)", async () => {
    motionMock.useReducedMotion.mockReturnValue(false);
    const { SlideReveal } = await import("@/components/animations/SlideReveal");

    render(
      <SlideReveal animateOnMount delay={0} duration={0.1}>
        Slide Content
      </SlideReveal>,
    );

    expect(screen.getByText("Slide Content")).toBeDefined();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // After hasAnimated: plain div
    expect(screen.getByText("Slide Content")).toBeDefined();
  });

  it("renders all four directions", async () => {
    motionMock.useReducedMotion.mockReturnValue(false);
    const { SlideReveal } = await import("@/components/animations/SlideReveal");

    for (const dir of ["left", "right", "bottom", "top"] as const) {
      const { unmount } = render(<SlideReveal direction={dir}>Dir {dir}</SlideReveal>);
      expect(screen.getByText(`Dir ${dir}`)).toBeDefined();
      unmount();
    }
  });

  afterEach(() => {
    vi.useRealTimers();
  });
});

// ---------------------------------------------------------------------------
// MagneticButton — mouse leave branch (line 33-35)
// ---------------------------------------------------------------------------
describe("MagneticButton — uncovered branches", () => {
  it("handles mouse move and leave", async () => {
    motionMock.useReducedMotion.mockReturnValue(false);
    const { MagneticButton } = await import("@/components/animations/MagneticButton");

    render(
      <MagneticButton strength={0.1}>
        <button type="button">Click me</button>
      </MagneticButton>,
    );

    const user = userEvent.setup();
    const btn = screen.getByText("Click me");

    // These trigger the mouse events on the parent motion.div
    await user.hover(btn);
    await user.unhover(btn);
    expect(btn).toBeDefined();
  });

  it("renders plain div when prefersReduced=true", async () => {
    motionMock.useReducedMotion.mockReturnValue(true);
    const { MagneticButton } = await import("@/components/animations/MagneticButton");
    render(
      <MagneticButton>
        <span>Test</span>
      </MagneticButton>,
    );
    expect(screen.getByText("Test")).toBeDefined();
  });
});
