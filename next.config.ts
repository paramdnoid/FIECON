import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";
import withBundleAnalyzer from "@next/bundle-analyzer";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  allowedDevOrigins: process.env.DEV_HOST
    ? [`${process.env.DEV_HOST}:3000`]
    : [],

  // Prefer AVIF (smaller) with WebP fallback for image optimization
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Enable gzip compression in the Node.js server
  compress: true,

  async headers() {
    const securityHeaders = [
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
    ];

    return [
      // Security headers on all routes
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // Immutable cache for hashed static assets (JS, CSS, fonts)
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache optimized images for 1 day, serve stale for up to 7 days
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      // Cache static files in /public (favicon, og-image, etc.)
      {
        source: "/:path(favicon\\.ico|apple-touch-icon\\.png|favicon-.*\\.png|og-image\\.png|logo\\.svg)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default withSentryConfig(withAnalyzer(withNextIntl(nextConfig)), {
  // Suppress source map upload logs during build
  silent: true,

  // Upload source maps for better stack traces (requires SENTRY_AUTH_TOKEN)
  widenClientFileUpload: true,

  // Configure source maps: upload to Sentry but don't expose to users
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
});
