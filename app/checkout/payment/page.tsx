"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

type RazorpayResponse = {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

declare global {
    interface Window {
        Razorpay?: new (opts: unknown) => { open: () => void }
    }
}

export default function CheckoutPaymentPage() {
    const router = useRouter();

    useEffect(() => {
        const start = async () => {
            const res = await fetch('/api/checkout/razorpay/create-order', { method: 'POST' });
            if (!res.ok) {
                alert('Failed to initialize payment');
                return;
            }

            const data = await res.json();

            // load Razorpay script
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => {
                const handler = async (response: RazorpayResponse) => {
                    const r = await fetch('/api/checkout/razorpay/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(response)
                    });

                    if (r.ok) {
                        router.push('/checkout/success');
                    } else {
                        alert('Payment verification failed');
                    }
                };

                const options = {
                    key: data.key as string,
                    amount: data.amount as number,
                    currency: data.currency as string || 'INR',
                    name: 'Nebula Shop',
                    order_id: data.orderId as string,
                    handler,
                } as unknown;

                const RzConstructor = window.Razorpay;
                if (typeof RzConstructor === 'function') {
                    const rz = new RzConstructor(options);
                    rz.open();
                } else {
                    alert('Razorpay SDK failed to load');
                }
            }
        }

        start();
    }, [router]);

    return (
        <div className="max-w-3xl mx-auto py-12">
            <h1 className="text-2xl font-semibold mb-6">Processing Payment</h1>
            <p>Please complete the payment in the popup. If nothing appears, check your popup blocker.</p>
        </div>
    )
}
