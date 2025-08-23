"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { CartIcon } from "./cart/cart-icon";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Search, User, Menu, X, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export default function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    if (pathname === "/seller") {
        return null
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/95">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="grid grid-cols-3 items-center w-full">
                        {/* Left section - Navigation */}
                        <div className="flex items-center justify-start">
                            <div className="hidden lg:flex items-center space-x-1">
                                <Link
                                    href="/"
                                    className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                                >
                                    Home
                                </Link>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="px-3 py-2 text-sm font-medium">
                                            Products
                                            <ChevronDown className="ml-1 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-48">
                                        <DropdownMenuItem asChild>
                                            <Link href="/all-products" className="w-full">
                                                All Products
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/all-products/new-arrivals" className="w-full">
                                                New Arrivals
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/all-products/best-sellers" className="w-full">
                                                Best Sellers
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/all-products/trending" className="w-full">
                                                Trending
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/all-products/health-beauty" className="w-full">
                                                Health & Beauty
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Link
                                    href="/about"
                                    className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                                >
                                    About
                                </Link>
                                <Link
                                    href="/contact"
                                    className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                                >
                                    Contact
                                </Link>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden ml-2"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>
                        </div>

                        {/* Center section - Logo */}
                        <div className="flex items-center justify-center">
                            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                                <Image src="/Nebula.png" alt="Nebula Logo" width={32} height={32} className="bg-white rounded-full" />
                            </Link>
                        </div>

                        {/* Right section - Search and Actions */}
                        <div className="flex items-center justify-end gap-3">
                            {isSearchOpen && (
                                <div className="hidden md:flex relative animate-in slide-in-from-right-2 duration-200">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search products..."
                                        className="pl-10 pr-4 w-64 h-9 bg-background/50 border-border/50 focus:bg-background focus:border-border"
                                        autoFocus
                                    />
                                </div>
                            )}

                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                                    className={isSearchOpen ? "bg-accent" : ""}
                                >
                                    <Search className="h-5 w-5" />
                                </Button>

                                <Button variant="ghost" size="icon" className="relative">
                                    <CartIcon />
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <User className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem>Sign In</DropdownMenuItem>
                                        <DropdownMenuItem>Create Account</DropdownMenuItem>
                                        <DropdownMenuItem>My Orders</DropdownMenuItem>
                                        <DropdownMenuItem>Wishlist</DropdownMenuItem>
                                        <DropdownMenuItem>Account Settings</DropdownMenuItem>
                                        <DropdownMenuItem>Seller Dashboard</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Logout</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <ModeToggle />
                            </div>
                        </div>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="lg:hidden border-t backdrop-blur-md">
                        <div className="px-2 py-4 space-y-3">
                            {isSearchOpen && (
                                <div className="relative animate-in slide-in-from-top-2 duration-200">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input placeholder="Search products..." className="pl-10 pr-4" autoFocus />
                                </div>
                            )}

                            <div className="space-y-1">
                                <Link
                                    href="/"
                                    className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Home
                                </Link>

                                <div className="space-y-1">
                                    <div className="px-3 py-2 text-base font-medium text-foreground">Products</div>
                                    <div className="pl-6 space-y-1">
                                        <Link
                                            href="/all-products"
                                            className="block px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            All Products
                                        </Link>
                                        <Link
                                            href="/all-products/new-arrivals"
                                            className="block px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            New Arrivals
                                        </Link>
                                        <Link
                                            href="/all-products/best-sellers"
                                            className="block px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Best Sellers
                                        </Link>
                                        <Link
                                            href="/all-products/trending"
                                            className="block px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Trending
                                        </Link>
                                        <Link
                                            href="/all-products/health-beauty"
                                            className="block px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Health & Beauty
                                        </Link>
                                    </div>
                                </div>

                                <Link
                                    href="/about"
                                    className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    About Us
                                </Link>
                                <Link
                                    href="/contact"
                                    className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Contact Us
                                </Link>
                                <Link
                                    href="/seller"
                                    className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Seller Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
