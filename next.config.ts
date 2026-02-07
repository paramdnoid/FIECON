import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  allowedDevOrigins: process.env.DEV_HOST
    ? [`${process.env.DEV_HOST}:3000`]
    : [],
  /**
   * Security headers applied to every response.
   *
   * CSP NOTE — why 'unsafe-inline' is required:
   *   - script-src: Next.js injects inline <script> tags for route data,
   *     hydration, and the page bootstrap. A nonce-based approach is possible
   *     (see next.config.js `experimental.cspNonce`) but requires middleware
   *     changes and is not yet stable in Next.js 16 with App Router.
   *   - style-src: Tailwind CSS v4 injects styles via <style> tags at build
   *     time and at runtime during development. Removing 'unsafe-inline'
   *     would break all styling.
   *
   * Both directives should be revisited when Next.js stabilises nonce-based
   * CSP support. Until then, the remaining directives are kept as strict as
   * possible (default-src 'self', frame-ancestors 'none', no external
   * connect-src) to limit the attack surface.
   */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Enforce HTTPS for 1 year
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          // Disable DNS prefetching for privacy
          { key: "X-DNS-Prefetch-Control", value: "off" },
          // Prevent clickjacking: deny all framing
          { key: "X-Frame-Options", value: "DENY" },
          // Prevent MIME-type sniffing (e.g. treating a .txt as .html)
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Send full URL as referrer only to same origin; origin-only cross-origin
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disable browser features the site does not use
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",   // see note above
              "style-src 'self' 'unsafe-inline'",    // see note above
              "img-src 'self' data:",                 // data: for inline SVG/Base64
              "font-src 'self'",
              "connect-src 'self'",                   // API calls only to own origin
              "frame-ancestors 'none'",               // CSP-level framing protection
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
