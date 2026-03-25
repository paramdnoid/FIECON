import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  mockMotionReact,
  mockNavigation,
  mockNextImage,
  mockNextIntl,
  mockNextIntlServer,
} from "./test-utils/mocks";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
mockNextIntl();
mockNextIntlServer();
mockMotionReact();
mockNextImage();
mockNavigation();

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
    render(await Loading());
    expect(screen.getByRole("status")).toBeDefined();
    expect(screen.getByText("sending")).toBeDefined();
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
// Four-Point-Plan detail page
// ---------------------------------------------------------------------------
describe("Four-Point-Plan page", () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("renders detailed plan content for de locale", async () => {
    const FourPointPlanPage = (await import("@/app/[locale]/four-point-plan/page")).default;
    render(await FourPointPlanPage({ params: Promise.resolve({ locale: "de" }) }));

    const user = userEvent.setup();
    expect(screen.getByText("cta_contact")).toBeDefined();
    expect(screen.getByText("points.strategy.subpoints.1_1.items.0")).toBeDefined();

    await user.click(screen.getAllByRole("button", { name: /points\.tax\.title/i })[0]);
    await user.click(screen.getByRole("button", { name: /points\.tax\.subpoints\.2_2\.title/i }));
    expect(screen.getByText("points.tax.subpoints.2_2.items.1")).toBeDefined();
  });

  it("syncs left navigation on window scroll progress", async () => {
    const FourPointPlanPage = (await import("@/app/[locale]/four-point-plan/page")).default;
    render(await FourPointPlanPage({ params: Promise.resolve({ locale: "de" }) }));

    const scrollSyncRoot = document.querySelector("[data-scroll-sync-root='true']");
    expect(scrollSyncRoot).toBeDefined();

    Object.defineProperty(window, "innerHeight", { value: 1000, configurable: true });
    Object.defineProperty(scrollSyncRoot as HTMLElement, "offsetHeight", {
      value: 2400,
      configurable: true,
    });
    (scrollSyncRoot as HTMLElement).getBoundingClientRect = () =>
      ({
        top: -300,
        bottom: 2100,
        height: 2400,
        width: 0,
        x: 0,
        y: -300,
        left: 0,
        right: 0,
        toJSON: () => ({}),
      }) as DOMRect;
    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
    });

    const leftNav = document.querySelector("aside");
    expect(leftNav).toBeDefined();
    const taxButtonInLeftNav = within(leftNav as HTMLElement).getByRole("button", {
      name: /points\.tax\.title/i,
    });
    expect(taxButtonInLeftNav.getAttribute("aria-pressed")).toBe("true");
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
