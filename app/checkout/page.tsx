"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";

export default function CheckoutPage() {
    const { cart } = useAppContext();
    const router = useRouter();

    const handleProceed = async () => {
        // create order on server (will return order id and payment options)
        const res = await fetch('/api/checkout/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart })
        });

        if (res.ok) {
            router.push('/checkout/payment');
        } else {
            alert('Unable to create order.');
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-12">
            <h1 className="text-2xl font-semibold mb-6">Checkout</h1>
            <p className="mb-4">You have {cart.itemCount} items in your cart.</p>
            <div className="space-x-2">
                <button onClick={handleProceed} className="btn btn-primary">Proceed to Payment</button>
            </div>
        </div>
    )
}
