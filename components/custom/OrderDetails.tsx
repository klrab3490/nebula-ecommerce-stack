"use client";

import Link from "next/link";
import Image from "next/image";
import { orders } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";

type OrderDetailsProps = {
  order_id: string;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Delivered":
      return <CheckCircle className="h-5 w-5 mr-2 text-green-600" />;
    case "Processing":
      return <Clock className="h-5 w-5 mr-2 text-blue-600" />;
    case "Shipped":
      return <Truck className="h-5 w-5 mr-2 text-indigo-600" />;
    case "Cancelled":
      return <XCircle className="h-5 w-5 mr-2 text-red-600" />;
    default:
      return <Package className="h-5 w-5 mr-2 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-800 hover:bg-green-100 border-green-200";
    case "Processing":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200";
    case "Shipped":
      return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-indigo-200";
    case "Cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200";
  }
};

export default function OrderDetails({ order_id }: OrderDetailsProps) {
  const order = orders.find((o) => o.id === order_id);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
        <p className="text-gray-500 mt-2">The order you are looking for does not exist.</p>
        <Button asChild className="mt-6">
          <Link href="/my-orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  // Mock calculations for demo purposes
  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = order.total > 100 ? 0 : 15.0;
  const tax = subtotal * 0.08;
  // Adjust total to match the mock data total (or recalculate if we prefer correctness over strict adherence to the mock total field)
  // For this display, let's trust the mock total and show the breakdown as estimates or just calculate them to sum up to total if possible.
  // To be safe and consistent with the mock data, let's just use the total from the object and mock the rest to look reasonable.

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
              {order.status}
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
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
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
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <Button variant="link" className="h-auto p-0 text-primary text-sm">
                        Buy Again
                      </Button>
                      <Separator orientation="vertical" className="h-4" />
                      <Button variant="link" className="h-auto p-0 text-muted-foreground text-sm">
                        View Product
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
                  <p className="font-medium text-sm">Order Delivered</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{order.date} - 2:30 PM</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Package was handed directly to a resident.
                  </p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[29px] top-0 h-4 w-4 rounded-full bg-muted-foreground/30 ring-4 ring-background" />
                  <p className="font-medium text-sm">Out for Delivery</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{order.date} - 8:45 AM</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[29px] top-0 h-4 w-4 rounded-full bg-muted-foreground/30 ring-4 ring-background" />
                  <p className="font-medium text-sm">Shipped</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{order.date} - 5:20 AM</p>
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
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Shipping Address
                </h4>
                <address className="text-sm text-muted-foreground not-italic pl-6">
                  Rahul Sharma
                  <br />
                  123 Tech Park, Sector 4<br />
                  Bangalore, KA 560103
                  <br />
                  India
                </address>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  Payment Method
                </h4>
                <p className="text-sm text-muted-foreground pl-6">Visa ending in 4242</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
