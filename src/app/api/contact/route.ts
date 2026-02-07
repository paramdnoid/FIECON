import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { escapeHtml, sanitizeHeaderValue } from "@/lib/utils";

type ContactBody = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

// Rate limiting: max 5 requests per minute per IP
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

// Lazy singleton SMTP transporter
let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (_transporter) return _transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  _transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
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

export async function POST(request: Request) {
  // Rate limiting
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 },
    );
  }

  let body: ContactBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { name, email, subject, message } = body;

  // Required fields
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 },
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
      { status: 400 },
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 },
    );
  }

  // SMTP configuration
  const transporter = getTransporter();
  if (!transporter) {
    console.error("Missing SMTP environment variables");
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 503 },
    );
  }

  const recipient = process.env.CONTACT_TO || "fiegler-fiecon-consulting@e.mail.de";

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
