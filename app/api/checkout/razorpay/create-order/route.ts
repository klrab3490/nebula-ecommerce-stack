"use server";

import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency, orderID } = body;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount,
      currency: currency,
      receipt: "receipt_" + Date.now() + `_${orderID}`,
    };

    const order = await razorpay.orders.create(options);

    // Return the fields the client expects
    const publicKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "";
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
