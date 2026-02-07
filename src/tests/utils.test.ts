import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

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
