"use server";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

type CartItem = { id: string; quantity: number };
type Cart = { items: CartItem[]; total: number; itemCount?: number };

export async function POST(req: Request) {
  try {
    const parsed = (await req.json()) as {
      cart?: Cart;
      userId?: string;
      paymentMethod?: "upi" | "cod";
      addressId?: string;
    };

    const { cart, userId, paymentMethod = "upi", addressId } = parsed;

    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      return NextResponse.json({ error: "Empty cart" }, { status: 400 });
    }

    // Get current user from Clerk
    const clerkUser = await currentUser();
    const actualUserId = userId || clerkUser?.id || "guest";

    // Find or create user in database
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

    // Determine order status based on payment method
    const orderStatus = paymentMethod === "cod" ? "confirmed" : "pending";

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: dbUser?.id || actualUserId,
        total: cart.total,
        status: orderStatus,
        products: {
          create: cart.items.map((it: CartItem) => ({
            productId: it.id,
            quantity: it.quantity,
          })),
        },
      },
      include: { products: true },
    });

    // If COD, order is immediately confirmed
    if (paymentMethod === "cod") {
      return NextResponse.json({
        success: true,
        orderId: order.id,
        status: "confirmed",
        message: "Order placed successfully with Cash on Delivery",
      });
    }

    // If UPI, return order for payment processing
    return NextResponse.json({
      success: true,
      orderId: order.id,
      status: "pending",
      message: "Order created, proceed to payment",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Create order error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
