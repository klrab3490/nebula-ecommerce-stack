"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart, ChartData } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Calendar, DollarSign } from "lucide-react";

interface SalesChartProps {
  data?: {
    daily?: ChartData[];
    weekly?: ChartData[];
    monthly?: ChartData[];
  };
}

export function SalesChart({ data }: SalesChartProps) {
  // Mock data if none provided
  const mockData = {
    daily: [
      { name: "Mon", value: 1200 },
      { name: "Tue", value: 1900 },
      { name: "Wed", value: 800 },
      { name: "Thu", value: 1600 },
      { name: "Fri", value: 2200 },
      { name: "Sat", value: 2800 },
      { name: "Sun", value: 1400 }
    ],
    weekly: [
      { name: "Week 1", value: 8500 },
      { name: "Week 2", value: 12000 },
      { name: "Week 3", value: 9800 },
      { name: "Week 4", value: 15200 }
    ],
    monthly: [
      { name: "Jan", value: 45000 },
      { name: "Feb", value: 52000 },
      { name: "Mar", value: 48000 },
      { name: "Apr", value: 61000 },
      { name: "May", value: 55000 },
      { name: "Jun", value: 67000 }
    ]
  };

  const chartData = data || mockData;

  const getTotalSales = (period: 'daily' | 'weekly' | 'monthly') => {
    const periodData = chartData[period] || [];
    return periodData.reduce((sum, item) => sum + item.value, 0);
  };

  const getAverageGrowth = (period: 'daily' | 'weekly' | 'monthly') => {
    const periodData = chartData[period] || [];
    if (periodData.length < 2) return 0;

    let totalGrowth = 0;
    for (let i = 1; i < periodData.length; i++) {
      const growth = ((periodData[i].value - periodData[i - 1].value) / periodData[i - 1].value) * 100;
      totalGrowth += growth;
    }
    return totalGrowth / (periodData.length - 1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Sales Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily" className="text-xs">Daily</TabsTrigger>
            <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Total (7 days)
                </p>
                <p className="text-lg font-bold">${getTotalSales('daily').toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Avg. Growth
                </p>
                <p className={`text-lg font-bold ${getAverageGrowth('daily') >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {getAverageGrowth('daily') >= 0 ? '+' : ''}{getAverageGrowth('daily').toFixed(1)}%
                </p>
              </div>
            </div>
            <Chart data={chartData.daily || []} height={200} type="bar" />
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Total (4 weeks)
                </p>
                <p className="text-lg font-bold">${getTotalSales('weekly').toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Avg. Growth
                </p>
                <p className={`text-lg font-bold ${getAverageGrowth('weekly') >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {getAverageGrowth('weekly') >= 0 ? '+' : ''}{getAverageGrowth('weekly').toFixed(1)}%
                </p>
              </div>
            </div>
            <Chart data={chartData.weekly || []} height={200} type="line" />
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Total (6 months)
                </p>
                <p className="text-lg font-bold">${getTotalSales('monthly').toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Avg. Growth
                </p>
                <p className={`text-lg font-bold ${getAverageGrowth('monthly') >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {getAverageGrowth('monthly') >= 0 ? '+' : ''}{getAverageGrowth('monthly').toFixed(1)}%
                </p>
              </div>
            </div>
            <Chart data={chartData.monthly || []} height={200} type="bar" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}