"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useClerk, UserButton } from "@clerk/nextjs";
import { useAppContext } from "@/contexts/AppContext";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { getPalette } from "@/components/theme/colorPalette";
import { CartIcon } from "@/components/custom/cart/cart-icon";
import NavbarSearch from "@/components/custom/NavbarSearch";
import { Menu, House, Search, ShoppingBag, ShoppingCart, User, X } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { openSignIn } = useClerk();
  const { isSeller, user } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleCloseSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const NavbarData = user
    ? [
        {
          label: "Home",
          href: "/",
        },
        {
          label: "About",
          href: "/about",
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
          label: "Locate Store",
          href: "/locate-store",
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
          label: "About",
          href: "/about",
        },
        {
          label: "Products",
          href: "/products",
        },
        {
          label: "Locate Store",
          href: "/locate-store",
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
      <div className="mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="grid grid-cols-3 items-center w-full">
            {/* Left section - Navigation */}
            <div className="flex items-center justify-start">
              <div className="hidden xl:flex items-center">
                {NavbarData.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full group ${
                      pathname === item.href
                        ? "text-foreground bg-white/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="xl:hidden ml-2 h-10 w-10 hover:bg-accent/50 rounded-full transition-colors"
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
                  <NavbarSearch onClose={handleCloseSearch} />
                </div>
              )}

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className={`hidden md:inline-flex h-10 w-10 hover:bg-accent/80 rounded-full transition-all duration-300 ${isSearchOpen ? "bg-accent" : ""}`}
                >
                  {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/cart")}
                  className="hidden md:inline-flex relative h-10 w-10 hover:bg-accent/50 rounded-full transition-all duration-300"
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
          <div className="xl:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl animate-in slide-in-from-top-5 fade-in duration-300 absolute w-full left-0 z-40 shadow-xl">
            <div className="px-4 py-6 space-y-6">
              {/* Mobile Search Section */}
              <NavbarSearch isMobile onClose={handleCloseMenu} />

              <div className="flex items-center justify-between gap-3 pb-4 border-b border-border/50 md:hidden">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      router.push("/cart");
                      setIsMenuOpen(false);
                    }}
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
                {NavbarData.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 active:scale-95 ${
                      pathname === item.href
                        ? "text-foreground bg-accent/70"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Quick Actions for logged-in users */}
              {user && (
                <div className="space-y-2 pt-4 border-t border-border/50">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-3">
                    Quick Actions
                  </h3>
                  <Link
                    href="/account"
                    className="flex items-center px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl transition-all duration-200 active:scale-95"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <Link
                    href="/cart"
                    className="flex items-center px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl transition-all duration-200 active:scale-95"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cart
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
