import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

describe("MapUS", () => {
  it("renders an SVG with role img", async () => {
    const { MapUS } = await import("@/components/maps/MapUS");
    const { container } = render(<MapUS />);
    const svg = container.querySelector("svg");
    expect(svg).toBeDefined();
    expect(svg?.getAttribute("role")).toBe("img");
  });

  it("accepts custom className", async () => {
    const { MapUS } = await import("@/components/maps/MapUS");
    const { container } = render(<MapUS className="custom-class" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("class")).toBe("custom-class");
  });

  it("accepts custom dotClassName", async () => {
    const { MapUS } = await import("@/components/maps/MapUS");
    const { container } = render(<MapUS dotClassName="dot-test" />);
    const circles = container.querySelectorAll("circle");
    const dotCircle = Array.from(circles).find(
      (c) => c.getAttribute("class") === "dot-test",
    );
    expect(dotCircle).toBeDefined();
  });
});

describe("MapDE", () => {
  it("renders an SVG", async () => {
    const { MapDE } = await import("@/components/maps/MapDE");
    const { container } = render(<MapDE />);
    const svg = container.querySelector("svg");
    expect(svg).toBeDefined();
  });

  it("accepts custom className", async () => {
    const { MapDE } = await import("@/components/maps/MapDE");
    const { container } = render(<MapDE className="custom" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("class")).toBe("custom");
  });
});

describe("MapRS", () => {
  it("renders an SVG", async () => {
    const { MapRS } = await import("@/components/maps/MapRS");
    const { container } = render(<MapRS />);
    const svg = container.querySelector("svg");
    expect(svg).toBeDefined();
  });

  it("accepts custom className", async () => {
    const { MapRS } = await import("@/components/maps/MapRS");
    const { container } = render(<MapRS className="custom" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("class")).toBe("custom");
  });
});

describe("COUNTRY_MAPS", () => {
  it("exports DE, RS, US map components", async () => {
    const { COUNTRY_MAPS } = await import("@/components/maps");
    expect(COUNTRY_MAPS.DE).toBeDefined();
    expect(COUNTRY_MAPS.RS).toBeDefined();
    expect(COUNTRY_MAPS.US).toBeDefined();
  });
});
