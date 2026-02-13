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
  const cspDirectives = [
    "default-src 'self'",
    // 'strict-dynamic' trusts scripts loaded by nonced scripts.
    // 'unsafe-inline' is ignored by browsers that support nonces but acts as fallback for older ones.
    // 'unsafe-eval' is needed in development for React Fast Refresh / HMR.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // Tailwind CSS is in external files ('self'). Motion/React use inline style
    // attributes for animations – nonces don't apply to style="..." attributes,
    // only to <style> tags. 'unsafe-inline' for styles has limited security impact.
    `style-src 'self' 'unsafe-inline'`,
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self' https://*.ingest.sentry.io",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  // Pass nonce to Next.js so it can inject it into <script> tags
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  // Set security headers on the response
  response.headers.set("Content-Security-Policy", cspDirectives);
  response.headers.set("x-nonce", nonce);

  return response;
}

export const config = {
  matcher: ["/((?!_next|api|team|logo\\.svg|favicon|apple-touch|og-image|icon\\.svg|robots\\.txt|sitemap\\.xml|google[a-z0-9]+\\.html).*)"],
};
