import React from 'react';
import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, AlertCircle } from 'lucide-react';
import { SalesChart } from '@/components/custom/dashboard/SalesChart';
import { QuickActions } from '@/components/custom/dashboard/QuickActions';
import { RecentOrders } from '@/components/custom/dashboard/RecentOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardMetrics, RevenueGoal } from '@/components/custom/dashboard/DashboardMetrics';

type Notification = {
    id: string;
    title: string;
    message: string;
    type: 'warning' | 'info' | 'success' | 'error';
    time: string;
};

async function getDashboardData() {
    // Fetch counts and sums
    const [totalOrders, totalProducts, totalCustomers] = await Promise.all([
        prisma.order.count(),
        prisma.product.count(),
        prisma.user.count(),
    ]);

    // Sum revenue from all orders
    const allOrders = await prisma.order.findMany({ select: { total: true } });
    const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    // Recent orders with items and user info
    const recentOrders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { products: true },
    });

    const userIds = Array.from(new Set(recentOrders.map((o) => o.userId))).filter(Boolean);
    const users = userIds.length > 0 ? await prisma.user.findMany({ where: { id: { in: userIds } } }) : [];
    const usersById = Object.fromEntries(users.map((u) => [u.id, u]));

    // Prepare recent orders data shape expected by RecentOrders component
    const recentOrdersForUi = recentOrders.map((o) => {
        const items = (o.products || []).reduce((s, p) => s + (p.quantity || 0), 0);
        const user = usersById[o.userId];

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
        type StatusType = (typeof validStatuses)[number];
        const rawStatus = typeof o.status === 'string' ? o.status : 'pending';
        const status: StatusType = (validStatuses.includes(rawStatus as StatusType) ? (rawStatus as StatusType) : 'pending');

        return {
            id: o.id,
            customer: user?.name || 'Guest',
            email: user?.email || '',
            total: o.total || 0,
            status,
            date: o.createdAt ? o.createdAt.toISOString() : new Date().toISOString(),
            items,
        };
    });

    // Low stock notifications
    const lowStockCount = await prisma.product.count({ where: { stock: { lte: 5 } } });

    const notifications: Notification[] = [];
    if (lowStockCount > 0) {
        notifications.push({
            id: 'low-stock',
            title: 'Low Stock Alert',
            message: `${lowStockCount} products are running low on stock`,
            type: 'warning',
            time: 'recent',
        });
    }

    if (recentOrdersForUi.length > 0) {
        notifications.push({
            id: 'new-order',
            title: 'New Order',
            message: `Order ${recentOrdersForUi[0].id} received`,
            type: 'info',
            time: 'just now',
        });
    }

    // Sales chart data: daily (last 7 days), weekly (last 4 weeks), monthly (last 6 months)
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6);

    const fourWeeksAgo = new Date(now);
    fourWeeksAgo.setDate(now.getDate() - 27);

    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 5);

    const ordersForCharts = await prisma.order.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { id: true, total: true, createdAt: true },
    });

    // Daily (7 days)
    const dailyMap: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setDate(sevenDaysAgo.getDate() + i);
        const key = d.toLocaleDateString('en-US', { weekday: 'short' });
        dailyMap[key] = 0;
    }
    for (const o of ordersForCharts) {
        const key = new Date(o.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
        dailyMap[key] = (dailyMap[key] || 0) + (o.total || 0);
    }
    const daily = Object.keys(dailyMap).map((k) => ({ name: k, value: dailyMap[k] }));

    // Weekly (4 weeks) and Monthly (6 months) — fetch a wider range
    const ordersForLonger = await prisma.order.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { id: true, total: true, createdAt: true },
    });

    // weekly buckets (last 4 calendar weeks)
    const weekly: { name: string; value: number }[] = [];
    for (let w = 0; w < 4; w++) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - (7 * (3 - w)));
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        const total = ordersForLonger
            .filter((o) => new Date(o.createdAt) >= weekStart && new Date(o.createdAt) <= weekEnd)
            .reduce((s, o) => s + (o.total || 0), 0);
        weekly.push({ name: `Week ${w + 1}`, value: total });
    }

    // monthly buckets (last 6 months)
    const monthly: { name: string; value: number }[] = [];
    for (let m = 5; m >= 0; m--) {
        const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
        const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
        const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
        const total = ordersForLonger
            .filter((o) => new Date(o.createdAt) >= monthStart && new Date(o.createdAt) <= monthEnd)
            .reduce((s, o) => s + (o.total || 0), 0);
        monthly.push({ name: monthStart.toLocaleString('en-US', { month: 'short' }), value: total });
    }

    const metrics = {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        conversionRate: totalCustomers > 0 ? (totalOrders / totalCustomers) * 100 : 0,
        avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    };

    const revenueGoal = {
        current: totalRevenue,
        target: Number(process.env.SELLER_REVENUE_TARGET || 50000),
    };

    return {
        metrics,
        revenueGoal,
        notifications,
        recentOrders: recentOrdersForUi,
        chartData: { daily, weekly, monthly },
    };
}

export default async function SellerDashboard() {
    const data = await getDashboardData();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening with your store today.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </div>

            {/* Key Metrics */}
            <DashboardMetrics metrics={data.metrics} />

            {/* Charts and Goals Row */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Sales Chart - Takes 2 columns */}
                <div className="lg:col-span-2">
                    <SalesChart data={data.chartData} />
                </div>

                {/* Revenue Goal - Takes 1 column */}
                <div>
                    <RevenueGoal current={data.revenueGoal.current} target={data.revenueGoal.target} />
                </div>
            </div>

            {/* Notifications & Alerts */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Recent Notifications
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {data.notifications.map((notification) => (
                            <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg border">
                                <div className={`h-2 w-2 rounded-full mt-2 ${notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">{notification.title}</h4>
                                        <Badge variant="outline" className="text-xs">{notification.time}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Orders */}
            <RecentOrders orders={data.recentOrders} />

            {/* Quick Actions */}
            <QuickActions />
        </div>
    );
}