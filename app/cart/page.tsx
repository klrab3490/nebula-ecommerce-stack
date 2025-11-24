"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { CartItem } from "@/components/custom/cart/cart-items";
import { CartSummary } from "@/components/custom/cart/cart-summery";

export default function CartPage() {
    const { cart } = useAppContext();
    const { items, itemCount } = cart;

    if (itemCount === 0) {
        return (
            <div className="min-h-screen relative overflow-hidden">
                {/* Modern Background */}
                <div className="absolute inset-0 bg-linear-to-br from-purple-50/80 via-pink-50/60 to-blue-50/80 dark:from-purple-950/20 dark:via-pink-950/10 dark:to-blue-950/20"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse"></div>
                <div
                    className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-300/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDelay: "2s" }}
                ></div>

                <div className="container mx-auto px-4 py-12 relative z-10">
                    <div className="flex items-center gap-6 mb-12">
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-full hover:bg-white/30 transition-all duration-300"
                        >
                            <Link href="/">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <h1 className="text-4xl md:text-5xl font-black bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                            🛒 Shopping Cart
                        </h1>
                    </div>

                    <div className="flex flex-col items-center justify-center py-20 text-center max-w-2xl mx-auto">
                        <div className="relative mb-8">
                            <div className="absolute -inset-4 bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
                            <div className="relative bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-full p-8">
                                <ShoppingBag className="h-20 w-20 text-muted-foreground" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black mb-4 bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Your cart is empty
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            Discover our amazing collection of premium beauty and wellness products
                        </p>
                        <Button
                            asChild
                            className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 rounded-xl px-8 py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <Link href="/">✨ Start Shopping</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Modern Background */}
            <div className="absolute inset-0 bg-linear-to-br from-purple-50/80 via-pink-50/60 to-blue-50/80 dark:from-purple-950/20 dark:via-pink-950/10 dark:to-blue-950/20"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse"></div>
            <div
                className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-300/10 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "2s" }}
            ></div>

            <div className="container mx-auto px-4 py-12 relative z-10">
                <div className="flex items-center gap-6 mb-12">
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-full hover:bg-white/30 transition-all duration-300"
                    >
                        <Link href="/">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl md:text-5xl font-black bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                            🛒 Shopping Cart
                        </h1>
                        <div className="bg-linear-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                            {itemCount} items
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <CartItem item={item} />
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <CartSummary />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
