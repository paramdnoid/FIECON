import { z } from "zod";

const nodeEnvSchema = z.enum(["development", "production", "test"]);

const serverSchema = z
  .object({
    NODE_ENV: z
      .string()
      .optional()
      .default("development")
      .transform((v) => nodeEnvSchema.parse(v)),
    SKIP_ENV_VALIDATION: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().default(587),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    SMTP_FROM: z.string().email().optional().or(z.literal("")),
    CONTACT_TO: z.string().email().optional().or(z.literal("")),
    SITE_URL: z.string().url().default("https://www.fiecon-consulting.eu"),
    GOOGLE_SITE_VERIFICATION: z.string().optional(),
    NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional().or(z.literal("")),
    SENTRY_AUTH_TOKEN: z.string().optional(),
    ANALYZE: z.string().optional(),
    DEV_HOST: z.string().optional(),
  })
;

export type ServerEnv = z.infer<typeof serverSchema>;

const clientSchema = z.object({
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional().or(z.literal("")),
});

export type ClientEnv = z.infer<typeof clientSchema>;

function formatEnvValidationError(err: unknown): string {
  const zerr = err as { issues?: Array<{ path: (string | number)[]; message: string }> };
  const issues = zerr?.issues ?? [];
  if (issues.length === 0) return String(err);
  const lines = ["Environment validation failed:", ""];
  const pathCol = "Variable";
  const msgCol = "Error";
  const pathWidth = Math.max(pathCol.length, ...issues.map((i) => i.path.join(".").length));
  const msgWidth = Math.max(msgCol.length, ...issues.map((i) => i.message.length));
  lines.push(
    `  ${pathCol.padEnd(pathWidth)}  ${msgCol}`,
    `  ${"-".repeat(pathWidth)}  ${"-".repeat(msgWidth)}`,
  );
  for (const issue of issues) {
    const path = issue.path.length ? issue.path.join(".") : "(root)";
    lines.push(`  ${path.padEnd(pathWidth)}  ${issue.message}`);
  }
  return lines.join("\n");
}

const skipSchema = z.object({
  NODE_ENV: z
    .string()
    .optional()
    .default("development")
    .transform((v) => nodeEnvSchema.parse(v)),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  CONTACT_TO: z.string().optional(),
  SITE_URL: z.string().url().default("https://www.fiecon-consulting.eu"),
  GOOGLE_SITE_VERIFICATION: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  ANALYZE: z.string().optional(),
  DEV_HOST: z.string().optional(),
});

function getServerEnv(): ServerEnv {
  if (process.env.SKIP_ENV_VALIDATION === "true") {
    return skipSchema.parse(process.env) as ServerEnv;
  }
  try {
    return serverSchema.parse(process.env);
  } catch (err) {
    const table = formatEnvValidationError(err);
    // eslint-disable-next-line no-console
    console.error(table);
    throw err;
  }
}

function getClientEnv(): ClientEnv {
  try {
    return clientSchema.parse({
      NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    });
  } catch {
    return { NEXT_PUBLIC_SENTRY_DSN: undefined };
  }
}

export const env = getServerEnv();
export const clientEnv = getClientEnv();

if (
  env.NODE_ENV === "production" &&
  !(env.SMTP_HOST?.trim() && env.SMTP_USER?.trim() && env.SMTP_PASS && env.CONTACT_TO?.trim())
) {
  // eslint-disable-next-line no-console
  console.warn(
    "[env] SMTP_HOST, SMTP_USER, SMTP_PASS or CONTACT_TO missing — contact form will be unavailable",
  );
}
