# Razorpay Webhook Setup Guide

## Overview

This guide explains how to set up Razorpay webhooks to handle asynchronous payment events in your Next.js application.

## Why Webhooks?

Webhooks provide a reliable way to handle payment events that happen asynchronously:

- **payment.captured** - Payment successfully captured (funds settled)
- **payment.failed** - Payment attempt failed
- **payment.authorized** - Payment authorized but not captured (manual capture mode)
- **refund.created** - Refund initiated
- **refund.processed** - Refund successfully processed to customer

Without webhooks, you'd miss events like:

- Failed payments after user closes browser
- Delayed payment confirmations
- Refund status updates
- Payment disputes

## Setup Steps

### 1. Configure Webhook Secret

Add your webhook secret to `.env.local`:

```bash
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxx
```

**How to get the webhook secret:**

1. Go to Razorpay Dashboard: https://dashboard.razorpay.com
2. Navigate to: **Settings** → **Webhooks**
3. Click **Create Webhook** or view existing webhook
4. Copy the **Secret** value

### 2. Create Webhook in Razorpay Dashboard

1. Go to: **Settings** → **Webhooks** → **Create Webhook**

2. **Webhook URL**: `https://yourdomain.com/api/webhooks/razorpay`
   - For local testing, use ngrok: `https://abc123.ngrok.io/api/webhooks/razorpay`

3. **Active Events**: Select the following events:
   - ✅ `payment.captured`
   - ✅ `payment.failed`
   - ✅ `payment.authorized`
   - ✅ `refund.created`
   - ✅ `refund.processed`

4. **Alert Email**: Your email for webhook failures

5. Click **Create Webhook**

6. **Copy the Secret** and add to your `.env.local`

### 3. Test Webhooks Locally

Use ngrok to expose your local server:

```bash
# Install ngrok
npm install -g ngrok

# Start your Next.js dev server
npm run dev

# In another terminal, start ngrok
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Update webhook URL in Razorpay Dashboard to:
# https://abc123.ngrok.io/api/webhooks/razorpay
```

### 4. Test Webhook Events

1. Make a test payment in your application
2. Check Razorpay Dashboard → Webhooks → View your webhook → Event Logs
3. Check your terminal logs for webhook processing

## Webhook Implementation

### Endpoint

**File**: `app/api/webhooks/razorpay/route.ts`

**URL**: `POST /api/webhooks/razorpay`

### Security Features

1. **Signature Verification**: Every webhook payload is verified using HMAC SHA256

   ```typescript
   const expectedSignature = crypto
     .createHmac("sha256", webhookSecret)
     .update(rawBody)
     .digest("hex");

   if (expectedSignature !== signature) {
     return 401 Unauthorized
   }
   ```

2. **Idempotency**: Prevents duplicate event processing
   - Stores processed event IDs in memory (use Redis in production)
   - Returns success if event already processed

3. **Error Handling**: Graceful error handling with proper logging

### Event Handlers

#### 1. payment.captured

**When**: Payment successfully captured by Razorpay

**Action**:

- Find order by `razorpayOrderId` (preferred) or amount
- Update order status to "paid"
- Store `razorpayPaymentId`
- TODO: Send confirmation email
- TODO: Create shipment in Shiprocket
- TODO: Reduce product stock

#### 2. payment.failed

**When**: Payment attempt failed

**Action**:

- Find pending order
- Update order status to "failed"
- TODO: Send payment failed email
- TODO: Restore product stock if reserved

#### 3. payment.authorized

**When**: Payment authorized but not captured (manual capture mode)

**Action**:

- Update order status to "authorized"
- TODO: Notify admin for manual capture

#### 4. refund.created

**When**: Refund initiated by merchant

**Action**:

- Find order by payment ID or amount
- Update order status to "refund_pending"
- TODO: Send refund initiated email

#### 5. refund.processed

**When**: Refund successfully processed to customer

**Action**:

- Find order with status "refund_pending"
- Update order status to "refunded"
- TODO: Send refund completed email
- TODO: Restore product stock

## Database Schema Updates

Added fields to Order model:

```prisma
model Order {
  // ... existing fields
  razorpayOrderId   String? // Razorpay order_id for tracking
  razorpayPaymentId String? // Razorpay payment_id after payment
  paymentMethod     String? // "upi" | "cod" | "card" | "netbanking"

  @@index([razorpayOrderId])
  @@index([status])
}
```

**Migration**: Run `npx prisma generate` after schema changes

## Order Status Flow

```
Order Created
  ↓
status: "pending"
  ↓
Payment Attempt
  ↓
┌─────────────┬─────────────┬──────────────┐
│  Success    │   Failed    │   Authorized │
↓             ↓             ↓
"paid"        "failed"      "authorized"
↓                           ↓
Confirmed                   Manual Capture
                           ↓
                           "paid"

Refund Flow:
"paid" → "refund_pending" → "refunded"
```

## Order Tracking Improvements

### Before:

- Orders found by amount matching (unreliable)
- No Razorpay IDs stored
- Difficult to track payments

### After:

- Orders tracked by `razorpayOrderId` (unique)
- Payment IDs stored for reference
- Easy webhook processing
- Better customer support

## Payment Flow with Webhooks

### Complete Flow:

1. **User clicks "Pay"**
   - Frontend calls `/api/checkout/create-order`
   - Order created with status "pending"
   - Returns `orderId`

2. **Create Razorpay Order**
   - Frontend calls `/api/checkout/razorpay/create-order`
   - Returns Razorpay `order_id`
   - Frontend calls `/api/checkout/update-razorpay-id`
   - Stores Razorpay order ID in database

3. **User completes payment**
   - Razorpay popup opens
   - User enters payment details
   - Payment processed

4. **Payment Success (Synchronous)**
   - Razorpay calls `handler` callback
   - Frontend calls `/api/checkout/razorpay/verify`
   - Verify signature
   - Update order to "paid"
   - Store payment ID
   - Redirect to success page

5. **Payment Captured (Asynchronous Webhook)**
   - Razorpay sends `payment.captured` webhook
   - Backend verifies signature
   - Updates order to "paid" (idempotent)
   - Triggers fulfillment (email, shipment, stock)

### Webhook Advantage:

Even if user closes browser after payment, webhook ensures order is marked as paid!

## Testing

### Test Payment Flow:

1. **Successful Payment**:

   ```bash
   # Use Razorpay test cards
   Card: 4111 1111 1111 1111
   CVV: 123
   Expiry: Any future date
   ```

2. **Failed Payment**:

   ```bash
   # Use Razorpay test failure cards
   Card: 4000 0000 0000 0002
   ```

3. **Check Webhook Delivery**:
   - Razorpay Dashboard → Webhooks → Event Logs
   - Verify "Delivered" status
   - Check response status code (200 OK)

### Test Refund:

1. Go to Razorpay Dashboard → Payments
2. Find test payment
3. Click **Refund**
4. Check webhook logs for `refund.created` and `refund.processed`

## Production Deployment

### Checklist:

- [ ] Add `RAZORPAY_WEBHOOK_SECRET` to production environment variables
- [ ] Update webhook URL in Razorpay Dashboard to production URL
- [ ] Replace in-memory idempotency store with Redis or database
- [ ] Implement email notifications (confirmation, failed, refund)
- [ ] Implement Shiprocket integration for shipment creation
- [ ] Add stock reduction logic in payment.captured handler
- [ ] Set up monitoring for webhook failures
- [ ] Enable webhook retry in Razorpay Dashboard (auto-retry on failure)

### Environment Variables:

```bash
# Production .env
RAZORPAY_WEBHOOK_SECRET=whsec_live_xxxxxxxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
NEXT_PUBLIC_RAZORPAY_KEY_SECRET=live_xxxxxxxxxx
```

## Monitoring

### Webhook Logs:

Check webhook delivery status in Razorpay Dashboard:

- Green: Delivered successfully (200 OK)
- Red: Failed (non-200 status or timeout)
- Razorpay auto-retries failed webhooks

### Application Logs:

```typescript
// Webhook handler logs:
console.log(`Received Razorpay webhook: ${eventType}`);
console.log(`Payment captured: ${paymentId} for order ${razorpayOrderId}`);
console.log(`Order ${order.id} marked as paid`);
```

### Error Handling:

All errors are logged and return 500 status to trigger Razorpay retry.

## Troubleshooting

### Webhook Not Received:

1. Check webhook URL is correct and accessible
2. Verify `RAZORPAY_WEBHOOK_SECRET` is set
3. Check Razorpay Dashboard → Webhooks → Event Logs for errors
4. For local testing, ensure ngrok is running

### Signature Verification Failed:

1. Verify webhook secret matches Razorpay Dashboard
2. Ensure you're using the raw request body (not parsed JSON)
3. Check for environment variable typos

### Order Not Found:

1. Ensure `razorpayOrderId` is being stored before payment
2. Check order status is "pending" before payment
3. Verify amount matching logic if razorpayOrderId missing

### Duplicate Processing:

1. Idempotency check should prevent this
2. For production, migrate to Redis/database-backed idempotency
3. Check event IDs are unique

## Next Steps

### Recommended Enhancements:

1. **Email Notifications**:
   - Install SendGrid or Resend
   - Send emails in webhook handlers
   - Templates: confirmation, failed, refund

2. **Stock Management**:
   - Reduce stock on payment.captured
   - Restore stock on payment.failed or refund.processed
   - Add stock reservation during order creation

3. **Shiprocket Integration**:
   - Create shipment on payment.captured
   - Store tracking details in Order model
   - Send tracking email to customer

4. **Admin Dashboard**:
   - View webhook events
   - Manually trigger refunds
   - Monitor failed payments

5. **Redis for Idempotency**:

   ```typescript
   import Redis from "ioredis";
   const redis = new Redis(process.env.REDIS_URL);

   // Check if event processed
   const processed = await redis.get(`webhook:${eventId}`);
   if (processed) return { status: "already_processed" };

   // Mark as processed (expire after 7 days)
   await redis.setex(`webhook:${eventId}`, 604800, "true");
   ```

## Resources

- [Razorpay Webhooks Documentation](https://razorpay.com/docs/webhooks/)
- [Razorpay Event Reference](https://razorpay.com/docs/webhooks/events/)
- [Testing Webhooks](https://razorpay.com/docs/webhooks/test/)

---

**Implementation Status**: ✅ Complete

**Production Ready**: Almost (needs email + stock management + Redis)

**Last Updated**: 2025-12-06
