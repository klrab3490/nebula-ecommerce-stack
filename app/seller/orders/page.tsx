import { prisma } from "@/lib/prisma";
import SellerOrdersClient from "@/components/custom/seller/SellerOrdersClient";

export default async function SellerOrdersPage() {
  // Fetch orders with related OrderProduct entries and shipping address
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      products: true,
      shippingAddress: true,
    },
  });

  // Batch fetch users and product details to avoid N+1 queries
  const userIds = Array.from(new Set(orders.map((o) => o.userId).filter(Boolean)));
  const users = userIds.length
    ? await prisma.user.findMany({ where: { id: { in: userIds } } })
    : [];
  const usersById = Object.fromEntries(users.map((u) => [u.id, u]));

  type OrderProduct = { id: string; orderId: string; productId: string; quantity: number };
  const productIds = Array.from(
    new Set(
      orders
        .flatMap((o) => (o.products || []).map((p: OrderProduct) => p.productId))
        .filter(Boolean)
    )
  );
  const products = productIds.length
    ? await prisma.product.findMany({ where: { id: { in: productIds } } })
    : [];
  const productsById = Object.fromEntries(products.map((p) => [p.id, p]));

  const mapped = orders.map((o) => {
    const items = (o.products || []).map((p: OrderProduct) => ({
      id: p.id,
      name: productsById[p.productId]?.name || "Product",
      quantity: p.quantity,
      price: productsById[p.productId]?.price || 0,
    }));

    const user = usersById[o.userId];

    return {
      id: o.id,
      customer: {
        name: user?.name || "Guest",
        email: user?.email || "",
      },
      items,
      total: o.total || 0,
      status: ([
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "confirmed",
        "paid",
      ].includes(String(o.status))
        ? String(o.status)
        : "pending") as
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "confirmed"
        | "paid",
      paymentMethod: o.paymentMethod || undefined,
      paymentStatus: (["PENDING", "PAID", "FAILED", "REFUNDED"].includes(String(o.paymentStatus))
        ? String(o.paymentStatus)
        : "PENDING") as "PENDING" | "PAID" | "FAILED" | "REFUNDED",
      orderDate: o.createdAt ? o.createdAt.toISOString() : new Date().toISOString(),
      trackingNumber: undefined,
      shippingAddress: o.shippingAddress
        ? {
            name: o.shippingAddress.name,
            street: o.shippingAddress.street,
            city: o.shippingAddress.city,
            state: o.shippingAddress.state,
            zipCode: o.shippingAddress.zipCode,
            country: o.shippingAddress.country,
            phone: o.shippingAddress.phone,
          }
        : undefined,
    };
  });

  return <SellerOrdersClient orders={mapped} />;
}
