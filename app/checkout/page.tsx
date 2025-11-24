"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import { useCallback, useEffect, useState } from "react";

export default function CheckoutPage() {
    const { cart } = useAppContext();
    const [finalTotal, setFinalTotal] = useState<number>(() => {
        if (typeof window === "undefined") return 0;
        const v = localStorage.getItem("finalTotal");
        return v ? parseFloat(v) : 0;
    });
    useEffect(() => {
        if (typeof window === "undefined") return;
        const v = localStorage.getItem("finalTotal");
        setFinalTotal(v ? parseFloat(v) : 0);

        if (cart.itemCount !== 0) {
            setFinalTotal(0);
            router.push("/cart");
        }
    }, []);
    const router = useRouter();
    const [address, setAddress] = useState<any>(null);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const isAddressPresent = (addr: any) => {
        if (!addr) return false;
        if (Array.isArray(addr)) return addr.length > 0;
        if (typeof addr === "string") return addr.trim().length > 0;
        if (typeof addr === "object") {
            if (Object.keys(addr).length === 0) return false;
            return Boolean(
                addr.line1 || addr.street || addr.addressLine || addr.city || addr.postalCode
            );
        }
        return false;
    };

    // Load current user's addresses from the API and pick the default one
    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("/api/user/address", { cache: "no-store" });
                if (!res.ok) {
                    console.warn("Failed to load addresses", res.status);
                    setAddress(null);
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                const addresses: any[] = data?.addresses ?? [];
                setAddresses(addresses);

                // Prefer the address marked as default, otherwise pick the first
                const chosen = addresses.find((a) => a?.isDefault) || addresses[0] || null;
                setAddress(chosen);
                setSelectedAddressId(chosen?.id ?? addresses[0]?.id ?? null);
            } catch (err) {
                console.error("Error fetching addresses:", err);
                setAddress(null);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const handlePayNow = useCallback(async () => {
        if (!cart || finalTotal <= 0) {
            alert("Your cart is empty.");
            return;
        }

        // Check user Login

        if (!isAddressPresent(address)) {
            alert("Please add your address before making payment.");
            router.push("/add-address");
            return;
        }

        try {
            // 1) Create Razorpay order
            const res = await fetch("/api/checkout/razorpay/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // send amount in paise (integer)
                body: JSON.stringify({
                    amount: Math.round((finalTotal ?? 0) * 100),
                    currency: "INR",
                    receipt: `order_rcptid_${Date.now()}`,
                }),
            });

            if (!res.ok) {
                alert("Failed to initialize payment");
                return;
            }

            const data = await res.json();

            // 2) Load Razorpay script (if needed) and open checkout
            const loadScript = (src: string) =>
                new Promise<boolean>((resolve) => {
                    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
                    const s = document.createElement("script");
                    s.src = src;
                    s.async = true;
                    s.onload = () => resolve(true);
                    s.onerror = () => resolve(false);
                    document.body.appendChild(s);
                });

            const ok = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
            if (!ok) {
                alert("Failed to load Razorpay SDK");
                return;
            }

            const options = {
                key:
                    data.key ||
                    (window as any).RAZORPAY_KEY ||
                    (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? ""),
                amount: data.amount,
                currency: data.currency,
                name: "Nebula Shop",
                order_id: data.orderId,
                handler: async (response: any) => {
                    const verify = await fetch("/api/checkout/razorpay/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(response),
                    });

                    if (verify.ok) router.push("/checkout/success");
                    else alert("Payment verification failed.");
                },
            };

            const RazorpayClass = (window as any).Razorpay;
            if (!RazorpayClass) {
                alert("Razorpay SDK not available");
                return;
            }
            const rz = new RazorpayClass(options);
            rz.on &&
                rz.on("payment.failed", (err: any) => {
                    console.error("payment.failed", err);
                    alert("Payment failed: " + (err?.error?.description || "Unknown"));
                });
            rz.open();
        } catch (err) {
            console.error(err);
        }
    }, [cart, address, router, finalTotal]);

    if (loading) return <p className="p-6 text-gray-700 dark:text-gray-300">Checking address…</p>;

    return (
        <div className="max-w-3xl mx-auto py-12">
            <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
                Checkout
            </h1>

            <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300">
                    <strong>Items:</strong> {cart.itemCount}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                    <strong>Total:</strong> ₹{finalTotal}
                </p>

                <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                    <h3 className="font-semibold mb-2">Delivery Address</h3>

                    {addresses.length > 0 ? (
                        <div className="space-y-3">
                            <label className="block text-sm text-gray-700 dark:text-gray-300">
                                Select address
                            </label>
                            <select
                                value={selectedAddressId ?? ""}
                                onChange={(e) => {
                                    const id = e.target.value || null;
                                    setSelectedAddressId(id);
                                    const sel = addresses.find((a) => a.id === id) || null;
                                    setAddress(sel);
                                }}
                                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            >
                                {addresses.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {`${a.name}`}
                                    </option>
                                ))}
                            </select>

                            <div>
                                <form className="space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs text-gray-600 dark:text-gray-400">
                                                Street
                                            </label>
                                            <input
                                                readOnly
                                                value={address?.street ?? ""}
                                                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600 dark:text-gray-400">
                                                City
                                            </label>
                                            <input
                                                readOnly
                                                value={address?.city ?? ""}
                                                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600 dark:text-gray-400">
                                                State
                                            </label>
                                            <input
                                                readOnly
                                                value={address?.state ?? ""}
                                                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600 dark:text-gray-400">
                                                Pincode
                                            </label>
                                            <input
                                                readOnly
                                                value={address?.zipCode ?? ""}
                                                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs text-gray-600 dark:text-gray-400">
                                                Country
                                            </label>
                                            <input
                                                readOnly
                                                value={address?.country ?? ""}
                                                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600 dark:text-gray-400">
                                                Phone
                                            </label>
                                            <input
                                                readOnly
                                                value={address?.phone ?? ""}
                                                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="mt-4">
                                <Button
                                    className="btn mr-2"
                                    onClick={() => router.push("/account/address/add")}
                                >
                                    Add Address
                                </Button>
                                <Button
                                    className="btn"
                                    onClick={() => router.push("/account/address")}
                                >
                                    Manage Addresses
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="text-red-600 dark:text-red-400">No address added.</p>
                            <Button
                                className="btn mt-2"
                                onClick={() => router.push("/add-address")}
                            >
                                Add Address
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <Button className="btn btn-primary" onClick={handlePayNow}>
                Make Payment INR {finalTotal}
            </Button>
        </div>
    );
}
