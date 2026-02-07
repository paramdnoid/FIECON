import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { Spinner } from "@/components/ui/Spinner";

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------
describe("Button", () => {
  it("renders a <button> element by default", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeDefined();
  });

  it("has type=button", () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("renders an <a> element when href is provided", () => {
    render(<Button href="contact">Contact</Button>);
    const link = screen.getByRole("link", { name: "Contact" });
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("#contact");
  });

  it("applies primary variant classes by default", () => {
    render(<Button>Primary</Button>);
    expect(screen.getByRole("button").className).toContain("bg-bordeaux-900");
  });

  it("applies secondary variant classes", () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button").className).toContain(
      "border-bordeaux-900",
    );
  });

  it("applies ghost variant classes", () => {
    render(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button").className).toContain("border-transparent");
  });

  it("applies inverse variant classes", () => {
    render(<Button variant="inverse">Inverse</Button>);
    expect(screen.getByRole("button").className).toContain("border-white");
  });

  it("applies medium size classes by default", () => {
    render(<Button>Medium</Button>);
    expect(screen.getByRole("button").className).toContain("px-6");
  });

  it("applies small size classes", () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button").className).toContain("px-4");
  });

  it("applies large size classes", () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button").className).toContain("sm:px-8");
  });

  it("calls onClick handler when clicked", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.setup().click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    render(<Button className="mt-4">Custom</Button>);
    expect(screen.getByRole("button").className).toContain("mt-4");
  });
});

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------
describe("Badge", () => {
  it("renders children content", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeDefined();
  });

  it("renders a <span> element", () => {
    render(<Badge>Tag</Badge>);
    expect(screen.getByText("Tag").tagName).toBe("SPAN");
  });

  it("applies default variant classes", () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText("Default").className).toContain("bg-beige-200");
  });

  it("applies accent variant classes", () => {
    render(<Badge variant="accent">Accent</Badge>);
    expect(screen.getByText("Accent").className).toContain("bg-bordeaux-900");
  });

  it("applies custom className", () => {
    render(<Badge className="ml-2">Extra</Badge>);
    expect(screen.getByText("Extra").className).toContain("ml-2");
  });
});

// ---------------------------------------------------------------------------
// Container
// ---------------------------------------------------------------------------
describe("Container", () => {
  it("renders children content", () => {
    render(<Container>Content</Container>);
    expect(screen.getByText("Content")).toBeDefined();
  });

  it("applies max-w-7xl for default lg size", () => {
    const { container } = render(<Container>Test</Container>);
    expect(container.firstElementChild!.className).toContain("max-w-7xl");
  });

  it("applies max-w-3xl for sm size", () => {
    const { container } = render(<Container size="sm">Test</Container>);
    expect(container.firstElementChild!.className).toContain("max-w-3xl");
  });

  it("applies max-w-5xl for md size", () => {
    const { container } = render(<Container size="md">Test</Container>);
    expect(container.firstElementChild!.className).toContain("max-w-5xl");
  });

  it("applies custom className", () => {
    const { container } = render(
      <Container className="py-8">Test</Container>,
    );
    expect(container.firstElementChild!.className).toContain("py-8");
  });
});

// ---------------------------------------------------------------------------
// SectionHeading
// ---------------------------------------------------------------------------
describe("SectionHeading", () => {
  it("renders headline in an h2 element", () => {
    render(<SectionHeading headline="Title" />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Title" }),
    ).toBeDefined();
  });

  it("renders badge when provided", () => {
    render(<SectionHeading headline="Title" badge="About" />);
    expect(screen.getByText("About")).toBeDefined();
  });

  it("does not render badge when not provided", () => {
    const { container } = render(<SectionHeading headline="Title" />);
    // Badge is a span with tracking-[0.4em]
    expect(container.querySelector(".tracking-\\[0\\.4em\\]")).toBeNull();
  });

  it("renders subtitle when provided", () => {
    render(<SectionHeading headline="Title" subtitle="Details here" />);
    expect(screen.getByText("Details here")).toBeDefined();
  });

  it("does not render subtitle <p> when not provided", () => {
    const { container } = render(<SectionHeading headline="Title" />);
    expect(container.querySelector("p")).toBeNull();
  });

  it("applies center alignment by default", () => {
    const { container } = render(<SectionHeading headline="Title" />);
    expect(container.firstElementChild!.className).toContain("text-center");
  });

  it("applies left alignment", () => {
    const { container } = render(
      <SectionHeading headline="Title" align="left" />,
    );
    expect(container.firstElementChild!.className).toContain("text-left");
  });

  it("applies gradient class when gradient is true", () => {
    render(<SectionHeading headline="Title" gradient />);
    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2.className).toContain("gradient-text");
  });

  it("applies italic class when italic is true", () => {
    render(<SectionHeading headline="Title" italic />);
    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2.className).toContain("italic");
  });

  it("renders children content", () => {
    render(
      <SectionHeading headline="Title">
        <span>Extra content</span>
      </SectionHeading>,
    );
    expect(screen.getByText("Extra content")).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// SectionDivider
// ---------------------------------------------------------------------------
describe("SectionDivider", () => {
  it("renders with aria-hidden=true", () => {
    const { container } = render(<SectionDivider />);
    expect(
      container.firstElementChild!.getAttribute("aria-hidden"),
    ).toBe("true");
  });

  it("renders line variant by default", () => {
    const { container } = render(<SectionDivider />);
    // Line variant has a single div with h-px
    expect(container.querySelector(".h-px")).not.toBeNull();
  });

  it("renders diamond variant with rotated element", () => {
    const { container } = render(<SectionDivider variant="diamond" />);
    expect(container.querySelector(".rotate-45")).not.toBeNull();
  });

  it("renders dots variant with three dot elements", () => {
    const { container } = render(<SectionDivider variant="dots" />);
    expect(container.querySelectorAll(".rounded-full")).toHaveLength(3);
  });

  it("applies custom className", () => {
    const { container } = render(<SectionDivider className="my-8" />);
    expect(container.firstElementChild!.className).toContain("my-8");
  });
});

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------
describe("Spinner", () => {
  it("renders an SVG element", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("has animate-spin class", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector("svg")!.classList.contains("animate-spin")).toBe(
      true,
    );
  });

  it("contains a circle and a path element", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector("circle")).not.toBeNull();
    expect(container.querySelector("path")).not.toBeNull();
  });
});
