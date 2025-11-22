"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ManageAddressesPage() {
    const router = useRouter();
    const [addresses, setAddresses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
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
            const res = await fetch(`/api/user/address?id=${encodeURIComponent(id)}`, {
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
        <div className="max-w-3xl mx-auto py-12">
            <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Manage Addresses</h1>

            <div className="mb-4">
                <button className="btn btn-primary mr-2" onClick={() => router.push("/add-address")}>Add New Address</button>
                <button className="btn" onClick={() => fetchAddresses()}>Refresh</button>
            </div>

            {loading ? (
                <p className="text-gray-700 dark:text-gray-300">Loading addresses…</p>
            ) : error ? (
                <p className="text-red-600 dark:text-red-400">{error}</p>
            ) : addresses.length === 0 ? (
                <div>
                    <p className="text-gray-700 dark:text-gray-300">No addresses found.</p>
                    <button className="btn mt-2" onClick={() => router.push("/add-address")}>Add Address</button>
                </div>
            ) : (
                <div className="space-y-4">
                    {addresses.map((a) => (
                        <div key={a.id} className="p-4 border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-gray-100">{a.street}</div>
                                    <div className="text-sm text-gray-700 dark:text-gray-300">{a.city}, {a.state} {a.zipCode}</div>
                                    <div className="text-sm text-gray-700 dark:text-gray-300">{a.country} • {a.phone}</div>
                                </div>
                                <div className="space-y-2 text-right">
                                    {a.isDefault ? (
                                        <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Default</div>
                                    ) : (
                                        <button className="btn text-sm" onClick={() => handleSetDefault(a.id)}>Set default</button>
                                    )}
                                    <div className="flex gap-2 justify-end mt-2">
                                        <button className="btn" onClick={() => router.push(`/add-address?edit=${a.id}`)}>Edit</button>
                                        <button className="btn" onClick={() => handleDelete(a.id)}>Delete</button>
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
