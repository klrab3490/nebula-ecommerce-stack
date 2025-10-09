"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { formatCurrency } from '@/lib/currency';
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
  };
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  trend = 'neutral',
  description
}: MetricCardProps) {
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
        <div className="text-2xl font-bold mb-1">{value}</div>
        {change && (
          <div className={cn("flex items-center text-xs", getTrendColor())}>
            <TrendIcon className="h-3 w-3 mr-1" />
            <span className="font-medium">{change.value}%</span>
            <span className="ml-1 text-muted-foreground">{change.label}</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}


interface DashboardMetricsProps {
  metrics?: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    conversionRate: number;
    avgOrderValue: number;
  };
}

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  // Mock data if no metrics provided
  const data = metrics || {
    totalRevenue: 45231.89,
    totalOrders: 1234,
    totalProducts: 89,
    totalCustomers: 573,
    conversionRate: 3.2,
    avgOrderValue: 36.67
  };

  const cards: MetricCardProps[] = [
    {
      title: "Total Revenue",
      value: formatCurrency(data.totalRevenue),
      change: { value: 20.1, label: "from last month" },
      icon: DollarSign,
      trend: 'up',
      description: "Total earnings this month"
    },
    {
      title: "Total Orders",
      value: data.totalOrders.toLocaleString(),
      change: { value: 12.5, label: "from last month" },
      icon: ShoppingCart,
      trend: 'up',
      description: "Orders processed this month"
    },
    {
      title: "Active Products",
      value: data.totalProducts,
      change: { value: 5.2, label: "new this month" },
      icon: Package,
      trend: 'up',
      description: "Products currently listed"
    },
    {
      title: "Total Customers",
      value: data.totalCustomers,
      change: { value: 8.7, label: "from last month" },
      icon: Users,
      trend: 'up',
      description: "Unique customers served"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <MetricCard key={index} {...card} />
      ))}
    </div>
  );
}

interface RevenueGoalProps {
  current: number;
  target: number;
  period?: string;
}

export function RevenueGoal({ current, target, period = "this month" }: RevenueGoalProps) {
  const percentage = Math.min(100, (current / target) * 100);
  const remaining = target - current;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Revenue Goal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress {period}</span>
            <span className="font-medium">{percentage.toFixed(1)}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Current</p>
            <p className="font-bold text-lg">{formatCurrency(current)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Target</p>
            <p className="font-bold text-lg">{formatCurrency(target)}</p>
          </div>
        </div>

        {remaining > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              {formatCurrency(remaining)} remaining to reach goal
            </p>
          </div>
        )}

        {percentage >= 100 && (
          <Badge variant="default" className="w-full justify-center">
            🎉 Goal Achieved!
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}