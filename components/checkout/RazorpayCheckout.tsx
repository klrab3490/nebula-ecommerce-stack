"use client";

import React, { useState } from "react";

function loadScript(src: string) {
    return new Promise<boolean>((resolve) => {
        if (document.querySelector(`script[src=\"${src}\"]`)) return resolve(true);
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

type CreateOrderResp = {
    key?: string;
    orderId?: string;
    amount?: number;
    currency?: string;
    error?: any;
};

export default function RazorpayCheckoutButton({ amountPaisa = 50000 }: { amountPaisa?: number }) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        const ok = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!ok) {
            alert("Failed to load Razorpay SDK");
            setLoading(false);
            return;
        }

        try {
            const resp = await fetch("/api/checkout/razorpay/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: amountPaisa }),
            });

            const data: CreateOrderResp = await resp.json();
            if (!resp.ok || !data.orderId) {
                console.error(data);
                alert("Failed to create order on server");
                setLoading(false);
                return;
            }

            const options: any = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.amount || amountPaisa,
                currency: data.currency || "INR",
                name: "Nebula Store",
                description: "Order Payment",
                order_id: data.orderId,
                handler: async function (response: any) {
                    try {
                        const v = await fetch("/api/checkout/razorpay/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(response),
                        });

                        const verified = await v.json();
                        if (v.ok && verified.success) {
                            alert("Payment successful and verified");
                            // TODO: redirect to order success page or update UI
                        } else {
                            console.error("verify failed", verified);
                            alert("Payment verification failed");
                        }
                    } catch (err) {
                        console.error(err);
                        alert("Error verifying payment");
                    }
                },
                prefill: {
                    name: "",
                    email: "",
                    contact: "",
                },
                notes: {},
                theme: { color: "#3399cc" },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on("payment.failed", function (resp: any) {
                console.error("payment.failed", resp);
                alert("Payment failed: " + (resp?.error?.description || "Unknown"));
            });
            rzp.open();
        } catch (err) {
            console.error(err);
            alert("Error initiating payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={handleClick} disabled={loading} className="btn-primary">
            {loading ? "Processing…" : "Pay"}
        </button>
    );
}
