import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    // Get current user from Clerk
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user in database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get status filter from query params
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Fetch orders with products
    const orders = await prisma.order.findMany({
      where: {
        userId: dbUser.id,
        ...(status && status !== "all" ? { status } : {}),
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
        address: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform orders to match frontend expectations
    const transformedOrders = orders.map((order) => ({
      id: order.id,
      date: order.createdAt.toISOString(),
      total: order.total,
      status: mapOrderStatus(order.status),
      items: order.products.map((op) => ({
        id: op.product.id,
        name: op.product.name,
        price: op.product.discountedPrice || op.product.price,
        quantity: op.quantity,
        image: op.product.images[0] || "/placeholder.png",
      })),
      razorpayOrderId: order.razorpayOrderId,
      razorpayPaymentId: order.razorpayPaymentId,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.address,
    }));

    return NextResponse.json({ orders: transformedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// Map database status to frontend display status
function mapOrderStatus(dbStatus: string): string {
  const statusMap: Record<string, string> = {
    pending: "Processing",
    paid: "Processing",
    confirmed: "Shipped",
    failed: "Cancelled",
    cancelled: "Cancelled",
    refund_pending: "Processing",
    refunded: "Cancelled",
  };

  return statusMap[dbStatus] || "Processing";
}
