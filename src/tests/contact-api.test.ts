import { describe, it, expect, vi, beforeEach } from "vitest";
import { escapeHtml } from "@/lib/utils";

const mockEnv = {
  NODE_ENV: "test",
  SMTP_HOST: "smtp.test.com",
  SMTP_PORT: 587,
  SMTP_USER: "user@test.com",
  SMTP_PASS: "password123",
  SMTP_FROM: undefined as string | undefined,
  CONTACT_TO: "test@example.com",
  SITE_URL: "https://www.fiecon-consulting.eu",
  GOOGLE_SITE_VERIFICATION: undefined as string | undefined,
  NEXT_PUBLIC_SENTRY_DSN: undefined as string | undefined,
  SENTRY_AUTH_TOKEN: undefined as string | undefined,
  ANALYZE: undefined as string | undefined,
  DEV_HOST: undefined as string | undefined,
};

vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: "test-id" }),
    })),
  },
}));

vi.mock("@/lib/env", () => ({ env: mockEnv }));

const { POST } = await import("@/app/api/contact/route");

function makeRequest(body: Record<string, unknown>, ip = "127.0.0.1") {
  return new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

const validBody = {
  name: "Max Mustermann",
  email: "max@example.com",
  subject: "Anfrage",
  message: "Hallo, ich habe eine Frage.",
};

describe("escapeHtml", () => {
  it("escapes ampersands", () => {
    expect(escapeHtml("foo & bar")).toBe("foo &amp; bar");
  });

  it("escapes angle brackets", () => {
    expect(escapeHtml("<script>alert('xss')</script>")).toBe(
      "&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;"
    );
  });

  it("escapes double quotes", () => {
    expect(escapeHtml('"hello"')).toBe("&quot;hello&quot;");
  });

  it("handles strings with no special characters", () => {
    expect(escapeHtml("hello world")).toBe("hello world");
  });

  it("handles empty string", () => {
    expect(escapeHtml("")).toBe("");
  });

  it("escapes multiple special characters together", () => {
    expect(escapeHtml('<a href="foo&bar">')).toBe(
      "&lt;a href=&quot;foo&amp;bar&quot;&gt;"
    );
  });
});

describe("POST /api/contact", () => {
  beforeEach(() => {
    mockEnv.SMTP_HOST = "smtp.test.com";
    mockEnv.SMTP_PORT = 587;
    mockEnv.SMTP_USER = "user@test.com";
    mockEnv.SMTP_PASS = "password123";
    mockEnv.CONTACT_TO = "test@example.com";
  });

  it("returns 415 for missing Content-Type header", async () => {
    const req = new Request("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "x-forwarded-for": "10.0.0.1" },
      body: "not json",
    });
    const res = await POST(req);
    expect(res.status).toBe(415);
    const json = await res.json();
    expect(json.error).toBe("Content-Type must be application/json");
  });

  it("returns 400 for invalid JSON body", async () => {
    const req = new Request("http://localhost:3000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "10.0.0.1",
      },
      body: "not json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Invalid request body");
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await POST(
      makeRequest({ name: "", email: "", subject: "", message: "" }, "10.0.0.2")
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("All fields are required");
  });

  it("returns 400 when fields are whitespace only", async () => {
    const res = await POST(
      makeRequest(
        { name: "  ", email: "  ", subject: "  ", message: "  " },
        "10.0.0.3"
      )
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("All fields are required");
  });

  it("returns 400 for invalid email format", async () => {
    const res = await POST(
      makeRequest({ ...validBody, email: "not-an-email" }, "10.0.0.4")
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Invalid email address");
  });

  it("returns 400 when name exceeds max length", async () => {
    const res = await POST(
      makeRequest({ ...validBody, name: "a".repeat(201) }, "10.0.0.5")
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Input exceeds maximum length");
  });

  it("returns 400 when message exceeds max length", async () => {
    const res = await POST(
      makeRequest({ ...validBody, message: "a".repeat(5001) }, "10.0.0.6")
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Input exceeds maximum length");
  });

  it("returns 503 when SMTP is not configured", async () => {
    mockEnv.SMTP_HOST = undefined;
    const res = await POST(makeRequest(validBody, "10.0.0.7"));
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toBe("Email service not configured");
  });

  it("returns success for valid request", async () => {
    const res = await POST(makeRequest(validBody, "10.0.0.8"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it("returns 429 after exceeding rate limit", async () => {
    const ip = "10.0.0.9";
    // Send 5 requests (the limit)
    for (let i = 0; i < 5; i++) {
      await POST(makeRequest(validBody, ip));
    }
    // 6th request should be rate limited
    const res = await POST(makeRequest(validBody, ip));
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.error).toBe("Too many requests");
  });
});
