import { NextResponse } from "next/server";

export async function GET() {
  const mem = process.memoryUsage();
  const rssMb = Math.round((mem.rss / 1024 / 1024) * 100) / 100;

  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? "unknown",
      uptime: process.uptime(),
      memory: { rssMb },
      nodeVersion: process.version,
      environment: process.env.NODE_ENV,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
}
