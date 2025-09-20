"use client";

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, ShoppingCart, Users, Package, Eye, Calendar, Download, ArrowUpRight, ArrowDownRight, BarChart3, Activity } from "lucide-react";

export default function AnalyticsPage() {
  // Mock data for analytics
  const overviewMetrics = [
    {
      title: "Total Revenue",
      value: "$12,847",
      change: { value: 12.5, label: "from last month" },
      trend: "up" as const,
      icon: DollarSign,
      description: "Total earnings this month"
    },
    {
      title: "Orders",
      value: "184",
      change: { value: 8.2, label: "from last week" },
      trend: "up" as const,
      icon: ShoppingCart,
      description: "Orders received"
    },
    {
      title: "Products Sold",
      value: "342",
      change: { value: -3.1, label: "from last week" },
      trend: "down" as const,
      icon: Package,
      description: "Units sold"
    },
    {
      title: "Page Views",
      value: "2,847",
      change: { value: 15.8, label: "from last week" },
      trend: "up" as const,
      icon: Eye,
      description: "Product page visits"
    }
  ];

  const salesData = {
    daily: [
      { name: "Mon", sales: 1200, orders: 8, visitors: 145 },
      { name: "Tue", sales: 1900, orders: 12, visitors: 198 },
      { name: "Wed", sales: 800, orders: 6, visitors: 123 },
      { name: "Thu", sales: 1600, orders: 11, visitors: 167 },
      { name: "Fri", sales: 2200, orders: 15, visitors: 234 },
      { name: "Sat", sales: 2800, orders: 18, visitors: 289 },
      { name: "Sun", sales: 1400, orders: 9, visitors: 156 }
    ],
    topProducts: [
      { name: "Premium Wireless Headphones", sold: 45, revenue: 6750 },
      { name: "Smart Fitness Watch", sold: 32, revenue: 4800 },
      { name: "Gaming Mouse", sold: 28, revenue: 2240 },
      { name: "USB-C Hub", sold: 24, revenue: 1800 },
      { name: "Wireless Charging Pad", sold: 18, revenue: 1350 }
    ]
  };

  interface MetricCardProps {
    title: string;
    value: string;
    change?: {
      value: number;
      label: string;
    };
    trend: 'up' | 'down' | 'neutral';
    icon: React.ElementType;
    description?: string;
  }

  const MetricCard = ({ title, value, change, trend, icon: Icon, description }: MetricCardProps) => {
    const getTrendColor = () => {
      switch (trend) {
        case 'up': return 'text-green-600';
        case 'down': return 'text-red-600';
        default: return 'text-muted-foreground';
      }
    };

    const TrendIcon = trend === 'up' ? ArrowUpRight : ArrowDownRight;

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {change && (
            <div className="flex items-center space-x-1 text-xs">
              <TrendIcon className={`h-3 w-3 ${getTrendColor()}`} />
              <span className={getTrendColor()}>
                {Math.abs(change.value)}% {change.label}
              </span>
            </div>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track your sales performance and customer insights
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 days
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
        </TabsList>

        {/* Sales Analytics */}
        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Sales Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.daily.map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 text-sm text-muted-foreground">{day.name}</div>
                        <Progress
                          value={(day.sales / 3000) * 100}
                          className="w-32 h-2"
                        />
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span className="font-medium">${day.sales}</span>
                        <span className="text-muted-foreground">{day.orders} orders</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Sales Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">This Week</span>
                    <span className="font-medium">$11,900</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Week</span>
                    <span className="font-medium">$9,800</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Growth</span>
                    <span className="font-medium">+21.4%</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Performance Goals</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Monthly Target</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Customer Satisfaction</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Product Analytics */}
        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <div className="font-medium text-sm">{product.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {product.sold} units sold
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${product.revenue}</div>
                        <div className="text-xs text-muted-foreground">revenue</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">147</div>
                    <div className="text-sm text-muted-foreground">Active Products</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">23</div>
                    <div className="text-sm text-muted-foreground">Low Stock</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Conversion Rate</span>
                      <span className="text-green-600">4.2%</span>
                    </div>
                    <Progress value={42} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Return Rate</span>
                      <span className="text-red-600">1.8%</span>
                    </div>
                    <Progress value={18} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Avg. Rating</span>
                      <span>4.6/5</span>
                    </div>
                    <Progress value={92} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customer Analytics */}
        <TabsContent value="customers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Customer Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">1,247</div>
                  <div className="text-sm text-muted-foreground">Total Customers</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">New Customers</span>
                    <span className="text-sm font-medium">+23 this week</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Returning Customers</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Customer Lifetime Value</span>
                    <span className="text-sm font-medium">$186</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Premium Customers</span>
                    <span>15%</span>
                  </div>
                  <Progress value={15} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Regular Customers</span>
                    <span>53%</span>
                  </div>
                  <Progress value={53} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Occasional Buyers</span>
                    <span>32%</span>
                  </div>
                  <Progress value={32} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Satisfaction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">4.6</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>5 Stars</span>
                    <span>67%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>4 Stars</span>
                    <span>21%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>3 Stars</span>
                    <span>8%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>2 Stars</span>
                    <span>3%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>1 Star</span>
                    <span>1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Traffic Analytics */}
        <TabsContent value="traffic" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Traffic Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl font-bold">12.4K</div>
                    <div className="text-sm text-muted-foreground">Page Views</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl font-bold">3.2K</div>
                    <div className="text-sm text-muted-foreground">Unique Visitors</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {salesData.daily.map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{day.name}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(day.visitors / 300) * 100} className="w-20 h-2" />
                        <span className="text-sm font-medium w-12">{day.visitors}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Direct Traffic</span>
                      <span>42%</span>
                    </div>
                    <Progress value={42} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Search Engines</span>
                      <span>35%</span>
                    </div>
                    <Progress value={35} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Social Media</span>
                      <span>15%</span>
                    </div>
                    <Progress value={15} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Referrals</span>
                      <span>8%</span>
                    </div>
                    <Progress value={8} />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Bounce Rate</span>
                    <span className="text-orange-600">32%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg. Session Duration</span>
                    <span>4m 23s</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}