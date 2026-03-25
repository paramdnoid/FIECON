import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  mockMotionReact,
  mockNextImage,
  mockNextIntl,
} from "./test-utils/mocks";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
mockNextIntl();
mockMotionReact();
mockNextImage();

const { mockPush } = vi.hoisted(() => ({
  mockPush: vi.fn(),
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    href,
    ...rest
  }: React.PropsWithChildren<{ href: string } & Record<string, unknown>>) => {
    // Filter non-DOM props
    const { locale: _locale, prefetch: _prefetch, ...domProps } = rest as Record<string, unknown>;
    return (
      <a href={href} {...domProps}>
        {children}
      </a>
    );
  },
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/de",
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
// Header
// ---------------------------------------------------------------------------
describe("Header", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders a header element", async () => {
    const { Header } = await import("@/components/layout/Header");
    render(<Header />);
    expect(screen.getByRole("banner")).toBeDefined();
  });

  it("contains a home link with aria-label", async () => {
    const { Header } = await import("@/components/layout/Header");
    render(<Header />);
    const homeLink = screen.getByRole("link", { name: "home" });
    expect(homeLink).toBeDefined();
  });

  it("renders the company name", async () => {
    const { Header } = await import("@/components/layout/Header");
    render(<Header />);
    expect(screen.getByText("FIECON")).toBeDefined();
  });

  it("renders navigation links for all NAV_LINKS", async () => {
    const { Header } = await import("@/components/layout/Header");
    render(<Header />);
    // German locale includes all links including the Four-Point-Plan.
    // In desktop nav each link renders with the translation key as text
    for (const id of ["about", "services", "four_point_plan", "gesetze", "approach", "offices", "contact"]) {
      // There are multiple links (desktop nav + mobile menu), just check they exist
      const links = screen.getAllByText(id);
      expect(links.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("has a mobile menu toggle button with aria-label and aria-expanded", async () => {
    const { Header } = await import("@/components/layout/Header");
    render(<Header />);
    const menuButton = screen.getByRole("button", { name: "menu" });
    expect(menuButton).toBeDefined();
    expect(menuButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("toggles aria-expanded on mobile menu button click", async () => {
    const { Header } = await import("@/components/layout/Header");
    render(<Header />);
    const user = userEvent.setup();
    const menuButton = screen.getByRole("button", { name: "menu" });

    await user.click(menuButton);
    expect(menuButton.getAttribute("aria-expanded")).toBe("true");

    await user.click(menuButton);
    expect(menuButton.getAttribute("aria-expanded")).toBe("false");
  });
});

// ---------------------------------------------------------------------------
// MobileMenu
// ---------------------------------------------------------------------------
describe("MobileMenu", () => {
  it("renders nothing when isOpen is false", async () => {
    const { MobileMenu } = await import("@/components/layout/MobileMenu");
    render(<MobileMenu isOpen={false} onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders a dialog when isOpen is true", async () => {
    const { MobileMenu } = await import("@/components/layout/MobileMenu");
    render(<MobileMenu isOpen={true} onClose={() => {}} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeDefined();
    expect(dialog.getAttribute("aria-modal")).toBe("true");
  });

  it("renders all nav links for de locale", async () => {
    const { MobileMenu } = await import("@/components/layout/MobileMenu");
    render(<MobileMenu isOpen={true} onClose={() => {}} />);
    for (const id of ["about", "services", "four_point_plan", "gesetze", "approach", "offices", "contact"]) {
      expect(screen.getByText(id)).toBeDefined();
    }
  });

  it("has a close button with aria-label", async () => {
    const { MobileMenu } = await import("@/components/layout/MobileMenu");
    render(<MobileMenu isOpen={true} onClose={() => {}} />);
    expect(
      screen.getByRole("button", { name: "close_menu" }),
    ).toBeDefined();
  });

  it("calls onClose when close button is clicked", async () => {
    const { MobileMenu } = await import("@/components/layout/MobileMenu");
    const onClose = vi.fn();
    render(<MobileMenu isOpen={true} onClose={onClose} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "close_menu" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape is pressed", async () => {
    const { MobileMenu } = await import("@/components/layout/MobileMenu");
    const onClose = vi.fn();
    render(<MobileMenu isOpen={true} onClose={onClose} />);
    const user = userEvent.setup();

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("sets body overflow to hidden when open", async () => {
    const { MobileMenu } = await import("@/components/layout/MobileMenu");
    render(<MobileMenu isOpen={true} onClose={() => {}} />);
    expect(document.body.style.overflow).toBe("hidden");
  });
});

// ---------------------------------------------------------------------------
// LanguageSwitcher
// ---------------------------------------------------------------------------
describe("LanguageSwitcher", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders a trigger button with aria-label and aria-haspopup", async () => {
    const { LanguageSwitcher } = await import(
      "@/components/layout/LanguageSwitcher"
    );
    render(<LanguageSwitcher />);
    const trigger = screen.getByRole("button", { name: "title" });
    expect(trigger).toBeDefined();
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
  });

  it("displays the current locale code", async () => {
    const { LanguageSwitcher } = await import(
      "@/components/layout/LanguageSwitcher"
    );
    render(<LanguageSwitcher />);
    // The locale is "de", displayed uppercase as "DE" (split on "-" takes first part)
    expect(screen.getByText("de")).toBeDefined();
  });

  it("opens the language modal when trigger is clicked", async () => {
    const { LanguageSwitcher } = await import(
      "@/components/layout/LanguageSwitcher"
    );
    render(<LanguageSwitcher />);
    const user = userEvent.setup();

    expect(screen.queryByRole("dialog")).toBeNull();

    await user.click(screen.getByRole("button", { name: "title" }));

    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("modal has role=dialog and aria-modal=true", async () => {
    const { LanguageSwitcher } = await import(
      "@/components/layout/LanguageSwitcher"
    );
    render(<LanguageSwitcher />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "title" }));

    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
  });

  it("active locale button has aria-current=true", async () => {
    const { LanguageSwitcher } = await import(
      "@/components/layout/LanguageSwitcher"
    );
    render(<LanguageSwitcher />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "title" }));

    // Find the Deutsch button (active locale = "de")
    const deutschButton = screen.getByText("Deutsch").closest("button")!;
    expect(deutschButton.getAttribute("aria-current")).toBe("true");
  });

  it("clicking a locale button updates locale cookie and closes modal", async () => {
    const { LanguageSwitcher } = await import(
      "@/components/layout/LanguageSwitcher"
    );
    render(<LanguageSwitcher />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "title" }));

    // Click English
    const englishButton = screen.getByText("English").closest("button")!;
    await user.click(englishButton);

    await waitFor(() => {
      expect(document.cookie).toContain("NEXT_LOCALE=en");
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("closes modal when Escape is pressed", async () => {
    const { LanguageSwitcher } = await import(
      "@/components/layout/LanguageSwitcher"
    );
    render(<LanguageSwitcher />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "title" }));
    expect(screen.getByRole("dialog")).toBeDefined();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("has a close button in the modal", async () => {
    const { LanguageSwitcher } = await import(
      "@/components/layout/LanguageSwitcher"
    );
    render(<LanguageSwitcher />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "title" }));

    const closeButton = screen.getByRole("button", { name: "close" });
    expect(closeButton).toBeDefined();

    await user.click(closeButton);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
