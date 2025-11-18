"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button"
import Link from "next/link";

export default function Footer() {
    const pathname = usePathname();

    // Hide footer on seller dashboard
    if (pathname.startsWith("/seller")) return null;

    return (
        <footer className="relative overflow-hidden mt-20">
            {/* Modern Background */}
            <div className="absolute inset-0 bg-linear-to-br from-purple-900/95 via-pink-900/95 to-blue-900/95 dark:from-purple-950/98 dark:via-pink-950/98 dark:to-blue-950/98"></div>
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>

            <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-16">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Enhanced Company Info */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-black text-2xl bg-linear-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
                                    ✨ Nebula E-Commerce
                                </h3>
                                <div className="w-16 h-1 bg-linear-to-r from-purple-400 to-pink-400 rounded-full"></div>
                            </div>
                            <p className="text-purple-100/80 text-sm leading-relaxed">
                                Premium beauty & wellness platform delivering natural, high-quality products for your lifestyle.
                            </p>
                        </div>

                        {/* Enhanced Product Links */}
                        <div className="space-y-6">
                            <h4 className="font-bold text-white text-lg">🛍️ Products</h4>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link href="/all-products" className="text-purple-200/80 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                                        All Products
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/best-sellers" className="text-purple-200/80 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                                        Best Sellers
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/new-arrivals" className="text-purple-200/80 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                                        New Arrivals
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/trending" className="text-purple-200/80 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                                        Trending
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/health-beauty" className="text-purple-200/80 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                                        Health & Beauty
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Enhanced Company Links */}
                        <div className="space-y-6">
                            <h4 className="font-bold text-white text-lg">🏢 Company</h4>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link href="/about" className="text-purple-200/80 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="text-purple-200/80 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Enhanced Newsletter */}
                        <div className="space-y-6">
                            <h4 className="font-bold text-white text-lg">📧 Stay Updated</h4>
                            <p className="text-sm text-purple-200/80 leading-relaxed">
                                Subscribe to our newsletter for the latest updates & exclusive offers.
                            </p>
                            <form className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-3 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/20 transition-all duration-300"
                                />
                                <Button size="sm" type="submit" className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl px-6 py-3 font-bold shadow-lg hover:shadow-xl transition-all duration-300">
                                    Subscribe
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Enhanced Bottom Section */}
                    <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-sm text-purple-200/80 w-full text-center md:text-left">
                            © 2025 <span className="font-bold bg-linear-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">Nebula E-Commerce Stack</span>. All rights reserved.
                        </p>
                        <div className="flex gap-6 md:gap-8 text-sm w-full justify-center md:justify-end">
                            <Link href="/legal#privacy" className="text-purple-200/80 hover:text-white transition-all duration-300 underline-offset-4 hover:underline">
                                Privacy Policy
                            </Link>
                            <Link href="/legal#terms" className="text-purple-200/80 hover:text-white transition-all duration-300 underline-offset-4 hover:underline">
                                Terms of Service
                            </Link>
                            <Link href="/legal#cookies" className="text-purple-200/80 hover:text-white transition-all duration-300 underline-offset-4 hover:underline">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
