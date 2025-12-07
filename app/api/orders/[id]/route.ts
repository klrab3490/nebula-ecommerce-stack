import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;

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

    // Fetch order with products and address
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
        address: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify order belongs to user
    if (order.userId !== dbUser.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Transform order to match frontend expectations
    const transformedOrder = {
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
      user: {
        name: dbUser.name,
        email: dbUser.email,
      },
      shippingAddress: order.address,
    };

    return NextResponse.json({ order: transformedOrder });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
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
