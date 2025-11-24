"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    Eye,
    Calendar,
    Download,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
} from "lucide-react";
import { formatCurrency } from "@/lib/currency";

type DailyPoint = { name: string; sales: number; orders: number; visitors?: number };
type TopProduct = { name: string; sold: number; revenue: number };

type Metric = {
    title: string;
    value: string | number;
    change?: { value: number; label: string };
    trend: "up" | "down" | "neutral";
    icon: string; // icon key, resolved on client
    description?: string;
};

type Props = {
    overviewMetrics: Metric[];
    salesDaily: DailyPoint[];
    topProducts: TopProduct[];
    totals: { weekly?: number; lastWeek?: number; growthPercent?: number };
};

const MetricCard = ({ title, value, change, trend, icon, description }: Metric) => {
    const getTrendColor = () => {
        switch (trend) {
            case "up":
                return "text-green-600";
            case "down":
                return "text-red-600";
            default:
                return "text-muted-foreground";
        }
    };

    const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;

    const iconMap: Record<string, React.ElementType> = {
        dollar: DollarSign,
        orders: ShoppingCart,
        products: Package,
        users: Users,
        eye: Eye,
    };

    const Icon = iconMap[icon] || DollarSign;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
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
                {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
            </CardContent>
        </Card>
    );
};

export default function SellerAnalyticsClient({
    overviewMetrics,
    salesDaily,
    topProducts,
    totals,
}: Props) {
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {overviewMetrics.map((metric, i) => (
                    <MetricCard key={i} {...metric} />
                ))}
            </div>

            <Tabs defaultValue="sales" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="sales">Sales</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="customers">Customers</TabsTrigger>
                    <TabsTrigger value="traffic">Traffic</TabsTrigger>
                </TabsList>

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
                                    {salesDaily.map((day, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 text-sm text-muted-foreground">
                                                    {day.name}
                                                </div>
                                                <Progress
                                                    value={(day.sales / 3000) * 100}
                                                    className="w-32 h-2"
                                                />
                                            </div>
                                            <div className="flex gap-4 text-sm">
                                                <span className="font-medium">
                                                    {formatCurrency(day.sales)}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    {day.orders} orders
                                                </span>
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
                                        <span className="font-medium">
                                            {formatCurrency(totals.weekly || 0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Last Week</span>
                                        <span className="font-medium">
                                            {formatCurrency(totals.lastWeek || 0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-green-600">
                                        <span>Growth</span>
                                        <span className="font-medium">
                                            {totals.growthPercent
                                                ? `${totals.growthPercent.toFixed(1)}%`
                                                : "0%"}
                                        </span>
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

                <TabsContent value="products" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Selling Products</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topProducts.map((product, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Badge
                                                    variant="secondary"
                                                    className="w-6 h-6 rounded-full p-0 flex items-center justify-center"
                                                >
                                                    {i + 1}
                                                </Badge>
                                                <div>
                                                    <div className="font-medium text-sm">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {product.sold} units sold
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium">
                                                    {formatCurrency(product.revenue)}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    revenue
                                                </div>
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
                                        <div className="text-2xl font-bold text-green-600">
                                            {/* placeholder */}147
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Active Products
                                        </div>
                                    </div>
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-orange-600">
                                            {/* placeholder */}23
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Low Stock
                                        </div>
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
                                    <div className="text-3xl font-bold">
                                        {/* placeholder */}1,247
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Total Customers
                                    </div>
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
                                        <span className="text-sm font-medium">
                                            {formatCurrency(186)}
                                        </span>
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
                                    <div className="text-sm text-muted-foreground">
                                        Average Rating
                                    </div>
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
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
