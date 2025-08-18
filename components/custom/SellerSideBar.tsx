import React from 'react';
import Link from 'next/link';

export default function SellerSideBar() {
    return (
        <aside className="border-r p-6 h-screen w-64 flex flex-col">
            <header className="mb-8">
                <h2 className="text-xl font-bold">Seller Dashboard</h2>
            </header>
            <nav className="flex-1 flex flex-col justify-between">
                <section>
                    <h3 className="text-lg font-semibold mb-2">Manage Your Store</h3>
                    <p className="text-sm text-gray-600 mb-6">
                        View and manage your products, orders, and account settings.
                    </p>
                    <Link href="/">Return to home</Link>
                </section>
                <section>
                    <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
                    <ul className="space-y-2">
                        <li className="hover:text-blue-600 cursor-pointer">All Products</li>
                        <li className="hover:text-blue-600 cursor-pointer">Seller Orders</li>
                        <li className="hover:text-blue-600 cursor-pointer">Add Address</li>
                    </ul>
                </section>
            </nav>
        </aside>
    )
}