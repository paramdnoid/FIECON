import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  mockMotionReact,
  mockNextImage,
  mockNextIntl,
  mockNextIntlServer,
  mockNavigation,
} from "./test-utils/mocks";

// ---------------------------------------------------------------------------
// Mocks
//
// getTranslations is stubbed to echo the key, so the assertions below double as
// a check on *which* translation keys the page reads.
// ---------------------------------------------------------------------------
mockNextIntl();
mockNextIntlServer();
mockMotionReact();
mockNextImage();
mockNavigation();

const NOT_FOUND = new Error("NEXT_NOT_FOUND");

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw NOT_FOUND;
  },
  useRouter: () => ({ push: vi.fn() }),
  redirect: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: async () => ({
    get: (name: string) => (name === "x-nonce" ? "test-nonce-123" : null),
  }),
}));

vi.mock("@/hooks/useContactDialog", () => ({
  useContactDialog: () => ({ open: vi.fn(), close: vi.fn(), isOpen: false }),
}));

const page = await import("@/app/[locale]/team/[slug]/page");
const TeamMemberPage = page.default;
const { generateStaticParams, generateMetadata } = page;

function params(slug: string, locale = "de") {
  return { params: Promise.resolve({ locale, slug }) };
}

async function renderProfile(slug = "rene-marquard") {
  return render(await TeamMemberPage(params(slug)));
}

function jsonLd(container: HTMLElement) {
  return [...container.querySelectorAll('script[type="application/ld+json"]')];
}

// ---------------------------------------------------------------------------
// Routing
// ---------------------------------------------------------------------------
describe("team profile — routing", () => {
  it("generates a param for every configured member", () => {
    const slugs = generateStaticParams().map((p) => p.slug);

    expect(slugs).toContain("rene-marquard");
    expect(slugs).toContain("peter-fiegler");
    expect(slugs).toContain("andre-zimmermann");
  });

  it("404s on an unknown slug instead of rendering an empty profile", async () => {
    await expect(TeamMemberPage(params("nobody"))).rejects.toBe(NOT_FOUND);
  });
});

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------
describe("team profile — metadata", () => {
  it("returns empty metadata for an unknown slug", async () => {
    expect(await generateMetadata(params("nobody"))).toEqual({});
  });

  it("builds title, canonical and social metadata from the member namespace", async () => {
    const meta = await generateMetadata(params("rene-marquard"));

    expect(meta.title).toContain("meta_title");
    expect(meta.description).toBe("meta_description");
    // openGraph/twitter are discriminated unions in Next's Metadata type, so
    // narrow to the fields under test rather than indexing the base type
    const og = meta.openGraph as { url?: string; type?: string } | undefined;
    const twitter = meta.twitter as { card?: string } | undefined;

    expect(meta.alternates?.canonical).toBe("/de/team/rene-marquard");
    expect(og?.url).toBe("/de/team/rene-marquard");
    expect(og?.type).toBe("profile");
    expect(twitter?.card).toBe("summary");
  });

  it("keeps the canonical in the requested locale", async () => {
    const meta = await generateMetadata(params("rene-marquard", "ar"));

    expect(meta.alternates?.canonical).toBe("/ar/team/rene-marquard");
  });
});

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
describe("team profile — rendering", () => {
  it("renders the profile sections", async () => {
    await renderProfile();

    expect(screen.getByText("hero_name")).toBeDefined();
    expect(screen.getByText("hero_role")).toBeDefined();
    expect(screen.getByText("bio_1")).toBeDefined();
    expect(screen.getByText("bio_2")).toBeDefined();
    expect(screen.getByText("bio_3")).toBeDefined();
    expect(screen.getByText("competencies_headline")).toBeDefined();
    expect(screen.getByText("cta_headline")).toBeDefined();
  });

  it("renders one card per configured competency, in order", async () => {
    await renderProfile();

    for (const i of [1, 2, 3, 4]) {
      expect(screen.getByText(`competency_${i}_title`)).toBeDefined();
      expect(screen.getByText(`competency_${i}_description`)).toBeDefined();
    }
    // The config defines exactly four — a fifth would mean an unlabelled card
    expect(screen.queryByText("competency_5_title")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Structured data
// ---------------------------------------------------------------------------
describe("team profile — JSON-LD", () => {
  it("emits Person and BreadcrumbList schemas", async () => {
    const { container } = await renderProfile();
    const types = jsonLd(container).map(
      (s) => JSON.parse(s.textContent ?? "{}")["@type"],
    );

    expect(types).toContain("Person");
    expect(types).toContain("BreadcrumbList");
  });

  it("carries the CSP nonce so the strict policy does not block the schemas", async () => {
    const { container } = await renderProfile();
    const scripts = jsonLd(container);

    expect(scripts.length).toBeGreaterThan(0);
    for (const script of scripts) {
      expect(script.getAttribute("nonce")).toBe("test-nonce-123");
    }
  });

  it("describes the member with the languages from the page config", async () => {
    const { container } = await renderProfile();
    const person = jsonLd(container)
      .map((s) => JSON.parse(s.textContent ?? "{}"))
      .find((d) => d["@type"] === "Person");

    expect(person.name).toBe("René Marquard");
    expect(person.jobTitle).toBe("hero_role");
    expect(person.knowsLanguage).toEqual(["de", "en"]);
    expect(person.worksFor["@type"]).toBe("Organization");
  });
});
