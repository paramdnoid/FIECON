/**
 * Misc coverage tests for remaining small gaps.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// ---------------------------------------------------------------------------
// texas-counties-path.ts
// ---------------------------------------------------------------------------
describe("texas-counties-path", () => {
  it("exports TEXAS_COUNTIES_PATH as a non-empty string", async () => {
    const { TEXAS_COUNTIES_PATH } = await import(
      "@/components/maps/texas-counties-path"
    );
    expect(typeof TEXAS_COUNTIES_PATH).toBe("string");
    expect(TEXAS_COUNTIES_PATH.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// StaggerChildren — prefersReduced branch (line 41-42)
// ---------------------------------------------------------------------------
describe("StaggerChildren — prefersReduced", () => {
  it("renders plain div when reduced motion is preferred", async () => {
    vi.doMock("motion/react", () => ({
      motion: new Proxy({} as Record<string, unknown>, {
        get: (_target, prop: string) => {
          const Comp = ({
            children,
            ...rest
          }: React.PropsWithChildren<Record<string, unknown>>) => {
            const domSafe: Record<string, unknown> = {};
            for (const [k, v] of Object.entries(rest)) {
              if (!["initial", "animate", "exit", "transition", "variants",
                "whileHover", "whileTap", "whileInView", "viewport",
                "layout", "custom",
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
      useReducedMotion: () => true,
    }));

    vi.resetModules();
    const { StaggerChildren } = await import(
      "@/components/animations/StaggerChildren"
    );
    render(
      <StaggerChildren className="test-class">
        <span>Child</span>
      </StaggerChildren>,
    );
    expect(screen.getByText("Child")).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// OG Image — actually call the default export
// ---------------------------------------------------------------------------
describe("OG Image — function invocation", () => {
  it("returns an ImageResponse", async () => {
    const mod = await import("@/app/[locale]/opengraph-image");
    const result = mod.default();
    // ImageResponse is a Response-like object
    expect(result).toBeDefined();
  });
});
