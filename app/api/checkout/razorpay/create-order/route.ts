import Razorpay from 'razorpay'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST() {
    try {
        // retrieve the latest pending order for the user or create a new one
        // For now, assume a single pending order
        const order = await prisma.order.findFirst({ where: { status: 'pending' } });

        if (!order) {
            return NextResponse.json({ error: 'No pending order' }, { status: 400 })
        }

        const amountInPaise = Math.round(order.total * 100);

        // Create Razorpay order via server-side request
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            return NextResponse.json({ error: 'Razorpay keys not configured' }, { status: 500 })
        }

        const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

        const res = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amountInPaise,
                currency: 'INR',
                receipt: order.id,
                partial_payment: true,
                first_payment_min_amount: 230
            })
        });

        if (!res.ok) {
            const txt = await res.text();
            return NextResponse.json({ error: 'Failed to create razorpay order', details: txt }, { status: 500 })
        }

        const data = await res.json();

        // Save razorpay order id on our DB order record
        await prisma.order.update({ where: { id: order.id }, data: { status: 'payment_initiated' } });

        return NextResponse.json({ key: keyId, orderId: data.id, amount: data.amount, currency: data.currency })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
