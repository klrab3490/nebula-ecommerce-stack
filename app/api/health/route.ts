"use server";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Health Check Endpoint
 *
 * GET /api/health
 *
 * Returns the health status of the application and its dependencies.
 * Useful for monitoring, load balancers, and DevOps tooling.
 *
 * Response:
 * {
 *   "status": "healthy" | "degraded" | "unhealthy",
 *   "timestamp": "2025-12-06T10:30:00.000Z",
 *   "uptime": 123456,
 *   "services": {
 *     "database": { "status": "up" | "down", "responseTime": 123 },
 *     "api": { "status": "up" }
 *   },
 *   "version": "0.2.0"
 * }
 */
export async function GET() {
  try {
    // Check database connectivity
    let databaseStatus = "down";
    let databaseResponseTime = 0;
    const dbCheckStart = Date.now();

    try {
      // Simple query to check database connection (MongoDB-compatible)
      await prisma.user.findFirst();
      databaseStatus = "up";
      databaseResponseTime = Date.now() - dbCheckStart;
    } catch (dbError) {
      console.error("Database health check failed:", dbError);
      databaseStatus = "down";
      databaseResponseTime = Date.now() - dbCheckStart;
    }

    // Determine overall health status
    const overallStatus = databaseStatus === "up" ? "healthy" : "degraded";

    const healthData = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(), // Server uptime in seconds
      services: {
        database: {
          status: databaseStatus,
          responseTime: databaseResponseTime,
        },
        api: {
          status: "up",
        },
      },
      version: process.env.npm_package_version || "0.2.0",
      environment: process.env.NODE_ENV || "development",
    };

    // Return appropriate status code based on health
    const statusCode = overallStatus === "healthy" ? 200 : 503;

    return NextResponse.json(healthData, { status: statusCode });
  } catch (error) {
    console.error("Health check error:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        error: error instanceof Error ? error.message : "Unknown error",
        services: {
          database: { status: "unknown" },
          api: { status: "down" },
        },
        version: process.env.npm_package_version || "0.2.0",
      },
      { status: 503 }
    );
  }
}
