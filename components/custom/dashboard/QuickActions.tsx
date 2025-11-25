"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Users,
  Download,
  Upload,
} from "lucide-react";
import Link from "next/link";

interface QuickAction {
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
  variant?: "default" | "secondary" | "outline";
}

export function QuickActions() {
  const primaryActions: QuickAction[] = [
    {
      label: "Add New Product",
      description: "List a new product for sale",
      href: "/seller/products/new",
      icon: Plus,
      variant: "default",
    },
    {
      label: "View All Orders",
      description: "Manage customer orders",
      href: "/seller/orders",
      icon: ShoppingCart,
      variant: "outline",
    },
    {
      label: "Product Inventory",
      description: "Manage your product catalog",
      href: "/seller/product-list",
      icon: Package,
      variant: "outline",
    },
    {
      label: "Analytics Report",
      description: "View detailed performance metrics",
      href: "/seller/analytics",
      icon: BarChart3,
      variant: "outline",
    },
  ];

  const secondaryActions: QuickAction[] = [
    {
      label: "Customer Management",
      description: "View and manage customers",
      href: "/seller/customers",
      icon: Users,
      variant: "secondary",
    },
    {
      label: "Export Data",
      description: "Download reports and data",
      href: "/seller/exports",
      icon: Download,
      variant: "secondary",
    },
    {
      label: "Import Products",
      description: "Bulk upload products via CSV",
      href: "/seller/import",
      icon: Upload,
      variant: "secondary",
    },
    {
      label: "Settings",
      description: "Configure your store settings",
      href: "/seller/settings",
      icon: Settings,
      variant: "secondary",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Primary Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {primaryActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} href={action.href}>
                  <Button
                    variant={action.variant || "outline"}
                    className="h-auto p-4 flex flex-col items-start gap-2 w-full text-left"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{action.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </Button>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Secondary Actions */}
      <Card>
        <CardHeader>
          <CardTitle>More Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            {secondaryActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} href={action.href}>
                  <Button variant="ghost" className="h-auto p-3 justify-start gap-3 w-full">
                    <Icon className="h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium text-sm">{action.label}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </Button>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
