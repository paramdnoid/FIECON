import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("returns 200 with status ok", async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(body.timestamp).toBeDefined();
    expect(typeof body.timestamp).toBe("string");
  });

  it("returns no-cache headers", async () => {
    const response = await GET();
    expect(response.headers.get("Cache-Control")).toBe(
      "no-store, no-cache, must-revalidate",
    );
  });

  it("returns version field", async () => {
    const response = await GET();
    const body = await response.json();
    expect(body.version).toBeDefined();
  });
});
