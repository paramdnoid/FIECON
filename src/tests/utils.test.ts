import { describe, it, expect, vi, beforeEach } from "vitest";
import { cn, sanitizeHeaderValue, scrollToSection, EMAIL_REGEX } from "@/lib/utils";

describe("cn", () => {
  it("joins class names with space", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("filters out falsy values", () => {
    expect(cn("foo", undefined, "bar", null, false)).toBe("foo bar");
  });

  it("returns empty string for no truthy inputs", () => {
    expect(cn(undefined, null, false)).toBe("");
  });

  it("handles single class name", () => {
    expect(cn("foo")).toBe("foo");
  });

  it("handles empty string inputs", () => {
    expect(cn("foo", "", "bar")).toBe("foo bar");
  });
});

describe("sanitizeHeaderValue", () => {
  it("removes carriage returns", () => {
    expect(sanitizeHeaderValue("hello\rworld")).toBe("helloworld");
  });

  it("removes newlines", () => {
    expect(sanitizeHeaderValue("hello\nworld")).toBe("helloworld");
  });

  it("removes CRLF sequences", () => {
    expect(sanitizeHeaderValue("hello\r\nBcc: evil@attacker.com")).toBe(
      "helloBcc: evil@attacker.com",
    );
  });

  it("removes tabs", () => {
    expect(sanitizeHeaderValue("hello\tworld")).toBe("helloworld");
  });

  it("trims whitespace", () => {
    expect(sanitizeHeaderValue("  hello  ")).toBe("hello");
  });

  it("passes through normal strings unchanged", () => {
    expect(sanitizeHeaderValue("Peter Fiegler")).toBe("Peter Fiegler");
  });

  it("handles empty string", () => {
    expect(sanitizeHeaderValue("")).toBe("");
  });
});

describe("EMAIL_REGEX", () => {
  it("accepts standard email addresses", () => {
    expect(EMAIL_REGEX.test("user@example.com")).toBe(true);
    expect(EMAIL_REGEX.test("max.mustermann@fiecon.de")).toBe(true);
    expect(EMAIL_REGEX.test("info+tag@company.co.uk")).toBe(true);
  });

  it("rejects emails without TLD of at least 2 characters", () => {
    expect(EMAIL_REGEX.test("user@example.c")).toBe(false);
  });

  it("rejects emails without @ sign", () => {
    expect(EMAIL_REGEX.test("not-an-email")).toBe(false);
  });

  it("rejects emails with spaces", () => {
    expect(EMAIL_REGEX.test("user @example.com")).toBe(false);
    expect(EMAIL_REGEX.test("user@ example.com")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(EMAIL_REGEX.test("")).toBe(false);
  });
});

describe("scrollToSection", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("scrolls to element with default header offset", () => {
    const section = document.createElement("div");
    section.id = "about";
    document.body.appendChild(section);

    vi.spyOn(section, "getBoundingClientRect").mockReturnValue({
      top: 500,
      bottom: 600,
      left: 0,
      right: 0,
      width: 0,
      height: 100,
      x: 0,
      y: 500,
      toJSON: () => {},
    });

    const scrollSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    scrollToSection("about");

    expect(scrollSpy).toHaveBeenCalledWith({
      top: 500 + window.scrollY - 96,
      behavior: "smooth",
    });
  });

  it("uses special offset for services section", () => {
    const section = document.createElement("div");
    section.id = "services";
    document.body.appendChild(section);

    vi.spyOn(section, "getBoundingClientRect").mockReturnValue({
      top: 800,
      bottom: 1200,
      left: 0,
      right: 0,
      width: 0,
      height: 400,
      x: 0,
      y: 800,
      toJSON: () => {},
    });

    const scrollSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    scrollToSection("services");

    expect(scrollSpy).toHaveBeenCalledWith({
      top: 800 + window.scrollY - 20,
      behavior: "smooth",
    });
  });

  it("does nothing when element is not found", () => {
    const scrollSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    scrollToSection("nonexistent");

    expect(scrollSpy).not.toHaveBeenCalled();
  });

  it("respects custom scroll behavior", () => {
    const section = document.createElement("div");
    section.id = "contact";
    document.body.appendChild(section);

    vi.spyOn(section, "getBoundingClientRect").mockReturnValue({
      top: 300,
      bottom: 500,
      left: 0,
      right: 0,
      width: 0,
      height: 200,
      x: 0,
      y: 300,
      toJSON: () => {},
    });

    const scrollSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    scrollToSection("contact", "instant");

    expect(scrollSpy).toHaveBeenCalledWith({
      top: 300 + window.scrollY - 96,
      behavior: "instant",
    });
  });
});
