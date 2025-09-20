"use client";
import React from 'react';
import { DashboardMetrics, RevenueGoal } from '@/components/custom/dashboard/DashboardMetrics';
import { RecentOrders } from '@/components/custom/dashboard/RecentOrders';
import { SalesChart } from '@/components/custom/dashboard/SalesChart';
import { QuickActions } from '@/components/custom/dashboard/QuickActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, AlertCircle } from 'lucide-react';

export default function SellerDashboard() {
  // Mock data - in real app this would come from API/database
  const dashboardData = {
    metrics: {
      totalRevenue: 45231.89,
      totalOrders: 1234,
      totalProducts: 89,
      totalCustomers: 573,
      conversionRate: 3.2,
      avgOrderValue: 36.67
    },
    revenueGoal: {
      current: 45231.89,
      target: 50000
    },
    notifications: [
      {
        id: 1,
        title: "Low Stock Alert",
        message: "5 products are running low on stock",
        type: "warning",
        time: "2 hours ago"
      },
      {
        id: 2,
        title: "New Order",
        message: "Order #ORD-001 received",
        type: "info",
        time: "30 minutes ago"
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here&apos;s what&apos;s happening with your store today.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <DashboardMetrics metrics={dashboardData.metrics} />

      {/* Charts and Goals Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <SalesChart />
        </div>

        {/* Revenue Goal - Takes 1 column */}
        <div>
          <RevenueGoal
            current={dashboardData.revenueGoal.current}
            target={dashboardData.revenueGoal.target}
          />
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
            {dashboardData.notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className={`h-2 w-2 rounded-full mt-2 ${notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{notification.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {notification.time}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <RecentOrders />

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}