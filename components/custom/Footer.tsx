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
        <footer className="border-t">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Nebula E-Commerce Stack</h3>
                            <p className="text-muted-foreground text-sm">
                                Full-stack commerce platform built for modern web experiences.
                            </p>
                        </div>

                        {/* Product Links */}
                        <div className="space-y-4">
                            <h4 className="font-medium">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="/all-products" className="text-muted-foreground hover:text-foreground transition-colors">
                                        All Products
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/best-sellers" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Best Sellers
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/new-arrivals" className="text-muted-foreground hover:text-foreground transition-colors">
                                        New Arrivals
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/trending" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Trending
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/health-beauty" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Health & Beauty
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Company Links */}
                        <div className="space-y-4">
                            <h4 className="font-medium">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="/about-us" className="text-muted-foreground hover:text-foreground transition-colors">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact-us" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="space-y-4">
                            <h4 className="font-medium">Stay Updated</h4>
                            <p className="text-sm text-muted-foreground">
                                Subscribe to our newsletter for the latest updates & releases.
                            </p>
                            <form className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                                <Button size="sm" type="submit">Subscribe</Button>
                            </form>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground w-full text-center sm:text-left">
                            © 2025 Nebula E-Commerce Stack. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm w-full justify-center sm:justify-end">
                            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
