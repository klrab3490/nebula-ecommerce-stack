"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Users,
  PlusCircle,
  ArrowLeft,
  Store,
} from "lucide-react";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/seller",
    icon: Home,
    description: "Overview & Analytics",
  },
  {
    label: "Products",
    href: "/seller/products",
    icon: Package,
    description: "Manage inventory",
  },
  {
    label: "Orders",
    href: "/seller/orders",
    icon: ShoppingCart,
    description: "Process orders",
  },
  {
    label: "Analytics",
    href: "/seller/analytics",
    icon: BarChart3,
    description: "Performance insights",
  },
  {
    label: "Customers",
    href: "/seller/customers",
    icon: Users,
    description: "Customer management",
  },
];

const quickActions = [
  {
    label: "Add Product",
    href: "/seller/products/new",
    icon: PlusCircle,
  },
  {
    label: "Settings",
    href: "/seller/settings",
    icon: Settings,
  },
];

export default function SellerSideBarClient() {
  const pathname = usePathname();

  return (
    <aside className="border-r bg-background h-screen w-64 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-2 mb-2">
          <Store className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold">Seller Portal</h2>
        </div>
        <p className="text-sm text-muted-foreground">Manage your business</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-auto p-3",
                    isActive && "bg-secondary text-secondary-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>

        <Separator className="my-4" />

        {/* Quick Actions */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground px-3 mb-2">Quick Actions</p>
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link key={action.href} href={action.href}>
                <Button variant="ghost" className="w-full justify-start gap-3 h-10">
                  <Icon className="h-4 w-4" />
                  {action.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <ArrowLeft className="h-4 w-4" />
            Back to Store
          </Button>
        </Link>
      </div>
    </aside>
  );
}
