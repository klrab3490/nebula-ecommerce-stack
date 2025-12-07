"use server";

import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RateLimitPresets } from "@/lib/rateLimit";

/**
 * Razorpay Webhook Handler
 *
 * Handles async payment events from Razorpay:
 * - payment.captured - Payment successful
 * - payment.failed - Payment failed
 * - payment.authorized - Payment authorized (needs capture)
 * - refund.created - Refund initiated
 * - refund.processed - Refund completed
 *
 * Security:
 * - Verifies webhook signature using HMAC SHA256
 * - Uses webhook secret (different from API key secret)
 * - Implements idempotency to prevent duplicate processing
 */

// Idempotency store - in production, use Redis or database
const processedEvents = new Map<string, boolean>();

export async function POST(req: NextRequest) {
  try {
    // 0. Rate limiting: 100 requests per minute
    const rateLimitResponse = checkRateLimit(req, RateLimitPresets.WEBHOOK);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // 1. Get webhook signature from headers
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      console.error("Missing webhook signature");
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    // 2. Get raw body for signature verification
    // IMPORTANT: The request body can only be read once. We use req.text() here to obtain the raw body
    // for signature verification, and then parse it with JSON.parse. Do NOT use req.json() or attempt
    // to read the body again, as this will break signature verification and/or parsing.
    const rawBody = await req.text();

    // 3. Verify signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET not configured");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 4. Parse webhook payload
    const event = JSON.parse(rawBody);
    const { event: eventType, payload } = event;

    // console.log(`Received Razorpay webhook: ${eventType}`, { paymentId: payload?.payment?.entity?.id, orderId: payload?.payment?.entity?.order_id,});

    // 5. Check idempotency - prevent duplicate processing
    const eventId = event.id || `${eventType}_${payload?.payment?.entity?.id}`;

    if (processedEvents.has(eventId)) {
      // console.log(`Event ${eventId} already processed, skipping`);
      return NextResponse.json({ status: "already_processed" });
    }

    // 6. Handle different event types
    let result;

    switch (eventType) {
      case "payment.captured":
        result = await handlePaymentCaptured(payload);
        break;

      case "payment.failed":
        result = await handlePaymentFailed(payload);
        break;

      case "payment.authorized":
        result = await handlePaymentAuthorized(payload);
        break;

      case "refund.created":
        result = await handleRefundCreated(payload);
        break;

      case "refund.processed":
        result = await handleRefundProcessed(payload);
        break;

      default:
        // console.log(`Unhandled event type: ${eventType}`);
        return NextResponse.json({ status: "ignored" });
    }

    // 7. Mark event as processed
    processedEvents.set(eventId, true);

    // Clean up old events (keep last 1000)
    if (processedEvents.size > 1000) {
      const keys = Array.from(processedEvents.keys());
      keys.slice(0, 500).forEach((key) => processedEvents.delete(key));
    }

    return NextResponse.json({ status: "success", result });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Handle payment.captured event
 * Payment was successfully captured by Razorpay
 */
async function handlePaymentCaptured(payload: any) {
  const payment = payload.payment.entity;
  const razorpayOrderId = payment.order_id;
  const paymentId = payment.id;
  const amount = payment.amount / 100; // Convert paise to rupees

  // console.log(`Payment captured: ${paymentId} for order ${razorpayOrderId}`);

  // Find order by Razorpay order ID (preferred) or fallback to amount matching
  let order = null;

  if (razorpayOrderId) {
    order = await prisma.order.findFirst({
      where: { razorpayOrderId },
    });
  }

  // Fallback: find by amount and pending status if razorpayOrderId not stored
  if (!order) {
    order = await prisma.order.findFirst({
      where: {
        status: "pending",
        total: amount,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  if (!order) {
    console.error(`No pending order found for payment ${paymentId}`);
    return { status: "order_not_found" };
  }

  // Update order to paid and store payment ID
  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "paid",
      razorpayPaymentId: paymentId,
      razorpayOrderId: razorpayOrderId || order.razorpayOrderId,
    },
  });

  // console.log(`Order ${order.id} marked as paid`);

  // TODO: Send confirmation email
  // TODO: Create shipment in Shiprocket
  // TODO: Reduce product stock

  return { orderId: order.id, status: "paid" };
}

/**
 * Handle payment.failed event
 * Payment attempt failed
 */
async function handlePaymentFailed(payload: any) {
  const payment = payload.payment.entity;
  const razorpayOrderId = payment.order_id;
  const paymentId = payment.id;
  const errorCode = payment.error_code;
  const errorDescription = payment.error_description;

  // console.log(`Payment failed: ${paymentId}`, { orderId: razorpayOrderId, errorCode, errorDescription, });

  // Find and update order
  const order = await prisma.order.findFirst({
    where: { status: "pending" },
    orderBy: { createdAt: "desc" },
  });

  if (order) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "failed" },
    });

    // console.log(`Order ${order.id} marked as failed`);
  }

  // TODO: Send payment failed email
  // TODO: Restore product stock if reserved

  return { orderId: order?.id, status: "failed" };
}

/**
 * Handle payment.authorized event
 * Payment authorized but not captured (for manual capture)
 */
async function handlePaymentAuthorized(payload: any) {
  const payment = payload.payment.entity;
  const paymentId = payment.id;

  // console.log(`Payment authorized: ${paymentId} (requires manual capture)`);

  // TODO: Update order status to "authorized"
  // TODO: Notify admin for manual capture

  return { status: "authorized" };
}

/**
 * Handle refund.created event
 * Refund initiated by merchant
 */
async function handleRefundCreated(payload: any) {
  const refund = payload.refund.entity;
  const paymentId = refund.payment_id;
  const refundId = refund.id;
  const amount = refund.amount / 100;

  // console.log(`Refund created: ${refundId} for payment ${paymentId}`, { amount, });

  // Find order by payment ID (need to store this in Order model)
  // For now, find by amount
  const order = await prisma.order.findFirst({
    where: {
      status: "paid",
      total: amount,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (order) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "refund_pending" },
    });

    // console.log(`Order ${order.id} marked as refund_pending`);
  }

  // TODO: Send refund initiated email

  return { orderId: order?.id, status: "refund_pending" };
}

/**
 * Handle refund.processed event
 * Refund successfully processed to customer
 */
async function handleRefundProcessed(payload: any) {
  const refund = payload.refund.entity;
  const paymentId = refund.payment_id;
  const refundId = refund.id;
  const amount = refund.amount / 100;

  // console.log(`Refund processed: ${refundId} for payment ${paymentId}`, { amount, });

  // Find and update order
  const order = await prisma.order.findFirst({
    where: {
      status: "refund_pending",
      total: amount,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (order) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "refunded" },
    });

    // console.log(`Order ${order.id} marked as refunded`);
  }

  // TODO: Send refund completed email
  // TODO: Restore product stock

  return { orderId: order?.id, status: "refunded" };
}
