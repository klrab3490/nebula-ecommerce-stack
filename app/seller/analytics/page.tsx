import React from "react";
import { prisma } from "@/lib/prisma";
import SellerAnalyticsClient from "@/components/custom/seller/SellerAnalyticsClient";

export default async function AnalyticsPage() {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 6);

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: sevenDaysAgo } },
    include: { products: true },
    orderBy: { createdAt: "asc" },
  });
  const usersCount = await prisma.user.count();

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const totalOrders = orders.length;

  const dailyMap: Record<string, { sales: number; orders: number }> = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(sevenDaysAgo.getDate() + i);
    const key = d.toLocaleDateString("en-US", { weekday: "short" });
    dailyMap[key] = { sales: 0, orders: 0 };
  }
  for (const o of orders) {
    const key = new Date(o.createdAt).toLocaleDateString("en-US", { weekday: "short" });
    if (!dailyMap[key]) dailyMap[key] = { sales: 0, orders: 0 };
    dailyMap[key].sales += o.total || 0;
    dailyMap[key].orders += (o.products || []).reduce(
      (s, p: { productId: string; quantity?: number }) => s + (p.quantity || 0),
      0
    );
  }
  const salesDaily = Object.keys(dailyMap).map((k) => ({
    name: k,
    sales: dailyMap[k].sales,
    orders: dailyMap[k].orders,
  }));

  const productIds = Array.from(
    new Set(
      orders.flatMap((o) =>
        (o.products || []).map((p: { productId: string; quantity?: number }) => p.productId)
      )
    )
  );
  const products = productIds.length
    ? await prisma.product.findMany({ where: { id: { in: productIds } } })
    : [];
  const prodById = Object.fromEntries(products.map((p) => [p.id, p]));

  const productStats: Record<string, { sold: number; revenue: number; name: string }> = {};
  for (const o of orders) {
    for (const p of o.products || []) {
      const pid = p.productId as string;
      productStats[pid] = productStats[pid] || {
        sold: 0,
        revenue: 0,
        name: prodById[pid]?.name || "Product",
      };
      productStats[pid].sold += p.quantity || 0;
      productStats[pid].revenue += (prodById[pid]?.price || 0) * (p.quantity || 0);
    }
  }
  const topProducts = Object.values(productStats)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - now.getDay());
  startOfThisWeek.setHours(0, 0, 0, 0);
  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

  const ordersThisWeek = await prisma.order.findMany({
    where: { createdAt: { gte: startOfThisWeek } },
    select: { total: true },
  });
  const ordersLastWeek = await prisma.order.findMany({
    where: { createdAt: { gte: startOfLastWeek, lt: startOfThisWeek } },
    select: { total: true },
  });
  const sum = (arr: { total?: number }[]) => arr.reduce((s, x) => s + (x.total || 0), 0);
  const totals = {
    weekly: sum(ordersThisWeek),
    lastWeek: sum(ordersLastWeek),
    growthPercent: ordersLastWeek.length
      ? ((sum(ordersThisWeek) - sum(ordersLastWeek)) / sum(ordersLastWeek)) * 100
      : 0,
  };

  type Trend = "up" | "down" | "neutral";
  type Metric = {
    title: string;
    value: number;
    change?: { value: number; label: string };
    trend: Trend;
    icon: string;
    description?: string;
  };

  const overviewMetrics: Metric[] = [
    {
      title: "Total Revenue",
      value: totalRevenue,
      change: { value: totals.growthPercent, label: "vs last week" },
      trend: totals.growthPercent >= 0 ? "up" : "down",
      icon: "dollar",
      description: "Total earnings (last 7 days)",
    },
    {
      title: "Orders",
      value: totalOrders,
      change: { value: 0, label: "vs last week" },
      trend: "neutral",
      icon: "orders",
      description: "Orders received (last 7 days)",
    },
    {
      title: "Products Sold",
      value: Object.values(productStats).reduce((s, p) => s + p.sold, 0),
      change: { value: 0, label: "vs last week" },
      trend: "neutral",
      icon: "products",
      description: "Units sold (last 7 days)",
    },
    {
      title: "Customers",
      value: usersCount,
      change: { value: 0, label: "vs last week" },
      trend: "neutral",
      icon: "users",
      description: "Active customers",
    },
  ];

  return (
    <SellerAnalyticsClient
      overviewMetrics={overviewMetrics}
      salesDaily={salesDaily}
      topProducts={topProducts}
      totals={totals}
    />
  );
}
