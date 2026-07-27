import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * Middleware that:
 * 1. Handles locale routing via next-intl
 * 2. Forwards the URL locale so the root layout can set <html lang/dir>
 * 3. Generates a unique CSP nonce per request
 * 4. Sets strict Content-Security-Policy headers
 */
export default function middleware(request: NextRequest) {
  // Run the next-intl middleware first
  const response = intlMiddleware(request);

  // The root layout renders <html> but sits above the [locale] segment, so
  // getLocale() there resolves before the request locale is set and would
  // always fall back to the default. Pass the locale from the URL instead.
  const segment = request.nextUrl.pathname.split("/")[1];
  if ((routing.locales as readonly string[]).includes(segment)) {
    response.headers.set("x-locale", segment);
  }

  // Generate a unique nonce for this request
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // Build the CSP directives
  const isDev = process.env.NODE_ENV === "development";
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'unsafe-inline'`,
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self' https://*.ingest.sentry.io",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];
  if (!isDev) {
    directives.push("upgrade-insecure-requests");
  }
  const cspDirectives = directives.join("; ");

  // Set security headers on the response
  response.headers.set("Content-Security-Policy", cspDirectives);
  response.headers.set("x-nonce", nonce);

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
