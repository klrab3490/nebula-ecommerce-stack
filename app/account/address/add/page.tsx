"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddAddressPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        phone: "",
        pincode: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
    });

    const [loading, setLoading] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Basic validation
        if (
            !form.name ||
            !form.phone ||
            !form.pincode ||
            !form.addressLine1 ||
            !form.city ||
            !form.state
        ) {
            alert("Please fill all required fields.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                name: form.name,
                street: form.addressLine1 + (form.addressLine2 ? ", " + form.addressLine2 : ""),
                city: form.city,
                state: form.state,
                zipCode: form.pincode,
                country: "India",
                phone: form.phone,
            };

            const res = await fetch("/api/user/address", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert("Address saved!");
                router.push("/checkout");
            } else {
                const errText = await res.text();
                console.error("Save failed:", errText);
                alert("Unable to save address.");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        }

        setLoading(false);
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold mb-6">Add Delivery Address</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full"
                />

                <Input
                    name="phone"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full"
                />

                <Input
                    name="pincode"
                    placeholder="Pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    className="w-full"
                />

                <Input
                    name="addressLine1"
                    placeholder="House no, Street (Address Line 1)"
                    value={form.addressLine1}
                    onChange={handleChange}
                    className="w-full"
                />

                <Input
                    name="addressLine2"
                    placeholder="Landmark (optional)"
                    value={form.addressLine2}
                    onChange={handleChange}
                    className="w-full"
                />

                <Input
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full"
                />

                <Input
                    name="state"
                    placeholder="State"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full"
                />

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Saving..." : "Save Address"}
                </Button>
            </form>
        </div>
    );
}
