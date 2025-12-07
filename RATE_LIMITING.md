# Rate Limiting Implementation

## Overview

Rate limiting protects your API from abuse, DDoS attacks, and excessive usage. This implementation uses an in-memory store for development and can be upgraded to Redis for production.

## How It Works

### In-Memory Rate Limiter

**File**: `lib/rateLimit.ts`

Features:

- **Simple & Fast**: No external dependencies for basic protection
- **IP-based Tracking**: Identifies users by IP address
- **Sliding Window**: Accurate request counting within time windows
- **Automatic Cleanup**: Removes expired entries every 5 minutes
- **Production Ready**: Easy migration path to Redis

### Algorithm

```
1. Get client identifier (IP address)
2. Create key: "rate-limit-id:client-ip"
3. Check if key exists and window active:
   - If count >= limit: Return 429 (rate limited)
   - Else: Increment count and allow
4. If key expired or doesn't exist: Create new window
```

## Usage

### Method 1: Manual Check

```typescript
import { checkRateLimit, RateLimitPresets } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  // Check rate limit
  const rateLimitResponse = checkRateLimit(req, RateLimitPresets.PAYMENT);
  if (rateLimitResponse) {
    return rateLimitResponse; // Return 429 response
  }

  // Process request...
}
```

### Method 2: Wrapper Function

```typescript
import { withRateLimit, RateLimitPresets } from "@/lib/rateLimit";

export const POST = withRateLimit(async (req: NextRequest) => {
  // Your handler code
}, RateLimitPresets.PAYMENT);
```

### Custom Configuration

```typescript
const rateLimitResponse = checkRateLimit(req, {
  id: "custom-endpoint",
  limit: 20,
  windowMs: 60 * 1000, // 1 minute
  message: "Custom rate limit message",
});
```

## Pre-configured Presets

### RateLimitPresets.AUTH

- **Limit**: 5 requests per 15 minutes
- **Use for**: Login, register, password reset
- **Protection**: Brute force attacks

### RateLimitPresets.PAYMENT

- **Limit**: 10 requests per 1 minute
- **Use for**: Create order, verify payment, payment gateway calls
- **Protection**: Payment fraud, duplicate orders

### RateLimitPresets.WEBHOOK

- **Limit**: 100 requests per 1 minute
- **Use for**: Webhook endpoints
- **Protection**: Webhook spam (still allows legitimate bursts)

### RateLimitPresets.API_GENERAL

- **Limit**: 100 requests per 15 minutes
- **Use for**: Public API routes, product listing
- **Protection**: General API abuse

### RateLimitPresets.SEARCH

- **Limit**: 30 requests per 1 minute
- **Use for**: Search, filter, autocomplete
- **Protection**: Search spam, scraping

### RateLimitPresets.CONTACT

- **Limit**: 3 requests per 1 hour
- **Use for**: Contact forms, support tickets
- **Protection**: Spam submissions

## Applied Rate Limits

### Payment Endpoints ✅

**1. `/api/checkout/create-order`**

```typescript
// 10 requests per minute
checkRateLimit(req, RateLimitPresets.PAYMENT);
```

**2. `/api/checkout/razorpay/create-order`**

```typescript
// 10 requests per minute
checkRateLimit(req, RateLimitPresets.PAYMENT);
```

**3. `/api/checkout/razorpay/verify`**

```typescript
// 10 requests per minute
checkRateLimit(req, RateLimitPresets.PAYMENT);
```

### Webhook Endpoints ✅

**4. `/api/webhooks/razorpay`**

```typescript
// 100 requests per minute
checkRateLimit(req, RateLimitPresets.WEBHOOK);
```

## Response Format

When rate limited, the API returns:

```json
{
  "error": "TooManyRequests",
  "message": "Too many payment requests. Please try again in a minute.",
  "statusCode": 429,
  "retryAfter": 47
}
```

With headers:

```
Status: 429 Too Many Requests
Retry-After: 47
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2025-12-06T12:30:00.000Z
```

## Client Identification

### Current: IP Address

```typescript
function getClientId(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  return forwarded?.split(",")[0] || realIp || "unknown";
}
```

### Upgrade: User ID (for authenticated routes)

```typescript
function getClientId(req: NextRequest): string {
  const userId = req.headers.get("x-user-id"); // From auth middleware
  if (userId) return userId;

  // Fallback to IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0];
  return ip || "unknown";
}
```

## Production Migration to Redis

### Why Redis?

- **Distributed**: Works across multiple servers
- **Persistent**: Survives server restarts
- **Fast**: In-memory performance
- **Atomic**: Race-condition free increments

### Implementation with Upstash

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  analytics: true,
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": new Date(reset).toISOString(),
        },
      }
    );
  }

  // Process request...
}
```

### Setup Steps

1. **Create Upstash Account**: https://upstash.com
2. **Create Redis Database**: Free tier available
3. **Install Package**:
   ```bash
   npm install @upstash/ratelimit @upstash/redis
   ```
4. **Add Environment Variables**:
   ```bash
   UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=xxx
   ```
5. **Replace Implementation**: Swap in-memory store with Upstash

## Monitoring

### Get Rate Limit Stats

```typescript
import { getRateLimitStats } from "@/lib/rateLimit";

export async function GET() {
  const stats = getRateLimitStats();

  return NextResponse.json({
    totalKeys: stats.totalKeys,
    activeClients: stats.activeClients,
    byRateLimitId: stats.byRateLimitId,
  });
}
```

**Example Response**:

```json
{
  "totalKeys": 45,
  "activeClients": 12,
  "byRateLimitId": {
    "payment": 8,
    "auth": 3,
    "webhook": 20,
    "api-general": 14
  }
}
```

### Create Monitoring Endpoint

**File**: `app/api/admin/rate-limit-stats/route.ts`

```typescript
import { getRateLimitStats } from "@/lib/rateLimit";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/authSeller";

export async function GET(req: NextRequest) {
  // Protect with admin role
  const authResult = await requireAuth(req, ["seller"]);
  if (authResult instanceof NextResponse) return authResult;

  const stats = getRateLimitStats();
  return NextResponse.json(stats);
}
```

## Testing

### Test Rate Limiting

```bash
# Send 15 requests quickly (limit is 10)
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/checkout/create-order \
    -H "Content-Type: application/json" \
    -d '{"cart": {...}}' \
    && echo "\nRequest $i"
done

# First 10 should succeed (200)
# Last 5 should fail (429)
```

### Test with Different IPs

```bash
# Request 1 - IP: 192.168.1.1
curl -X POST http://localhost:3000/api/checkout/create-order \
  -H "X-Forwarded-For: 192.168.1.1" \
  -H "Content-Type: application/json" \
  -d '{"cart": {...}}'

# Request 2 - IP: 192.168.1.2 (different IP, separate limit)
curl -X POST http://localhost:3000/api/checkout/create-order \
  -H "X-Forwarded-For: 192.168.1.2" \
  -H "Content-Type: application/json" \
  -d '{"cart": {...}}'
```

### Verify Headers

```bash
curl -i -X POST http://localhost:3000/api/checkout/create-order \
  -H "Content-Type: application/json" \
  -d '{"cart": {...}}'

# Check for rate limit headers:
# X-RateLimit-Limit: 10
# X-RateLimit-Remaining: 9
# X-RateLimit-Reset: 2025-12-06T12:30:00.000Z
```

## Security Considerations

### IP Spoofing Protection

Current implementation trusts `x-forwarded-for` header. In production:

1. **Use Reverse Proxy**: Nginx, Cloudflare set real IP
2. **Validate Headers**: Only trust IPs from known proxies
3. **Multiple Factors**: Combine IP + User ID + Session

### Bypass Prevention

1. **Server-side Only**: Never expose rate limit logic to client
2. **No Client Hints**: Don't reveal limits in responses
3. **Varying Limits**: Use different limits per endpoint
4. **Monitoring**: Alert on suspicious patterns

### DDoS Mitigation

Rate limiting alone won't stop DDoS:

1. **Use Cloudflare**: DDoS protection at edge
2. **WAF Rules**: Block malicious traffic patterns
3. **Auto-scaling**: Handle legitimate traffic spikes
4. **Monitoring**: Alert on abnormal traffic

## Best Practices

### 1. Set Appropriate Limits

```typescript
// ✅ Good: Allows normal usage
const loginLimit = { limit: 5, windowMs: 15 * 60 * 1000 };

// ❌ Bad: Too restrictive
const loginLimit = { limit: 1, windowMs: 60 * 60 * 1000 };
```

### 2. Provide Clear Messages

```typescript
// ✅ Good: Tells user when to retry
{
  message: "Too many attempts. Please try again in 15 minutes.",
  retryAfter: 900
}

// ❌ Bad: Vague message
{
  message: "Rate limit exceeded"
}
```

### 3. Different Limits per Endpoint

```typescript
// ✅ Good: Tailored limits
POST /api/auth/login: 5 per 15 min
POST /api/products: 100 per 15 min
POST /api/checkout/verify: 10 per 1 min

// ❌ Bad: One size fits all
All endpoints: 10 per 1 min
```

### 4. Log Rate Limit Events

```typescript
if (rateLimitResponse) {
  console.warn(`Rate limit exceeded: ${req.url}`, {
    ip: getClientId(req),
    limit: config.limit,
    window: config.windowMs,
  });
  return rateLimitResponse;
}
```

## Troubleshooting

### Issue: Rate Limit Not Working

**Check**:

1. Verify import is correct
2. Ensure function is called before processing
3. Check if IP is being extracted correctly
4. Verify window hasn't expired

### Issue: Too Many False Positives

**Solutions**:

1. Increase limit or window size
2. Use user ID instead of IP
3. Whitelist specific IPs (admin, monitoring)
4. Add bypass for authenticated users

### Issue: Memory Leak

**Cause**: Expired entries not cleaned up

**Solution**: Cleanup runs every 5 minutes automatically. For production, use Redis.

## Next Steps

### Immediate (Done ✅):

- [x] Apply to payment endpoints
- [x] Apply to webhook endpoints
- [x] Add clear error messages
- [x] Include retry headers

### Short-term:

- [ ] Add rate limit stats endpoint
- [ ] Create admin dashboard for monitoring
- [ ] Add alerts for suspicious activity
- [ ] Test with load testing tool (k6, Artillery)

### Long-term:

- [ ] Migrate to Redis (Upstash)
- [ ] Implement user-based limits for authenticated routes
- [ ] Add dynamic limits based on user tier (free/premium)
- [ ] Integrate with monitoring (Sentry, DataDog)

## Resources

- [OWASP Rate Limiting](https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks)
- [Upstash Rate Limiting](https://upstash.com/docs/redis/features/ratelimiting)
- [Vercel Rate Limiting](https://vercel.com/docs/edge-network/rate-limiting)

---

**Implementation Status**: ✅ Complete

**Production Ready**: Yes (upgrade to Redis recommended)

**Last Updated**: 2025-12-06
