import React from 'react';
import { prisma } from '@/lib/prisma';
import SellerOrdersClient from '@/components/custom/seller/SellerOrdersClient';

export default async function SellerOrdersPage() {
    // Fetch orders with related OrderProduct entries
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { products: true },
    });

    // Batch fetch users and product details to avoid N+1 queries
    const userIds = Array.from(new Set(orders.map(o => o.userId).filter(Boolean)));
    const users = userIds.length ? await prisma.user.findMany({ where: { id: { in: userIds } } }) : [];
    const usersById = Object.fromEntries(users.map(u => [u.id, u]));

    type OrderProduct = { id: string; orderId: string; productId: string; quantity: number };
    const productIds = Array.from(new Set(orders.flatMap(o => (o.products || [])
        .map((p: OrderProduct) => p.productId)).filter(Boolean)));
    const products = productIds.length ? await prisma.product.findMany({ where: { id: { in: productIds } } }) : [];
    const productsById = Object.fromEntries(products.map(p => [p.id, p]));

    const mapped = orders.map((o) => {
        const items = (o.products || []).map((p: OrderProduct) => ({
            id: p.id,
            name: productsById[p.productId]?.name || 'Product',
            quantity: p.quantity,
            price: productsById[p.productId]?.price || 0,
        }));

        const user = usersById[o.userId];

        return {
            id: o.id,
            customer: {
                name: user?.name || 'Guest',
                email: user?.email || '',
            },
            items,
            total: o.total || 0,
            status: (['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(String(o.status)) ? String(o.status) : 'pending') as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
            paymentStatus: 'paid',
            orderDate: o.createdAt ? o.createdAt.toISOString() : new Date().toISOString(),
            trackingNumber: undefined,
        };
    });

    return <SellerOrdersClient orders={mapped} />;
}