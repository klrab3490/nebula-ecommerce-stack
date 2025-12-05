"use server";

import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

type CartItem = { id: string; quantity: number; price: number; name: string };
type Cart = { items: CartItem[]; total: number; itemCount?: number };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      razorpay_payment_id?: string;
      razorpay_order_id?: string;
      razorpay_signature?: string;
      cart?: Cart;
      addressId?: string;
    };

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, cart, addressId } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
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

    // Signature verified - now create the order
    const clerkUser = await currentUser();
    let dbUser = null;

    if (clerkUser) {
      dbUser = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } });

      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            clerkId: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress || `${clerkUser.id}@clerk.local`,
            name: clerkUser.fullName || clerkUser.firstName || "User",
            role: "buyer",
          },
        });
      }
    }

    // Create order with paid status
    const order = await prisma.order.create({
      data: {
        userId: dbUser?.id || "guest",
        total: cart?.total || 0,
        status: "paid",
        products: {
          create:
            cart?.items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
            })) || [],
        },
      },
    });

    // TODO: Call Shiprocket to create shipment and store tracking details
    // TODO: Send confirmation email to customer

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: "Payment verified and order created successfully",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Payment verification error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}