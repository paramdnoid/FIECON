import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("motion/react", () => {
  function filterDomProps(props: Record<string, unknown>) {
    const blocked = new Set([
      "initial", "animate", "exit", "transition", "variants",
      "whileHover", "whileTap", "layout",
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
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
    useReducedMotion: () => false,
  };
});

vi.mock("@/hooks/useFocusTrap", () => ({
  useFocusTrap: () => ({ current: null }),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function renderDialog() {
  const { ContactDialog } = await import("@/components/ui/ContactDialog");
  const onClose = vi.fn();
  const result = render(<ContactDialog open={true} onClose={onClose} />);
  return { ...result, onClose };
}

function fillForm() {
  fireEvent.change(screen.getByLabelText("name"), {
    target: { value: "Test User" },
  });
  fireEvent.change(screen.getByLabelText("email"), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByLabelText("subject"), {
    target: { value: "Test Subject" },
  });
  fireEvent.change(screen.getByLabelText("message"), {
    target: { value: "Test message content" },
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("ContactDialog form flow", () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows validation errors when submitting empty form", async () => {
    await renderDialog();
    const user = userEvent.setup();

    const submitButton = screen.getByRole("button", { name: "submit" });
    await user.click(submitButton);

    // All four fields should show "required" error text
    const errorMessages = document.querySelectorAll("[id$='-error']");
    expect(errorMessages.length).toBe(4);
    for (const el of errorMessages) {
      expect(el.textContent).toBe("required");
    }
  });

  it("shows invalid email error for bad email format", async () => {
    await renderDialog();
    const user = userEvent.setup();

    // Fill name, subject, message but use bad email
    fireEvent.change(screen.getByLabelText("name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText("email"), { target: { value: "not-an-email" } });
    fireEvent.change(screen.getByLabelText("subject"), { target: { value: "Subject" } });
    fireEvent.change(screen.getByLabelText("message"), { target: { value: "Message" } });

    await user.click(screen.getByRole("button", { name: "submit" }));

    const emailError = document.getElementById("contact-email-error");
    expect(emailError?.textContent).toBe("invalid_email");
  });

  it("shows success view after successful submission", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Sent" }),
    });

    await renderDialog();
    const user = userEvent.setup();
    fillForm();

    await user.click(screen.getByRole("button", { name: "submit" }));

    await waitFor(() => {
      // success_title appears in both the aria-live region and the SuccessView h3
      expect(screen.getAllByText("success_title").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("shows error view on server error (500)", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await renderDialog();
    const user = userEvent.setup();
    fillForm();

    await user.click(screen.getByRole("button", { name: "submit" }));

    await waitFor(() => {
      // error_title appears in both the aria-live region and the ErrorView h3
      expect(screen.getAllByText("error_title").length).toBeGreaterThanOrEqual(1);
    });

    // Error text is the server error message
    expect(screen.getByText("error_text")).toBeDefined();

    // Retry button returns to form
    await user.click(screen.getByRole("button", { name: "retry" }));
    expect(screen.getByLabelText("name")).toBeDefined();
  });

  it("shows rate limit error on 429 response", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 429,
    });

    await renderDialog();
    const user = userEvent.setup();
    fillForm();

    await user.click(screen.getByRole("button", { name: "submit" }));

    await waitFor(() => {
      expect(screen.getByText("error_rate_limit_text")).toBeDefined();
    });
  });

  it("shows network error when fetch rejects", async () => {
    fetchSpy.mockRejectedValueOnce(new TypeError("Failed to fetch"));

    await renderDialog();
    const user = userEvent.setup();
    fillForm();

    await user.click(screen.getByRole("button", { name: "submit" }));

    await waitFor(() => {
      expect(screen.getByText("error_network_text")).toBeDefined();
    });
  });

  it("shows timeout error when fetch aborts", async () => {
    const abortError = new DOMException("Aborted", "AbortError");
    fetchSpy.mockRejectedValueOnce(abortError);

    await renderDialog();
    const user = userEvent.setup();
    fillForm();

    await user.click(screen.getByRole("button", { name: "submit" }));

    await waitFor(() => {
      expect(screen.getByText("error_timeout_text")).toBeDefined();
    });
  });

  it("disables submit button during sending", async () => {
    // Create a promise we control to keep fetch pending
    let resolveFetch!: (value: unknown) => void;
    fetchSpy.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveFetch = resolve;
      }),
    );

    await renderDialog();
    const user = userEvent.setup();
    fillForm();

    await user.click(screen.getByRole("button", { name: "submit" }));

    // Button should be disabled while sending
    await waitFor(() => {
      const buttons = screen.getAllByRole("button");
      const sendingButton = buttons.find((b) => b.textContent?.includes("sending"));
      expect(sendingButton).toBeDefined();
      expect(sendingButton?.hasAttribute("disabled")).toBe(true);
    });

    // Resolve to clean up
    resolveFetch({ ok: true, json: async () => ({}) });
  });

  it("locks body scroll when open", async () => {
    await renderDialog();
    expect(document.body.style.overflow).toBe("hidden");
  });
});
