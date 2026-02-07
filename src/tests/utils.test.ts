import { describe, it, expect } from "vitest";
import { cn, sanitizeHeaderValue } from "@/lib/utils";

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
