"use server";

import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RateLimitPresets } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: 10 requests per minute
    const rateLimitResponse = checkRateLimit(req, RateLimitPresets.PAYMENT);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await req.json();
    const { amount, currency, orderID } = body;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount,
      currency: currency,
      // Razorpay receipt max 40 chars: use shortened timestamp + last 12 chars of orderID
      receipt: `rcpt_${Date.now().toString().slice(-8)}_${orderID.slice(-12)}`,
    };

    const order = await razorpay.orders.create(options);

    // Return the fields the client expects
    const publicKey = process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "";
    return NextResponse.json({
      key: publicKey,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      raw: order,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Order creation failed" }, { status: 500 });
  }
}
