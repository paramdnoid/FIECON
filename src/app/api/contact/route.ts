import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactBody = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function POST(request: Request) {
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

  // Validation
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "All fields are required" },
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
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, CONTACT_TO } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error("Missing SMTP environment variables");
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 503 },
    );
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const recipient = CONTACT_TO || "fiegler-fiecon-consulting@e.mail.de";

  try {
    await transporter.sendMail({
      from: SMTP_FROM || SMTP_USER,
      to: recipient,
      replyTo: `${name} <${email}>`,
      subject: `[FIECON Kontakt] ${subject}`,
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

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
