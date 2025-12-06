import { NextRequest, NextResponse } from "next/server";

/**
 * Simple In-Memory Rate Limiter
 *
 * For production, migrate to Redis using:
 * - upstash-ratelimit
 * - @vercel/edge-rate-limit
 * - ioredis with custom implementation
 */

interface RateLimitConfig {
  /**
   * Unique identifier for this rate limit
   * e.g., "auth-login", "payment-verify", "api-general"
   */
  id: string;

  /**
   * Maximum number of requests allowed
   */
  limit: number;

  /**
   * Time window in milliseconds
   */
  windowMs: number;

  /**
   * Custom message to return when rate limited
   */
  message?: string;
}

interface RequestRecord {
  count: number;
  resetTime: number;
}

// In-memory store for rate limit data
// For production, replace with Redis
const rateLimitStore = new Map<string, RequestRecord>();

/**
 * Get client identifier from request
 * Uses IP address or user ID from headers
 */
function getClientId(req: NextRequest): string {
  // Try to get IP from various headers (works with proxies)
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0] || realIp || "unknown";

  // For authenticated routes, you can also use user ID from session/token
  // const userId = req.headers.get("x-user-id");
  // return userId || ip;

  return ip;
}

/**
 * Clean up expired entries from store
 * Called periodically to prevent memory leaks
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Cleanup every 5 minutes
setInterval(cleanupExpiredEntries, 5 * 60 * 1000);

/**
 * Check if request should be rate limited
 *
 * Returns:
 * - null if allowed
 * - NextResponse with 429 status if rate limited
 */
export function checkRateLimit(req: NextRequest, config: RateLimitConfig): NextResponse | null {
  const clientId = getClientId(req);
  const key = `${config.id}:${clientId}`;
  const now = Date.now();

  // Get or create record for this client
  let record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // First request or window expired, create new record
    record = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, record);
    return null; // Allow request
  }

  // Window is still active
  if (record.count >= config.limit) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);

    return NextResponse.json(
      {
        error: "TooManyRequests",
        message: config.message || "Too many requests, please try again later",
        statusCode: 429,
        retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
          "X-RateLimit-Limit": config.limit.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": new Date(record.resetTime).toISOString(),
        },
      }
    );
  }

  // Increment count and allow request
  record.count++;
  rateLimitStore.set(key, record);

  return null; // Allow request
}

/**
 * Rate limiting middleware wrapper for API routes
 *
 * Usage:
 * ```ts
 * export async function POST(req: NextRequest) {
 *   const rateLimit = checkRateLimit(req, {
 *     id: "auth-login",
 *     limit: 5,
 *     windowMs: 15 * 60 * 1000, // 15 minutes
 *   });
 *
 *   if (rateLimit) return rateLimit;
 *
 *   // Process request...
 * }
 * ```
 */

/**
 * Higher-order function to wrap API handlers with rate limiting
 *
 * Usage:
 * ```ts
 * export const POST = withRateLimit(
 *   async (req: NextRequest) => {
 *     // Your handler code
 *   },
 *   {
 *     id: "auth-login",
 *     limit: 5,
 *     windowMs: 15 * 60 * 1000,
 *   }
 * );
 * ```
 */
export function withRateLimit<T extends (...args: any[]) => Promise<Response>>(
  handler: T,
  config: RateLimitConfig
): T {
  return (async (...args: any[]) => {
    const req = args[0] as NextRequest;

    // Check rate limit
    const rateLimitResponse = checkRateLimit(req, config);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Process request
    return await handler(...args);
  }) as T;
}

/**
 * Pre-configured rate limit configs for common use cases
 */
export const RateLimitPresets = {
  /**
   * Authentication routes (login, register)
   * 5 requests per 15 minutes
   */
  AUTH: {
    id: "auth",
    limit: 5,
    windowMs: 15 * 60 * 1000,
    message: "Too many authentication attempts. Please try again in 15 minutes.",
  },

  /**
   * Payment routes (create order, verify payment)
   * 10 requests per 1 minute
   */
  PAYMENT: {
    id: "payment",
    limit: 10,
    windowMs: 60 * 1000,
    message: "Too many payment requests. Please try again in a minute.",
  },

  /**
   * Webhook routes
   * 100 requests per 1 minute
   */
  WEBHOOK: {
    id: "webhook",
    limit: 100,
    windowMs: 60 * 1000,
    message: "Webhook rate limit exceeded.",
  },

  /**
   * Public API routes
   * 100 requests per 15 minutes
   */
  API_GENERAL: {
    id: "api-general",
    limit: 100,
    windowMs: 15 * 60 * 1000,
    message: "API rate limit exceeded. Please try again later.",
  },

  /**
   * Search/Filter routes
   * 30 requests per 1 minute
   */
  SEARCH: {
    id: "search",
    limit: 30,
    windowMs: 60 * 1000,
    message: "Too many search requests. Please slow down.",
  },

  /**
   * Contact/Support routes
   * 3 requests per 1 hour
   */
  CONTACT: {
    id: "contact",
    limit: 3,
    windowMs: 60 * 60 * 1000,
    message: "Too many contact form submissions. Please try again in an hour.",
  },
} as const;

/**
 * Get rate limit statistics for monitoring
 */
export function getRateLimitStats() {
  const stats = {
    totalKeys: rateLimitStore.size,
    activeClients: new Set<string>(),
    byRateLimitId: {} as Record<string, number>,
  };

  for (const [key] of rateLimitStore.entries()) {
    const [rateLimitId, clientId] = key.split(":");
    stats.activeClients.add(clientId);

    if (!stats.byRateLimitId[rateLimitId]) {
      stats.byRateLimitId[rateLimitId] = 0;
    }
    stats.byRateLimitId[rateLimitId]++;
  }

  return {
    ...stats,
    activeClients: stats.activeClients.size,
  };
}
