"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useClerk } from "@clerk/nextjs"
import { CartIcon } from "./cart/cart-icon"
import { usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/theme/mode-toggle"
import { Search, User, Menu, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

export default function Navbar() {
    const pathname = usePathname();
    const { openSignIn } = useClerk();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    if (pathname === "/seller") {
        return null
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/95">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="grid grid-cols-2 md:grid-cols-3 items-center w-full">
                        {/* Left section - Navigation */}
                        <div className="flex items-center justify-start">
                            <div className="hidden lg:flex items-center space-x-1">
                                <Link
                                    href="/"
                                    className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/all-products"
                                    className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                                >
                                    Products
                                </Link>
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
                                className="lg:hidden ml-2 h-10 w-10 hover:bg-accent/80"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>

                        {/* Center section - Logo */}
                        <div className="flex items-end md:items-center justify-end md:justify-center">
                            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                                <Image src="/Nebula.png" alt="Nebula Logo" width={32} height={32} className="bg-white rounded-full" priority unoptimized />
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

                            <div className="hidden md:flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                                    className={`h-10 w-10 hover:bg-accent/80 ${isSearchOpen ? "bg-accent" : ""}`}
                                >
                                    <Search className="h-5 w-5" />
                                </Button>

                                <Button variant="ghost" size="icon" className="relative h-10 w-10 hover:bg-accent/80">
                                    <CartIcon />
                                </Button>

                                <Button variant="ghost" size="icon" className="relative h-10 w-10 hover:bg-accent/80" onClick={() => openSignIn()}>
                                    <User className="h-5 w-5" />
                                </Button>

                                <div className="h-10 w-10 flex items-center justify-center">
                                    <ModeToggle />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="lg:hidden border-t backdrop-blur-md animate-in slide-in-from-top-2 duration-300">
                        <div className="px-4 py-6 space-y-6">
                            {/* Mobile Search Section */}
                            {isSearchOpen && (
                                <div className="relative animate-in slide-in-from-top-2 duration-200">
                                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search products..."
                                        className="pl-12 pr-4 h-12 text-base bg-accent/50 border-border/50 focus:bg-background focus:border-border rounded-xl"
                                        autoFocus
                                    />
                                </div>
                            )}

                            <div className="flex items-center justify-between gap-3 pb-4 border-b border-border/50 md:hidden">
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                                        className={`h-12 w-12 hover:bg-accent/80 rounded-xl ${isSearchOpen ? "bg-accent" : ""}`}
                                    >
                                        <Search className="h-5 w-5" />
                                    </Button>

                                    <Button variant="ghost" size="icon" className="relative h-12 w-12 hover:bg-accent/80 rounded-xl">
                                        <CartIcon />
                                    </Button>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-12 w-12 hover:bg-accent/80 rounded-xl">
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
                                </div>

                                <div className="flex items-center justify-center h-12 w-12">
                                    <ModeToggle />
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <div className="space-y-2">
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-3">
                                    Navigation
                                </h3>
                                <Link
                                    href="/"
                                    className="flex items-center px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-accent/60 rounded-xl transition-all duration-200 active:scale-95"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/all-products"
                                    className="flex items-center px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-accent/60 rounded-xl transition-all duration-200 active:scale-95"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Products
                                </Link>
                                <Link
                                    href="/about"
                                    className="flex items-center px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-accent/60 rounded-xl transition-all duration-200 active:scale-95"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    About
                                </Link>
                                <Link
                                    href="/contact"
                                    className="flex items-center px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-accent/60 rounded-xl transition-all duration-200 active:scale-95"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Contact
                                </Link>
                            </div>

                            {/* Quick Actions */}
                            <div className="space-y-2 pt-4 border-t border-border/50">
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-3">
                                    Quick Actions
                                </h3>
                                <Link
                                    href="/seller"
                                    className="flex items-center px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-accent/60 rounded-xl transition-all duration-200 active:scale-95"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Seller Dashboard
                                </Link>
                                <button
                                    className="flex items-center w-full px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-accent/60 rounded-xl transition-all duration-200 active:scale-95 text-left"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    My Orders
                                </button>
                                <button
                                    className="flex items-center w-full px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-accent/60 rounded-xl transition-all duration-200 active:scale-95 text-left"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Wishlist
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
