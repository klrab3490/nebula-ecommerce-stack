"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import SocialLinks from "@/components/custom/SocialLinks";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on seller dashboard
  if (pathname.startsWith("/seller")) return null;

  return (
    <footer className="relative overflow-hidden mt-20">
      {/* Modern Warmer Background */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-600/95 via-pink-600/95 to-orange-500/95 dark:from-purple-900/98 dark:via-pink-900/98 dark:to-orange-900/98"></div>
      <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div
        className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-400/15 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Enhanced Company Info */}
            <div className="space-y-6">
              <div>
                <h3 className="font-black text-2xl bg-linear-to-r from-white to-orange-100 bg-clip-text text-transparent mb-2">
                  ✨ Nebula
                </h3>
                <div className="w-20 h-1 bg-linear-to-r from-orange-400 via-pink-400 to-purple-400 rounded-full"></div>
              </div>
              <p className="text-white/90 text-sm leading-relaxed font-medium">
                Premium beauty & wellness platform delivering natural, high-quality products for
                your lifestyle.
              </p>
              <div>
                <h4 className="font-bold text-white text-sm mb-3">Follow Us</h4>
                <SocialLinks variant="footer" />
              </div>
            </div>

            {/* Enhanced Product Links */}
            <div className="space-y-6">
              <h4 className="font-bold text-white text-lg flex items-center gap-2">
                <span className="text-xl">🛍️</span> Products
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/all-products"
                    className="text-white/85 hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/best-sellers"
                    className="text-white/85 hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                    Best Sellers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/new-arrivals"
                    className="text-white/85 hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link
                    href="/trending"
                    className="text-white/85 hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                    Trending
                  </Link>
                </li>
                <li>
                  <Link
                    href="/health-beauty"
                    className="text-white/85 hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                    Health & Beauty
                  </Link>
                </li>
              </ul>
            </div>

            {/* Enhanced Company Links */}
            <div className="space-y-6">
              <h4 className="font-bold text-white text-lg flex items-center gap-2">
                <span className="text-xl">🏢</span> Company
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-white/85 hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/locate-store"
                    className="text-white/85 hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                    Locate Store
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-white/85 hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Enhanced Newsletter */}
            <div className="space-y-6">
              <h4 className="font-bold text-white text-lg flex items-center gap-2">
                <span className="text-xl">📧</span> Stay Updated
              </h4>
              <p className="text-sm text-white/85 leading-relaxed font-medium">
                Subscribe for exclusive offers & latest updates.
              </p>
              <form className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 text-sm bg-white/15 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white/25 transition-all duration-300 font-medium"
                />
                <Button
                  size="sm"
                  type="submit"
                  className="w-full bg-linear-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white border-0 rounded-xl px-6 py-3 font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Subscribe Now
                </Button>
              </form>
            </div>
          </div>

          {/* Enhanced Bottom Section */}
          <div className="mt-16 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-white/85 w-full text-center md:text-left font-medium">
              © 2025{" "}
              <span className="font-bold bg-linear-to-r from-white to-orange-100 bg-clip-text text-transparent">
                Nebula E-Commerce
              </span>
              . All rights reserved.
            </p>
            <div className="flex gap-6 md:gap-8 text-sm w-full justify-center md:justify-end">
              <Link
                href="/legal#privacy"
                className="text-white/85 hover:text-white transition-all duration-300 underline-offset-4 hover:underline font-medium"
              >
                Privacy Policy
              </Link>
              <Link
                href="/legal#terms"
                className="text-white/85 hover:text-white transition-all duration-300 underline-offset-4 hover:underline font-medium"
              >
                Terms of Service
              </Link>
              <Link
                href="/legal#cookies"
                className="text-purple-200/80 hover:text-white transition-all duration-300 underline-offset-4 hover:underline"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
