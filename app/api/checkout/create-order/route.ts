"use server";

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { validateCartOrThrow } from "@/lib/cartValidation";
import { checkRateLimit, RateLimitPresets } from "@/lib/rateLimit";

type CartItem = { id: string; quantity: number };
type Cart = { items: CartItem[]; total: number; itemCount?: number };

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: 10 requests per minute
    const rateLimitResponse = checkRateLimit(req, RateLimitPresets.PAYMENT);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

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

    // Require addressId for order creation
    if (!addressId) {
      return NextResponse.json({ error: "Shipping address is required" }, { status: 400 });
    }

    // Validate cart items, stock, and pricing server-side
    const validatedCart = await validateCartOrThrow(cart);

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

    // Verify the address belongs to the user
    if (dbUser && addressId) {
      const address = await prisma.address.findUnique({
        where: { id: addressId },
      });

      if (!address || address.userId !== dbUser.id) {
        return NextResponse.json({ error: "Invalid address" }, { status: 400 });
      }
    }

    // Determine order status based on payment method
    const orderStatus = paymentMethod === "cod" ? "confirmed" : "pending";

    // Create order using validated cart total
    const order = await prisma.order.create({
      data: {
        userId: dbUser?.id || actualUserId,
        addressId: addressId,
        total: validatedCart.calculatedTotal, // Use server-calculated total
        status: orderStatus,
        paymentMethod: paymentMethod,
        products: {
          create: cart.items.map((it: CartItem) => ({
            productId: it.id,
            quantity: it.quantity,
          })),
        },
      },
      include: { products: true, address: true },
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
