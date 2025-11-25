"use client";

import Link from "next/link";
import { ChevronsLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

type Props = { id: string };

export default function AddressForm({ id }: Props) {
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
  const [initialising, setInitialising] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/user/address/${id}`, { cache: "no-store" });

        if (!res.ok) {
          throw new Error(`Failed to fetch address. Status: ${res.status}`);
        }

        const data = await res.json();
        const toEdit = data.address || data;
        const street = toEdit.street || "";
        const [line1, ...rest] = street.split(",").map((s: string) => s.trim());
        const line2 = rest.join(", ").trim();

        setForm({
          name: toEdit.name ?? "",
          phone: toEdit.phone ?? "",
          pincode: toEdit.zipCode ?? "",
          addressLine1: line1 || "",
          addressLine2: line2 || "",
          city: toEdit.city ?? "",
          state: toEdit.state ?? "",
        });
      } catch (err) {
        console.error(err);
        if (!id) {
          alert("Unable to load address details");
          router.push("/account/address");
        }
      } finally {
        setInitialising(false);
      }
    }

    load();
  }, [id, router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

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
        id: id,
        name: form.name,
        street: form.addressLine1 + (form.addressLine2 ? ", " + form.addressLine2 : ""),
        city: form.city,
        state: form.state,
        zipCode: form.pincode,
        country: "India",
        phone: form.phone,
      };

      const res = await fetch("/api/user/address", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Address updated!");
        router.push("/checkout");
      } else {
        const errorData = await res.json();
        alert(`Unable to update address: ${errorData.message || "Server error."}`);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong with the network request.");
    }

    setLoading(false);
  }

  if (initialising) {
    return <div className="py-12 max-w-xl mx-auto">Loading address...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div>
        <div className="mb-4">
          <Link
            href="/account/address"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 group hover:underline"
          >
            <Button variant="link" className="p-0">
              <ChevronsLeft
                size={20}
                className="transform transition-transform duration-200 ease-in-out group-hover:-translate-x-1"
              />
            </Button>
            <span className="transition-colors duration-200 group-hover:text-gray-900 dark:group-hover:text-gray-100">
              Back to Address
            </span>
          </Link>
        </div>
        <h1 className="text-2xl font-semibold mb-6">Edit Delivery Address</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" />
        <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" />
        <Input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode" />
        <Input
          name="addressLine1"
          value={form.addressLine1}
          onChange={handleChange}
          placeholder="Address Line 1"
        />
        <Input
          name="addressLine2"
          value={form.addressLine2}
          onChange={handleChange}
          placeholder="Address Line 2 (optional)"
        />
        <Input name="city" value={form.city} onChange={handleChange} placeholder="City" />
        <Input name="state" value={form.state} onChange={handleChange} placeholder="State" />

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Saving..." : "Update Address"}
        </button>
      </form>
    </div>
  );
}
