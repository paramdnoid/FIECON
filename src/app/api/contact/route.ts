import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { escapeHtml, sanitizeHeaderValue, EMAIL_REGEX } from "@/lib/utils";

type ContactBody = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

// Rate limiting: max 5 requests per minute per IP.
// NOTE: In-memory — won't persist across serverless cold starts or share
// across instances. Acceptable for a low-traffic corporate site.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const rateLimitMap = new Map<string, number[]>();

const MAX_TRACKED_IPS = 10_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) return true;

  recent.push(now);
  rateLimitMap.set(ip, recent);

  // Periodically clean up expired entries to prevent unbounded growth
  if (rateLimitMap.size > MAX_TRACKED_IPS) {
    for (const [key, ts] of rateLimitMap) {
      const valid = ts.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (valid.length === 0) rateLimitMap.delete(key);
      else rateLimitMap.set(key, valid);
      if (rateLimitMap.size <= MAX_TRACKED_IPS) break;
    }
  }

  return false;
}

let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (_transporter) return _transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = env;
  if (!SMTP_HOST?.trim() || !SMTP_USER?.trim() || !SMTP_PASS) return null;

  _transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return _transporter;
}

// Field length limits
const MAX_LENGTHS = {
  name: 200,
  email: 254,
  subject: 200,
  message: 5000,
} as const;

const ALLOWED_ORIGINS = [
  "https://www.fiecon-consulting.eu",
  "https://fiecon-consulting.eu",
];

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const headers: HeadersInit = { "X-Request-Id": requestId };

  const origin = request.headers.get("origin");
  const allowed =
    env.NODE_ENV !== "production"
      ? !origin || origin.startsWith("http://localhost:")
      : origin != null && ALLOWED_ORIGINS.includes(origin);

  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403, headers });
  }

  // Rate limiting — prefer x-real-ip (set by trusted reverse proxy)
  const ip =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",").pop()?.trim() ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { ...headers, "Retry-After": "60" } },
    );
  }

  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415, headers },
    );
  }

  let body: ContactBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400, headers },
    );
  }

  const { name, email, subject, message } = body;

  // Required fields
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400, headers },
    );
  }

  // Length limits
  if (
    name.length > MAX_LENGTHS.name ||
    email.length > MAX_LENGTHS.email ||
    subject.length > MAX_LENGTHS.subject ||
    message.length > MAX_LENGTHS.message
  ) {
    return NextResponse.json(
      { error: "Input exceeds maximum length" },
      { status: 400, headers },
    );
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400, headers },
    );
  }

  const transporter = getTransporter();
  if (!transporter) {
    logger.error("Missing SMTP environment variables", { requestId, ip });
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 503, headers },
    );
  }

  const recipient = env.CONTACT_TO?.trim();
  if (!recipient) {
    logger.error("Missing CONTACT_TO environment variable", { requestId, ip });
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 503, headers },
    );
  }

  try {
    await transporter.sendMail({
      from: env.SMTP_FROM || env.SMTP_USER || "",
      to: recipient,
      replyTo: `${sanitizeHeaderValue(name)} <${sanitizeHeaderValue(email)}>`,
      subject: `[FIECON Kontakt] ${sanitizeHeaderValue(subject)}`,
      text: [
        `Name: ${name}`,
        `E-Mail: ${email}`,
        `Betreff: ${subject}`,
        "",
        "Nachricht:",
        message,
      ].join("\n"),
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: #62191C; border-bottom: 2px solid #E0CFC2; padding-bottom: 12px;">
            Neue Kontaktanfrage
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 12px; font-weight: 600; color: #62191C; width: 120px;">Name</td>
              <td style="padding: 8px 12px;">${escapeHtml(name)}</td>
            </tr>
            <tr style="background: #FAF7F4;">
              <td style="padding: 8px 12px; font-weight: 600; color: #62191C;">E-Mail</td>
              <td style="padding: 8px 12px;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: 600; color: #62191C;">Betreff</td>
              <td style="padding: 8px 12px;">${escapeHtml(subject)}</td>
            </tr>
          </table>
          <div style="margin-top: 24px; padding: 16px; background: #FAF7F4; border-left: 3px solid #62191C; white-space: pre-wrap;">
            ${escapeHtml(message)}
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #6B6B6B;">
            Gesendet über das Kontaktformular auf fiecon-consulting.eu
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { headers });
  } catch (error) {
    logger.error("Failed to send email", {
      requestId,
      ip,
      error: error instanceof Error ? error : new Error(String(error)),
    });
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500, headers },
    );
  }
}
