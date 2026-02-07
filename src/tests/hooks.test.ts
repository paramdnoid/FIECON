import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

// ---------------------------------------------------------------------------
// useScrollProgress
// ---------------------------------------------------------------------------
describe("useScrollProgress", () => {
  let scrollY: number;

  beforeEach(() => {
    scrollY = 0;
    Object.defineProperty(window, "scrollY", {
      get: () => scrollY,
      configurable: true,
    });
  });

  it("returns false when scrollY is 0", async () => {
    const { useScrollProgress } = await import("@/hooks/useScrollProgress");
    const { result } = renderHook(() => useScrollProgress());
    expect(result.current).toBe(false);
  });

  it("returns true when scrollY exceeds 50", async () => {
    const { useScrollProgress } = await import("@/hooks/useScrollProgress");
    const { result } = renderHook(() => useScrollProgress());

    act(() => {
      scrollY = 100;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);
  });

  it("returns false when scrollY drops back below 50", async () => {
    const { useScrollProgress } = await import("@/hooks/useScrollProgress");
    const { result } = renderHook(() => useScrollProgress());

    act(() => {
      scrollY = 100;
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(true);

    act(() => {
      scrollY = 10;
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// useFocusTrap
// ---------------------------------------------------------------------------
describe("useFocusTrap", () => {
  it("returns a ref object", async () => {
    const { useFocusTrap } = await import("@/hooks/useFocusTrap");
    const { result } = renderHook(() => useFocusTrap(false));
    expect(result.current).toHaveProperty("current");
  });

  it("traps Tab from last to first focusable element", async () => {
    const { useFocusTrap } = await import("@/hooks/useFocusTrap");

    const container = document.createElement("div");
    const btn1 = document.createElement("button");
    btn1.textContent = "First";
    const btn2 = document.createElement("button");
    btn2.textContent = "Last";
    container.append(btn1, btn2);
    document.body.appendChild(container);

    const { result } = renderHook(() => useFocusTrap(true));

    // Assign the ref manually
    Object.defineProperty(result.current, "current", {
      value: container,
      writable: true,
    });

    // Re-render to trigger effect with the ref assigned
    const { rerender } = renderHook(
      ({ active }) => {
        const ref = useFocusTrap(active);
        Object.defineProperty(ref, "current", {
          value: container,
          writable: true,
        });
        return ref;
      },
      { initialProps: { active: false } },
    );

    rerender({ active: true });

    // Focus the last button and press Tab
    btn2.focus();
    expect(document.activeElement).toBe(btn2);

    const tabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    container.dispatchEvent(tabEvent);

    expect(document.activeElement).toBe(btn1);

    document.body.removeChild(container);
  });

  it("traps Shift+Tab from first to last focusable element", async () => {
    const { useFocusTrap } = await import("@/hooks/useFocusTrap");

    const container = document.createElement("div");
    const btn1 = document.createElement("button");
    btn1.textContent = "First";
    const btn2 = document.createElement("button");
    btn2.textContent = "Last";
    container.append(btn1, btn2);
    document.body.appendChild(container);

    renderHook(
      ({ active }) => {
        const ref = useFocusTrap(active);
        Object.defineProperty(ref, "current", {
          value: container,
          writable: true,
        });
        return ref;
      },
      { initialProps: { active: true } },
    );

    btn1.focus();
    expect(document.activeElement).toBe(btn1);

    const shiftTabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    container.dispatchEvent(shiftTabEvent);

    expect(document.activeElement).toBe(btn2);

    document.body.removeChild(container);
  });

  it("does not trap focus when inactive", async () => {
    const { useFocusTrap } = await import("@/hooks/useFocusTrap");

    const container = document.createElement("div");
    const btn1 = document.createElement("button");
    btn1.textContent = "First";
    const btn2 = document.createElement("button");
    btn2.textContent = "Last";
    container.append(btn1, btn2);
    document.body.appendChild(container);

    renderHook(
      ({ active }) => {
        const ref = useFocusTrap(active);
        Object.defineProperty(ref, "current", {
          value: container,
          writable: true,
        });
        return ref;
      },
      { initialProps: { active: false } },
    );

    btn2.focus();
    const tabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    container.dispatchEvent(tabEvent);

    // Focus should NOT have changed to btn1 (no trap)
    expect(document.activeElement).toBe(btn2);

    document.body.removeChild(container);
  });
});

// ---------------------------------------------------------------------------
// useCarouselIndex
// ---------------------------------------------------------------------------
describe("useCarouselIndex", () => {
  let observeCallback: IntersectionObserverCallback;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let mockObserve: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockDisconnect = vi.fn();
    mockObserve = vi.fn();

    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: IntersectionObserverCallback) {
          observeCallback = cb;
        }
        observe = mockObserve;
        unobserve = vi.fn();
        disconnect = mockDisconnect;
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns initial activeIndex of 0", async () => {
    const { useCarouselIndex } = await import("@/hooks/useCarouselIndex");
    const { result } = renderHook(() => useCarouselIndex(3));
    expect(result.current[1]).toBe(0);
  });

  it("updates activeIndex when an item intersects", async () => {
    const { useCarouselIndex } = await import("@/hooks/useCarouselIndex");

    const container = document.createElement("div");
    const item0 = document.createElement("div");
    item0.setAttribute("data-carousel-item", "");
    const item1 = document.createElement("div");
    item1.setAttribute("data-carousel-item", "");
    container.append(item0, item1);
    document.body.appendChild(container);

    const { result } = renderHook(
      ({ count }) => {
        const [ref, index] = useCarouselIndex(count);
        Object.defineProperty(ref, "current", {
          value: container,
          writable: true,
        });
        return { ref, index };
      },
      { initialProps: { count: 2 } },
    );

    // Trigger intersection on second item
    act(() => {
      observeCallback(
        [
          {
            target: item1,
            isIntersecting: true,
            intersectionRatio: 0.6,
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    expect(result.current.index).toBe(1);

    document.body.removeChild(container);
  });

  it("disconnects observer on unmount", async () => {
    const { useCarouselIndex } = await import("@/hooks/useCarouselIndex");

    const container = document.createElement("div");
    const item = document.createElement("div");
    item.setAttribute("data-carousel-item", "");
    container.appendChild(item);
    document.body.appendChild(container);

    const { unmount } = renderHook(() => {
      const [ref] = useCarouselIndex(1);
      Object.defineProperty(ref, "current", {
        value: container,
        writable: true,
      });
      return ref;
    });

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();

    document.body.removeChild(container);
  });
});

// ---------------------------------------------------------------------------
// useActiveSection
// ---------------------------------------------------------------------------
describe("useActiveSection", () => {
  let replaceStateSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    replaceStateSpy = vi.fn();
    vi.stubGlobal("history", {
      ...window.history,
      replaceState: replaceStateSpy,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    // Clean up any created elements
    for (const id of ["about", "services", "approach", "offices", "contact"]) {
      document.getElementById(id)?.remove();
    }
  });

  it("returns empty string when no sections are visible", async () => {
    const { useActiveSection } = await import("@/hooks/useActiveSection");
    const { result } = renderHook(() => useActiveSection());
    expect(result.current).toBe("");
  });

  it("returns the section ID closest to the detection line", async () => {
    // Create section elements
    for (const id of ["about", "services", "approach", "offices", "contact"]) {
      const el = document.createElement("div");
      el.id = id;
      document.body.appendChild(el);
    }

    // Mock getBoundingClientRect for "services" to be at the detection line
    const servicesEl = document.getElementById("services")!;
    vi.spyOn(servicesEl, "getBoundingClientRect").mockReturnValue({
      top: 50, // below HEADER_HEIGHT(96) + DETECTION_OFFSET(100) = within range
      bottom: 800,
      left: 0,
      right: 0,
      width: 0,
      height: 750,
      x: 0,
      y: 50,
      toJSON: () => {},
    });

    // Other elements are far away
    for (const id of ["about", "approach", "offices", "contact"]) {
      const el = document.getElementById(id)!;
      vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
        top: 2000,
        bottom: 2500,
        left: 0,
        right: 0,
        width: 0,
        height: 500,
        x: 0,
        y: 2000,
        toJSON: () => {},
      });
    }

    const { useActiveSection } = await import("@/hooks/useActiveSection");
    const { result } = renderHook(() => useActiveSection());

    // The handler runs immediately on mount
    expect(result.current).toBe("services");
  });
});
