"use server";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
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

    // Fetch orders with their products
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform the data to match the frontend format
    const formattedOrders = orders.map((order) => ({
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
    }));

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
