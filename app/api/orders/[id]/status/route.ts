"use server";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For seller, we might need to add role-based verification
    // For now, allowing any authenticated user to update orders (in production, verify seller role)
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const validStatuses = [
      "pending",
      "paid",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "failed",
      "refund_pending",
      "refunded",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { id } = await params;

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        products: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        status: updatedOrder.status,
        updatedAt: updatedOrder.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
