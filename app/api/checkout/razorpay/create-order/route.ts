import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(
    req: NextRequest
) {
  try {
    const body = await req.json();
    const { amount, currency, orderID } = body;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount*100,
      currency: currency,
      receipt: "receipt_" + Date.now()+`_${orderID}`,
    };

    const order = await razorpay.orders.create(options);

    return Response.json(order);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Order creation failed" }, { status: 500 });
  }
}
