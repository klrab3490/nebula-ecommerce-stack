"use server";

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Update Order with Razorpay Order ID
 *
 * This endpoint stores the Razorpay order_id in our database
 * for better tracking and webhook processing
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, razorpayOrderId } = body;

    if (!orderId || !razorpayOrderId) {
      return NextResponse.json({ error: "Missing orderId or razorpayOrderId" }, { status: 400 });
    }

    // Update order with Razorpay order ID
    await prisma.order.update({
      where: { id: orderId },
      data: { razorpayOrderId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update razorpay ID error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
