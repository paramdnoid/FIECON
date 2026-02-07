import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormField } from "@/components/ui/FormField";

// ---------------------------------------------------------------------------
// Mocks required for ContactDialog (next-intl, framer-motion, custom hooks)
// ---------------------------------------------------------------------------
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("motion/react", () => {
  const Passthrough = ({
    children,
    ...rest
  }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div {...filterDomProps(rest)}>{children}</div>
  );

  // Strip non-DOM props that framer-motion would normally consume
  function filterDomProps(props: Record<string, unknown>) {
    const blocked = new Set([
      "initial",
      "animate",
      "exit",
      "transition",
      "variants",
      "whileHover",
      "whileTap",
      "layout",
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
        // Return a passthrough component that renders a plain <div>
        // regardless of the original element type (motion.div, motion.section, etc.)
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
    useReducedMotion: () => false,
  };
});

vi.mock("@/hooks/useFocusTrap", () => ({
  useFocusTrap: () => ({ current: null }),
}));

// ---------------------------------------------------------------------------
// FormField — label / aria-invalid / aria-describedby
// ---------------------------------------------------------------------------
describe("FormField accessibility", () => {
  it("associates label with input via htmlFor/id", () => {
    render(
      <FormField
        id="name"
        label="Name"
        placeholder="Enter name"
        value=""
        onChange={() => {}}
      />,
    );
    const input = screen.getByLabelText("Name");
    expect(input).toBeDefined();
    expect(input.getAttribute("id")).toBe("name");
  });

  it("marks input as aria-invalid when error is present", () => {
    render(
      <FormField
        id="email"
        label="Email"
        placeholder="you@example.com"
        value=""
        error="Required"
        onChange={() => {}}
      />,
    );
    const input = screen.getByLabelText("Email");
    expect(input.getAttribute("aria-invalid")).toBe("true");
  });

  it("does not mark input as aria-invalid when no error", () => {
    render(
      <FormField
        id="email"
        label="Email"
        placeholder="you@example.com"
        value="a@b.de"
        onChange={() => {}}
      />,
    );
    const input = screen.getByLabelText("Email");
    expect(input.getAttribute("aria-invalid")).toBe("false");
  });

  it("links error message to input via aria-describedby", () => {
    render(
      <FormField
        id="email"
        label="Email"
        placeholder="you@example.com"
        value=""
        error="Invalid email"
        onChange={() => {}}
      />,
    );
    const input = screen.getByLabelText("Email");
    expect(input.getAttribute("aria-describedby")).toBe("email-error");

    const errorEl = document.getElementById("email-error");
    expect(errorEl).not.toBeNull();
    expect(errorEl?.textContent).toBe("Invalid email");
  });

  it("omits aria-describedby when there is no error", () => {
    render(
      <FormField
        id="name"
        label="Name"
        placeholder="Enter"
        value="Test"
        onChange={() => {}}
      />,
    );
    const input = screen.getByLabelText("Name");
    expect(input.hasAttribute("aria-describedby")).toBe(false);
  });

  it("renders a textarea for multiline fields", () => {
    render(
      <FormField
        id="msg"
        label="Message"
        placeholder="Your message"
        value=""
        multiline
        onChange={() => {}}
      />,
    );
    const textarea = screen.getByLabelText("Message");
    expect(textarea.tagName).toBe("TEXTAREA");
  });
});

// ---------------------------------------------------------------------------
// ContactDialog — dialog role, ARIA, Escape, live region
// ---------------------------------------------------------------------------
describe("ContactDialog accessibility", () => {
  // Import after mocks are in place
  async function renderDialog(props: { open: boolean; onClose: () => void }) {
    const { ContactDialog } = await import(
      "@/components/ui/ContactDialog"
    );
    return render(<ContactDialog {...props} />);
  }

  it("renders with role=dialog and aria-modal", async () => {
    await renderDialog({ open: true, onClose: () => {} });

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeDefined();
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.getAttribute("aria-label")).toBe("title");
  });

  it("contains an aria-live region for status announcements", async () => {
    const { container } = await renderDialog({
      open: true,
      onClose: () => {},
    });

    const live = container.querySelector('[aria-live="polite"]');
    expect(live).not.toBeNull();
    expect(live?.getAttribute("aria-atomic")).toBe("true");
    expect(live?.classList.contains("sr-only")).toBe(true);
  });

  it("closes the dialog when Escape is pressed", async () => {
    const onClose = vi.fn();
    await renderDialog({ open: true, onClose });

    const user = userEvent.setup();
    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not render dialog content when closed", async () => {
    await renderDialog({ open: false, onClose: () => {} });

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("has accessible close buttons with aria-label", async () => {
    await renderDialog({ open: true, onClose: () => {} });

    const closeButtons = screen.getAllByRole("button", { name: "close" });
    expect(closeButtons.length).toBeGreaterThanOrEqual(1);
  });

  it("has all form fields with associated labels", async () => {
    await renderDialog({ open: true, onClose: () => {} });

    // All four fields should be reachable by their translated label key
    expect(screen.getByLabelText("name")).toBeDefined();
    expect(screen.getByLabelText("email")).toBeDefined();
    expect(screen.getByLabelText("subject")).toBeDefined();
    expect(screen.getByLabelText("message")).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// CloseButton — standalone a11y
// ---------------------------------------------------------------------------
describe("CloseButton accessibility", () => {
  it("has aria-label matching the label prop", async () => {
    const { CloseButton } = await import("@/components/ui/CloseButton");
    render(<CloseButton onClick={() => {}} label="Schließen" />);

    const btn = screen.getByRole("button", { name: "Schließen" });
    expect(btn).toBeDefined();
  });
});
