"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

export function CartIcon() {
    const { cart } = useAppContext();
    const { itemCount } = cart;

    return (
        <Link href="/cart">
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {itemCount > 99 ? "99+" : itemCount}
                </span>
            )}
        </Link>
    )
}
