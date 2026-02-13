import { NextResponse } from "next/server";

/**
 * Health-check endpoint for uptime monitoring and load balancers.
 * Returns 200 with a JSON body containing status and timestamp.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? "unknown",
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
}
