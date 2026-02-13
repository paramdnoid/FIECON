import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  allowedDevOrigins: process.env.DEV_HOST
    ? [`${process.env.DEV_HOST}:3000`]
    : [],
  /**
   * Security headers applied to every response.
   *
   * Note: The Content-Security-Policy header is set dynamically in
   * middleware.ts with a unique nonce per request. This allows strict
   * CSP without 'unsafe-inline' (nonce-based approach).
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
        ],
      },
    ];
  },
};

export default withSentryConfig(withNextIntl(nextConfig), {
  // Suppress source map upload logs during build
  silent: true,

  // Upload source maps for better stack traces (requires SENTRY_AUTH_TOKEN)
  widenClientFileUpload: true,

  // Configure source maps: upload to Sentry but don't expose to users
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
});
