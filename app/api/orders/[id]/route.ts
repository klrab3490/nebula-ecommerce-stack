"use server";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from our database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;

    // Fetch the specific order
    const order = await prisma.order.findFirst({
      where: {
        id: id,
        userId: user.id, // Ensure user can only access their own orders
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Transform the data
    const formattedOrder = {
      id: order.id,
      date: new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      total: order.total,
      status: order.status,
      items: order.products.map((op) => ({
        id: op.product.id,
        name: op.product.name,
        price: op.product.discountedPrice || op.product.price,
        quantity: op.quantity,
        image: op.product.images[0] || "/placeholder.jpg",
      })),
      razorpayOrderId: order.razorpayOrderId,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
    };

    return NextResponse.json({ order: formattedOrder });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
