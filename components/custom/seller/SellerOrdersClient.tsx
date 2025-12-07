"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/currency";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Package,
  Truck,
  Clock,
  RefreshCw,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded" | string;
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  orderDate: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

type Props = { orders: Order[] };

export default function SellerOrdersClient({ orders: initialOrders }: Props) {
  const [orders] = useState<Order[]>(initialOrders || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      pending: { variant: "outline" as const, color: "text-yellow-600", icon: Clock },
      processing: { variant: "default" as const, color: "text-blue-600", icon: RefreshCw },
      shipped: { variant: "secondary" as const, color: "text-purple-600", icon: Truck },
      delivered: { variant: "default" as const, color: "text-green-600", icon: CheckCircle },
      cancelled: { variant: "destructive" as const, color: "text-red-600", icon: XCircle },
    } as const;

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentBadge = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600">
            Pending
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "refunded":
        return <Badge variant="secondary">Refunded</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    // In a real app this would call an API to update status and refresh
    // console.log(`Updating order ${orderId} to status: ${newStatus}`);
  };

  const ordersByStatus = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">Track and manage customer orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Orders
          </Button>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Order Status Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all" className="text-xs">
            All ({ordersByStatus.all})
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs">
            Pending ({ordersByStatus.pending})
          </TabsTrigger>
          <TabsTrigger value="processing" className="text-xs">
            Processing ({ordersByStatus.processing})
          </TabsTrigger>
          <TabsTrigger value="shipped" className="text-xs">
            Shipped ({ordersByStatus.shipped})
          </TabsTrigger>
          <TabsTrigger value="delivered" className="text-xs">
            Delivered ({ordersByStatus.delivered})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="text-xs">
            Cancelled ({ordersByStatus.cancelled})
          </TabsTrigger>
        </TabsList>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order ID, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" /> Status:{" "}
                      {statusFilter === "all" ? "All" : statusFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("processing")}>
                      Processing
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("shipped")}>
                      Shipped
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("delivered")}>
                      Delivered
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("cancelled")}>
                      Cancelled
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No orders found</p>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "Try adjusting your search"
                      : "Orders will appear here as customers place them"}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{order.id}</div>
                            {order.trackingNumber && (
                              <div className="text-xs text-muted-foreground">
                                Track: {order.trackingNumber}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customer.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {order.customer.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.items.length} items</div>
                            <div className="text-xs text-muted-foreground">
                              {order.items[0]?.name}
                              {order.items.length > 1 && ` +${order.items.length - 1} more`}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(order.total)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{getPaymentBadge(order.paymentStatus)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                                <Eye className="h-4 w-4 mr-2" /> View Details
                              </DropdownMenuItem>
                              {order.status === "pending" && (
                                <DropdownMenuItem
                                  onClick={() => updateOrderStatus(order.id, "processing")}
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" /> Mark Processing
                                </DropdownMenuItem>
                              )}
                              {order.status === "processing" && (
                                <DropdownMenuItem
                                  onClick={() => updateOrderStatus(order.id, "shipped")}
                                >
                                  <Truck className="h-4 w-4 mr-2" /> Mark Shipped
                                </DropdownMenuItem>
                              )}
                              {order.status === "shipped" && (
                                <DropdownMenuItem
                                  onClick={() => updateOrderStatus(order.id, "delivered")}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" /> Mark Delivered
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {(["pending", "processing", "shipped", "delivered", "cancelled"] as const).map((status) => (
          <TabsContent key={status} value={status}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {status.charAt(0).toUpperCase() + status.slice(1)} Orders (
                  {orders.filter((o) => o.status === status).length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Orders with {status} status would be displayed here with the same table structure.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>Order Details - {selectedOrder.id}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <p>{selectedOrder.customer.name}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.customer.email}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-1">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
