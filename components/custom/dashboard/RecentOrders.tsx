"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import Link from "next/link";

interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  items: number;
}

interface RecentOrdersProps {
  orders?: Order[];
  showViewAll?: boolean;
}

const getStatusColor = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "processing":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "shipped":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case "delivered":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const formatStatus = (status: Order["status"]) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export function RecentOrders({ orders, showViewAll = true }: RecentOrdersProps) {
  // Mock data if no orders provided
  const mockOrders: Order[] = [
    {
      id: "ORD-001",
      customer: "John Doe",
      email: "john@example.com",
      total: 299.99,
      status: "processing",
      date: "2024-01-15",
      items: 3,
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      email: "jane@example.com",
      total: 149.5,
      status: "shipped",
      date: "2024-01-14",
      items: 2,
    },
    {
      id: "ORD-003",
      customer: "Mike Johnson",
      email: "mike@example.com",
      total: 89.99,
      status: "delivered",
      date: "2024-01-13",
      items: 1,
    },
    {
      id: "ORD-004",
      customer: "Sarah Wilson",
      email: "sarah@example.com",
      total: 199.99,
      status: "pending",
      date: "2024-01-12",
      items: 4,
    },
    {
      id: "ORD-005",
      customer: "Tom Brown",
      email: "tom@example.com",
      total: 59.99,
      status: "cancelled",
      date: "2024-01-11",
      items: 1,
    },
  ];

  const displayOrders = orders || mockOrders.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Orders</CardTitle>
        {showViewAll && (
          <Link href="/seller/orders">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        {displayOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No orders yet</p>
            <p className="text-sm text-muted-foreground">
              Your orders will appear here once customers start purchasing
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{order.id}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(order.date).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer}</div>
                      <div className="text-xs text-muted-foreground">{order.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(order.status)}>
                      {formatStatus(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
