"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

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
    const searchParams = useSearchParams();
    const editId = searchParams?.get("edit");
    const [initialising, setInitialising] = useState(Boolean(editId));

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    // If ?edit=<id> is present, load the address and prefill the form
    useEffect(() => {
        async function loadForEdit() {
            if (!editId) return setInitialising(false);
            try {
                const res = await fetch("/api/user/address", { cache: "no-store" });
                if (!res.ok) throw new Error("Failed to fetch addresses");
                const data = await res.json();
                const addresses = data?.addresses ?? [];
                const toEdit = addresses.find((a: any) => a.id === editId);
                if (!toEdit) {
                    alert("Address to edit not found");
                    setInitialising(false);
                    return;
                }

                // Try to split street into line1/line2 (simple split on first comma)
                const street = toEdit.street || "";
                const [line1, ...rest] = street.split(",");
                const line2 = rest.join(",").trim();

                setForm({
                    name: form.name,
                    phone: toEdit.phone ?? "",
                    pincode: toEdit.zipCode ?? "",
                    addressLine1: (line1 || "").trim(),
                    addressLine2: line2 || "",
                    city: toEdit.city ?? "",
                    state: toEdit.state ?? "",
                });
            } catch (err) {
                console.error(err);
            } finally {
                setInitialising(false);
            }
        }
        loadForEdit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editId]);

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
            // Map our form fields to the API's expected address shape
            const payload = {
                street: form.addressLine1 + (form.addressLine2 ? ", " + form.addressLine2 : ""),
                city: form.city,
                state: form.state,
                zipCode: form.pincode,
                country: "India",
                phone: form.phone,
            };

            let res: Response;
            if (editId) {
                // Update existing address
                res = await fetch("/api/user/address", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: editId, ...payload }),
                });
            } else {
                // Create new address
                res = await fetch("/api/user/address", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }

            if (res.ok) {
                alert("Address saved!");
                router.push("/checkout"); // return to checkout
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
        <div className="max-w-xl mx-auto py-12">
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

                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full"
                >
                    {loading ? "Saving..." : "Save Address"}
                </button>
            </form>
        </div>
    );
}
