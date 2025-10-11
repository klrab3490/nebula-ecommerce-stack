import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createShipment } from '@/lib/shiprocket'

type CartItem = { id: string; quantity: number }
type Cart = { items: CartItem[]; total: number; itemCount?: number }

export async function POST(req: Request) {
  try {
    const parsed = (await req.json()) as { cart?: Cart; userId?: string };
    const cart = parsed.cart;
    const userId = parsed.userId;

    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      return NextResponse.json({ error: 'Empty cart' }, { status: 400 })
    }

    // create order
    const order = await prisma.order.create({
      data: {
        userId: userId || 'guest',
        total: cart.total,
        status: 'pending',
        products: {
          create: cart.items.map((it: CartItem) => ({
            productId: it.id,
            quantity: it.quantity
          }))
        }
      },
      include: { products: true }
    })

    // call Shiprocket (placeholder)
    try {
      const shipment = await createShipment();
      // store shipment metadata on order (if schema extended)
      // currently we just return it to client
      return NextResponse.json({ orderId: order.id, shipment })
    } catch {
      return NextResponse.json({ orderId: order.id, warning: 'shipment_failed' })
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
