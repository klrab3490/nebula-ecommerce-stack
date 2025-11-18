import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { razorpay_payment_id?: string; razorpay_order_id?: string; razorpay_signature?: string };
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment fields' }, { status: 400 })
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    const generated = crypto.createHmac('sha256', secret).update(razorpay_order_id + '|' + razorpay_payment_id).digest('hex');

    if (generated !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // find order by receipt (we used order.id as receipt)
    const order = await prisma.order.findFirst({ where: { status: 'payment_initiated' } });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    await prisma.order.update({ where: { id: order.id }, data: { status: 'paid' } });

    // TODO: call Shiprocket to create shipment and store tracking details

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
