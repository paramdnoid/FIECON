import { describe, it, expect } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("robots()", () => {
  const result = robots();

  it("allows all user agents", () => {
    expect(result.rules).toEqual(
      expect.objectContaining({ userAgent: "*" }),
    );
  });

  it("allows crawling the root path", () => {
    expect(result.rules).toEqual(
      expect.objectContaining({ allow: "/" }),
    );
  });

  it("points to the sitemap URL", () => {
    expect(result.sitemap).toBe(
      "https://www.fiecon-consulting.eu/sitemap.xml",
    );
  });
});

describe("sitemap()", () => {
  const result = sitemap();

  it("returns exactly 3 entries", () => {
    expect(result).toHaveLength(3);
  });

  it("has the homepage as first entry with priority 1", () => {
    expect(result[0].url).toBe("https://www.fiecon-consulting.eu");
    expect(result[0].priority).toBe(1);
    expect(result[0].changeFrequency).toBe("monthly");
  });

  it("has impressum as second entry with low priority", () => {
    expect(result[1].url).toBe(
      "https://www.fiecon-consulting.eu/impressum",
    );
    expect(result[1].priority).toBe(0.3);
    expect(result[1].changeFrequency).toBe("yearly");
  });

  it("has datenschutz as third entry with low priority", () => {
    expect(result[2].url).toBe(
      "https://www.fiecon-consulting.eu/datenschutz",
    );
    expect(result[2].priority).toBe(0.3);
    expect(result[2].changeFrequency).toBe("yearly");
  });

  it("includes lastModified as Date on all entries", () => {
    for (const entry of result) {
      expect(entry.lastModified).toBeInstanceOf(Date);
    }
  });
});
