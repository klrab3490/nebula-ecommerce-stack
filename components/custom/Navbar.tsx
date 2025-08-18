"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Navbar() {
    const cartItemCount = 3 // This would come from your cart state
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    if (pathname === "/seller") {
        // Do something if not on seller page
        return null;
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Section 1: Logo & Navigation */}
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2">
                            <Image src="/Logo.png" alt="Nebula Logo" width={32} height={32} className="bg-white rounded-full" />
                            <span className="text-xl font-bold">Nebula</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center">
                            <Button variant="link">
                                <Link href="/">Home</Link>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="link">
                                        Products
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>
                                        <Link href="/all-products">All Products</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href="/all-products/new-arrivals">New Arrivals</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href="/all-products/best-sellers">Best Sellers</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href="/all-products/trending">Trending</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href="/all-products/health-beauty">Health & Beauty</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button variant="link">
                                <Link href="/about-us">About Us</Link>
                            </Button>
                            <Button variant="link">
                                <Link href="/contact-us">Contact Us</Link>
                            </Button>
                            <Button variant="link">
                                <Link href="/seller">Seller Dashboard</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Section 2: User Actions */}
                    <div className="flex items-center gap-2">
                        {/* Mobile Search Button */}
                        <Button variant="ghost" size="icon" className="hidden md:flex">
                            <Search className="h-5 w-5" />
                        </Button>

                        {/* Shopping Cart */}
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingCart className="h-5 w-5" />
                            {cartItemCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                                >
                                    {cartItemCount}
                                </Badge>
                            )}
                        </Button>

                        {/* User Account */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <User className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Sign In</DropdownMenuItem>
                                <DropdownMenuItem>Create Account</DropdownMenuItem>
                                <DropdownMenuItem>My Orders</DropdownMenuItem>
                                <DropdownMenuItem>Wishlist</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Mode Toggle */}
                        <ModeToggle />

                        {/* Mobile Menu Toggle */}
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t py-4">
                        <div className="flex flex-col gap-4">
                            {/* Mobile Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input placeholder="Search products..." className="pl-10 pr-4" />
                            </div>

                            {/* Mobile Navigation Links */}
                            <div className="flex flex-col gap-2">
                                <Link href="/" passHref>
                                    <Button variant="ghost" className="justify-start w-full text-left px-4 py-2 rounded-lg hover:bg-accent transition">
                                        Home
                                    </Button>
                                </Link>
                                <Link href="/all-products" passHref>
                                    <Button variant="ghost" className="justify-between w-full text-left px-4 py-2 rounded-lg hover:bg-accent transition">
                                        Products
                                    </Button>
                                </Link>
                                <div className="pl-6 flex flex-col gap-1">
                                    <Link href="/all-products/new-arrivals" passHref>
                                        <Button variant="ghost" className="justify-start w-full text-left px-4 py-1 rounded-lg hover:bg-accent transition text-sm">
                                            New Arrivals
                                        </Button>
                                    </Link>
                                    <Link href="/all-products/best-sellers" passHref>
                                        <Button variant="ghost" className="justify-start w-full text-left px-4 py-1 rounded-lg hover:bg-accent transition text-sm">
                                            Best Sellers
                                        </Button>
                                    </Link>
                                    <Link href="/all-products/trending" passHref>
                                        <Button variant="ghost" className="justify-start w-full text-left px-4 py-1 rounded-lg hover:bg-accent transition text-sm">
                                            Trending
                                        </Button>
                                    </Link>
                                    <Link href="/all-products/health-beauty" passHref>
                                        <Button variant="ghost" className="justify-start w-full text-left px-4 py-1 rounded-lg hover:bg-accent transition text-sm">
                                            Health & Beauty
                                        </Button>
                                    </Link>
                                </div>
                                <Link href="/about-us" passHref>
                                    <Button variant="ghost" className="justify-start w-full text-left px-4 py-2 rounded-lg hover:bg-accent transition">
                                        About Us
                                    </Button>
                                </Link>
                                <Link href="/contact-us" passHref>
                                    <Button variant="ghost" className="justify-start w-full text-left px-4 py-2 rounded-lg hover:bg-accent transition">
                                        Contact Us
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}