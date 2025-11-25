import React from "react";
import { prisma } from "@/lib/prisma";
import SellerCustomersClient, { UserData } from "@/components/custom/seller/SellerCustomersClient";

export default async function UsersPage() {
  // Fetch users from DB
  const users = await prisma.user.findMany();

  // If no users, return empty client
  if (!users || users.length === 0) return <SellerCustomersClient users={[]} />;

  // Aggregate orders per user
  const userIds = users.map((u) => u.id);
  const orders = await prisma.order.findMany({ where: { userId: { in: userIds } } });

  const ordersByUser: Record<string, { count: number; total: number }> = {};
  for (const o of orders) {
    const uid = o.userId;
    ordersByUser[uid] = ordersByUser[uid] || { count: 0, total: 0 };
    ordersByUser[uid].count += 1;
    ordersByUser[uid].total += o.total || 0;
  }

  const mapped: UserData[] = users.map((u) => ({
    uuid: u.id,
    name: u.name,
    email: u.email,
    username: undefined,
    role: ["admin", "seller", "customer", "moderator"].includes(u.role)
      ? (u.role as "admin" | "seller" | "customer" | "moderator")
      : "customer",
    status: "active",
    joinDate: new Date().toISOString(),
    lastLogin: null,
    orderCount: ordersByUser[u.id]?.count || 0,
    totalSpent: ordersByUser[u.id]?.total || 0,
  }));

  return <SellerCustomersClient users={mapped} />;
}
