"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useClerk, UserButton } from "@clerk/nextjs";
import { useAppContext } from "@/contexts/AppContext";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { getPalette } from "@/components/theme/colorPalette";
import { CartIcon } from "@/components/custom/cart/cart-icon";
import { Menu, House, Search, ShoppingBag, ShoppingCart, User, X } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { openSignIn } = useClerk();
  const { isSeller, user } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const NavbarData = user
    ? [
        {
          label: "Home",
          href: "/",
        },
        {
          label: "Products",
          href: "/products",
        },
        {
          label: "My Orders",
          href: "/my-orders",
        },
        {
          label: "Cart",
          href: "/cart",
        },
        ...(isSeller
          ? [
              {
                label: "Seller Dashboard",
                href: "/seller",
              },
            ]
          : []),
      ]
    : [
        {
          label: "Home",
          href: "/",
        },
        {
          label: "Products",
          href: "/products",
        },
        {
          label: "About",
          href: "/about",
        },
        {
          label: "Contact",
          href: "/contact",
        },
      ];

  // use the shared category palette for subtle gradients in the navbar
  const palette = getPalette(0); // using the first palette (violet-pink-blue)

  if (pathname.startsWith("/seller")) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-backdrop-filter:bg-background/40 transition-all duration-300">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="grid grid-cols-3 items-center w-full">
            {/* Left section - Navigation */}
            <div className="flex items-center justify-start">
              <div className="hidden lg:flex items-center space-x-1">
                {NavbarData.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-accent/50 rounded-full group"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden ml-2 h-10 w-10 hover:bg-accent/50 rounded-full transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>

            {/* Center section - Logo */}
            <div className="flex items-center justify-center">
              <Link href="/" className="flex items-center gap-2 shrink-0 group">
                <div
                  className={`rounded-full p-0.5 bg-linear-to-r ${palette.gradient} transition-transform duration-300 group-hover:scale-105 shadow-sm`}
                >
                  <Image
                    src="/Nebula.png"
                    alt="Nebula Logo"
                    width={32}
                    height={32}
                    className="rounded-full bg-background"
                    priority
                    unoptimized
                  />
                </div>
                <span className="hidden md:block font-bold text-lg tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                  Nebula
                </span>
              </Link>
            </div>

            {/* Right section - Search and Actions */}
            <div className="flex items-center justify-end gap-3">
              {isSearchOpen && (
                <div className="hidden md:flex relative animate-in slide-in-from-right-4 fade-in duration-300">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10 pr-4 w-64 h-9 bg-secondary/50 border-transparent focus:bg-background focus:border-primary/20 focus:ring-2 focus:ring-primary/10 rounded-full transition-all"
                    autoFocus
                  />
                </div>
              )}

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className={`hidden md:inline-flex h-10 w-10 hover:bg-accent/80 ${isSearchOpen ? "bg-accent" : ""} bg-linear-to-r ${palette.accent} bg-opacity-10 hover:bg-opacity-20`}
                >
                  <Search className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className={`hidden md:inline-flex relative h-10 w-10 hover:bg-accent/50 rounded-full transition-all duration-300`}
                >
                  <CartIcon />
                </Button>

                {user ? (
                  <div className="relative h-10 w-10 hover:bg-accent/50 flex items-center justify-center rounded-full transition-all duration-300">
                    <UserButton>
                      <UserButton.MenuItems>
                        <UserButton.Action
                          label="Home"
                          labelIcon={<House className="h-5 w-5" />}
                          onClick={() => {
                            router.push("/");
                          }}
                        />
                        <UserButton.Action
                          label="Profile"
                          labelIcon={<User className="h-5 w-5" />}
                          onClick={() => {
                            router.push("/account");
                          }}
                        />
                        <UserButton.Action
                          label="Cart"
                          labelIcon={<ShoppingCart className="h-5 w-5" />}
                          onClick={() => {
                            router.push("/cart");
                          }}
                        />
                        <UserButton.Action
                          label="Orders"
                          labelIcon={<ShoppingBag className="h-5 w-5" />}
                          onClick={() => {
                            router.push("/my-orders");
                          }}
                        />
                      </UserButton.MenuItems>
                    </UserButton>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-10 w-10 hover:bg-accent/50 flex items-center justify-center rounded-full transition-all duration-300"
                    onClick={() => openSignIn()}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                )}

                <div className="h-10 w-10 hidden md:flex items-center justify-center">
                  <ModeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl animate-in slide-in-from-top-5 fade-in duration-300 absolute w-full z-40 shadow-xl">
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
                    className={`h-12 w-12 hover:bg-accent/50 rounded-xl ${isSearchOpen ? "bg-accent" : ""}`}
                  >
                    <Search className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-12 w-12 hover:bg-accent/50 rounded-xl"
                  >
                    <CartIcon />
                  </Button>
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
                  className="flex items-center px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl transition-all duration-200 active:scale-95"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="flex items-center px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl transition-all duration-200 active:scale-95"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  href="/about"
                  className="flex items-center px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl transition-all duration-200 active:scale-95"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl transition-all duration-200 active:scale-95"
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
                {user && isSeller && (
                  <Link
                    href="/seller"
                    className="flex items-center px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl transition-all duration-200 active:scale-95"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Seller Dashboard
                  </Link>
                )}
                <button
                  className="flex items-center w-full px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl transition-all duration-200 active:scale-95 text-left"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </button>
                <button
                  className="flex items-center w-full px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl transition-all duration-200 active:scale-95 text-left"
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
  );
}
