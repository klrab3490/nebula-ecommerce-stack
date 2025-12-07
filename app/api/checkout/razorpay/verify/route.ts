"use server";

import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { checkRateLimit, RateLimitPresets } from "@/lib/rateLimit";

type CartItem = { id: string; quantity: number; price: number; name: string };
type Cart = { items: CartItem[]; total: number; itemCount?: number };

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: 10 requests per minute
    const rateLimitResponse = checkRateLimit(req, RateLimitPresets.PAYMENT);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = (await req.json()) as {
      razorpay_payment_id?: string;
      razorpay_order_id?: string;
      razorpay_signature?: string;
      orderId?: string; // Our database order ID from create-order
      cart?: Cart;
      addressId?: string;
    };

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
    }

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET || "";
    const generated = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Signature verified - find the pending order and update it
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (existingOrder.status !== "pending") {
      return NextResponse.json({ error: `Order already ${existingOrder.status}` }, { status: 400 });
    }

    // Update order status to paid and store payment details
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "paid",
        paymentStatus: "PAID", // Update PaymentStatus enum
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
      },
    });

    // TODO: Call Shiprocket to create shipment and store tracking details
    // TODO: Send confirmation email to customer

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: "Payment verified and order updated successfully",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Payment verification error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
