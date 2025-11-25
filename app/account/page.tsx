"use client";

import Link from "next/link";
import { ChevronsLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";

export default function AccountPage() {
  const { userData, isSeller } = useAppContext();

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div>
        <div className="mb-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 group hover:underline"
          >
            <Button variant="link" className="p-0">
              <ChevronsLeft
                size={20}
                className="transform transition-transform duration-200 ease-in-out group-hover:-translate-x-1"
              />
            </Button>
            <span className="transition-colors duration-200 group-hover:text-gray-900 dark:group-hover:text-gray-100">
              Back to Home
            </span>
          </Link>
        </div>
        <h1 className="text-2xl font-semibold mb-6">My Account</h1>
      </div>

      <section className="bg-card/50 dark:bg-card p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-medium">Profile</h2>
        <p className="mt-2 text-xl">{userData ? (userData as any).name : "Guest"}</p>
        <p className="text-sm text-muted-foreground">{(userData as any)?.email}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/account/address" className="no-underline">
            <Button variant="outline">Manage Addresses</Button>
          </Link>

          <Link href="/my-orders" className="no-underline">
            <Button variant="outline">My Orders</Button>
          </Link>

          {isSeller && (
            <Link href="/seller" className="no-underline">
              <Button>Seller Dashboard</Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
