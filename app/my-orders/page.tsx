"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  Filter,
  AlertCircle,
} from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return <CheckCircle className="h-4 w-4 mr-1" />;
    case "pending":
    case "confirmed":
      return <Clock className="h-4 w-4 mr-1" />;
    case "paid":
      return <Truck className="h-4 w-4 mr-1" />;
    case "cancelled":
      return <XCircle className="h-4 w-4 mr-1" />;
    default:
      return <Package className="h-4 w-4 mr-1" />;
  }
};

const formatStatusDisplay = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/orders");

      if (!response.ok) {
        if (response.status === 401) {
          setError("Please log in to view your orders");
        } else {
          setError("Failed to load orders");
        }
        return;
      }

      const data = await response.json();
      setOrders(data.orders || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("An error occurred while loading your orders");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => order.status.toLowerCase() === activeTab);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 flex gap-4">
          <AlertCircle className="h-6 w-6 text-destructive shrink-0" />
          <div>
            <h3 className="font-semibold text-destructive mb-2">Error</h3>
            <p className="text-sm text-destructive/90 mb-4">{error}</p>
            <Button onClick={fetchOrders} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground mt-1">View and track your order history.</p>
        </div>
        <Button variant="outline" className="hidden md:flex">
          <Filter className="mr-2 h-4 w-4" /> Filter Orders
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="overflow-hidden border-muted/60 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <CardHeader className="bg-muted/30 flex flex-row items-center justify-between py-4 px-6">
                  <div className="flex flex-col md:flex-row md:gap-8 gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                        Order Placed
                      </span>
                      <span className="text-sm font-medium">{order.date}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                        Total
                      </span>
                      <span className="text-sm font-medium">{formatCurrency(order.total)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                        Order #
                      </span>
                      <span className="text-sm font-medium">{order.id}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" className="hidden md:flex" asChild>
                      <Link href={`/my-orders/${order.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="font-semibold text-lg flex items-center">
                          {getStatusIcon(order.status)}
                          {formatStatusDisplay(order.status)}
                        </h3>
                      </div>

                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4 items-start">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-muted">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-base line-clamp-2">{item.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-sm font-medium mt-1 text-primary">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-3 justify-center md:items-end md:min-w-[200px] border-t md:border-t-0 md:border-l border-muted pt-4 md:pt-0 md:pl-6">
                      <Button asChild className="w-full md:w-auto">
                        <Link href={`/my-orders/${order.id}`}>View Details</Link>
                      </Button>
                      <Button variant="outline" className="w-full md:w-auto">
                        Write a Review
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full md:w-auto text-muted-foreground hover:text-primary"
                        asChild
                      >
                        <Link
                          href={`/products/${order.items[0].id}`}
                          className="flex items-center justify-center md:justify-end"
                        >
                          Buy Again <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-16 bg-muted/20 rounded-lg border border-dashed border-muted">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-medium">No orders found</h3>
              <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
                {activeTab === "all"
                  ? "You haven't placed any orders yet."
                  : `You have no orders with the status "${activeTab}".`}
              </p>
              <Button className="mt-6" asChild>
                <Link href="/">Start Shopping</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
