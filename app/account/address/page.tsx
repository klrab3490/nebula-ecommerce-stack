"use client";

import Link from "next/link";
import { ChevronsLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

export default function ManageAddressesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/address", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const data = await res.json();
      setAddresses(data?.addresses ?? []);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    try {
      const res = await fetch(`/api/user/address/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchAddresses();
    } catch (err) {
      console.error(err);
      alert("Unable to delete address.");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch("/api/user/address", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isDefault: true }),
      });
      if (!res.ok) throw new Error("Failed to set default");
      await fetchAddresses();
    } catch (err) {
      console.error(err);
      alert("Unable to set default address.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div>
        <div className="mb-4">
          <Link
            href="/account"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 group hover:underline"
          >
            <Button variant="link" className="p-0">
              <ChevronsLeft
                size={20}
                className="transform transition-transform duration-200 ease-in-out group-hover:-translate-x-1"
              />
            </Button>
            <span className="transition-colors duration-200 group-hover:text-gray-900 dark:group-hover:text-gray-100">
              Back to Account
            </span>
          </Link>
        </div>
        <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Manage Addresses
        </h1>
      </div>

      <div className="mb-4">
        <Button className="btn-primary mr-2" onClick={() => router.push("/account/address/add")}>
          Add New Address
        </Button>
        <Button onClick={() => fetchAddresses()}>Refresh</Button>
      </div>

      {loading ? (
        <p className="text-gray-700 dark:text-gray-300">Loading addresses…</p>
      ) : error ? (
        <p className="text-red-600 dark:text-red-400">{error}</p>
      ) : addresses.length === 0 ? (
        <div>
          <p className="text-gray-700 dark:text-gray-300">No addresses found.</p>
          <Button className="mt-2" onClick={() => router.push("/account/address/add")}>
            Add Address
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((a) => (
            <div
              key={a.id}
              className="p-4 border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{a.name || ""}</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">{a.street}</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {a.city}, {a.state} {a.zipCode}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {a.country} • {a.phone}
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  {a.isDefault ? (
                    <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded flex items-center justify-center">
                      Default
                    </div>
                  ) : (
                    <Button className="text-sm" onClick={() => handleSetDefault(a.id)}>
                      Set default
                    </Button>
                  )}
                  <div className="flex gap-2 justify-end mt-2">
                    <Button onClick={() => router.push(`/account/address/${a.id}`)}>Edit</Button>
                    <Button onClick={() => handleDelete(a.id)}>Delete</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
