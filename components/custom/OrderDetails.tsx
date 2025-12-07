"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";
import {
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Package,
  MapPin,
  CreditCard,
  ArrowLeft,
  Download,
  HelpCircle,
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
  razorpayOrderId?: string;
  paymentMethod?: string;
  createdAt?: string;
}

type OrderDetailsProps = {
  order_id: string;
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return <CheckCircle className="h-5 w-5 mr-2 text-green-600" />;
    case "pending":
    case "confirmed":
      return <Clock className="h-5 w-5 mr-2 text-blue-600" />;
    case "paid":
      return <Truck className="h-5 w-5 mr-2 text-indigo-600" />;
    case "cancelled":
      return <XCircle className="h-5 w-5 mr-2 text-red-600" />;
    default:
      return <Package className="h-5 w-5 mr-2 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-800 hover:bg-green-100 border-green-200";
    case "pending":
    case "confirmed":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200";
    case "paid":
      return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-indigo-200";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200";
  }
};

const formatStatusDisplay = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default function OrderDetails({ order_id }: OrderDetailsProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [order_id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${order_id}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Order not found");
        } else if (response.status === 401) {
          setError("Please log in to view this order");
        } else {
          setError("Failed to load order details");
        }
        return;
      }

      const data = await response.json();
      setOrder(data.order);
      setError(null);
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("An error occurred while loading the order");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="pl-0 hover:bg-transparent hover:text-primary"
          >
            <Link href="/my-orders" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to My Orders
            </Link>
          </Button>
        </div>
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 flex gap-4">
          <AlertCircle className="h-6 w-6 text-destructive shrink-0" />
          <div>
            <h3 className="font-semibold text-destructive mb-2">Error</h3>
            <p className="text-sm text-destructive/90 mb-4">{error || "Order not found"}</p>
            <Button onClick={fetchOrderDetails} variant="outline" size="sm" className="mr-2">
              Try Again
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/my-orders">Back to Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 0;
  const tax = 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="pl-0 hover:bg-transparent hover:text-primary"
        >
          <Link href="/my-orders" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to My Orders
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Order #{order.id}
            <Badge
              className={`text-sm font-medium px-3 py-1 ${getStatusColor(order.status)}`}
              variant="outline"
            >
              {formatStatusDisplay(order.status)}
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            Placed on <span className="font-medium text-foreground">{order.date}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <HelpCircle className="mr-2 h-4 w-4" />
            Need Help?
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-start">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-muted bg-muted/50">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-medium text-base line-clamp-2">{item.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold whitespace-nowrap">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <Button variant="link" className="h-auto p-0 text-primary text-sm" asChild>
                        <Link href={`/products/${item.id}`}>Buy Again</Link>
                      </Button>
                      <Separator orientation="vertical" className="h-4" />
                      <Button
                        variant="link"
                        className="h-auto p-0 text-muted-foreground text-sm"
                        asChild
                      >
                        <Link href={`/products/${item.id}`}>View Product</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 border-l-2 border-muted space-y-8">
                <div className="relative">
                  <span className="absolute -left-[29px] top-0 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                  <p className="font-medium text-sm">Order {formatStatusDisplay(order.status)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{order.date}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {order.status === "delivered"
                      ? "Package was delivered."
                      : order.status === "cancelled"
                        ? "Order was cancelled."
                        : "Order is being processed."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  Payment Method
                </h4>
                <p className="text-sm text-muted-foreground pl-6">
                  {order.paymentMethod
                    ? order.paymentMethod.toUpperCase()
                    : "Payment method not specified"}
                </p>
              </div>
              {order.razorpayOrderId && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Order ID</h4>
                    <p className="text-sm text-muted-foreground font-mono break-all">
                      {order.razorpayOrderId}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
