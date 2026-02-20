import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * Middleware that:
 * 1. Handles locale routing via next-intl
 * 2. Generates a unique CSP nonce per request
 * 3. Sets strict Content-Security-Policy headers
 */
export default function middleware(request: NextRequest) {
  // Run the next-intl middleware first
  const response = intlMiddleware(request);

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

  // Pass nonce to Next.js so it can inject it into <script> tags
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  // Set security headers on the response
  response.headers.set("Content-Security-Policy", cspDirectives);
  response.headers.set("x-nonce", nonce);

  return response;
}

export const config = {
  matcher: ["/((?!_next|api|team|offices|logo\\.svg|favicon|apple-touch|og-image|icon\\.svg|robots\\.txt|sitemap\\.xml|google[a-z0-9]+\\.html).*)"],
};
