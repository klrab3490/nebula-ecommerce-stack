"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Sparkles, TrendingUp, Plus, Minus } from "lucide-react";

interface ProductCard {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  sku: string;
  stock: number;
  images: string[];
  categories: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductCardProps {
  product: ProductCard;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addItem, currency, cart, updateQuantity, removeItem } = useAppContext();

  // Check if item exists in cart
  const cartItem = cart.items.find((item) => item.id === product.id);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.discountedPrice || product.price,
      image: product.images[0] || "/placeholder.svg",
    });
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, newQuantity);
    }
  };

  const currentPrice = product.discountedPrice || product.price;
  const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discountedPrice!) / product.price) * 100)
    : 0;

  return (
    <div className="group relative h-full">
      {/* Enhanced Animated Glow Effect */}
      <div className="absolute -inset-1 bg-linear-to-r from-purple-500 via-pink-500 to-orange-400 rounded-3xl blur-2xl opacity-0 group-hover:opacity-25 transition-all duration-700 animate-pulse"></div>

      {/* Main Card with Premium Design */}
      <Card className="relative bg-white dark:bg-card backdrop-blur-xl rounded-2xl shadow-premium hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-2 border border-border overflow-hidden group-hover:border-purple-400/40 dark:group-hover:border-purple-500/40 h-full flex flex-col">
        {/* Animated Shimmer Effect */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 dark:via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"></div>

        <CardHeader className="p-0 relative">
          <Link
            href={`/products/${product.id}`}
            tabIndex={-1}
            aria-label={`View details for ${product.name}`}
          >
            <div className="relative aspect-square overflow-hidden bg-linear-to-br from-orange-50/50 via-rose-50/50 to-pink-50/50 dark:from-zinc-800/80 dark:via-zinc-850/80 dark:to-zinc-900/80">
              {/* Decorative Background Pattern */}
              <div className="absolute inset-0 bg-linear-to-br from-purple-100/30 via-pink-100/30 to-orange-100/20 dark:from-purple-500/5 dark:via-pink-500/5 dark:to-orange-500/5"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(251,146,60,0.08),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(251,146,60,0.03),rgba(0,0,0,0))]"></div>

              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                width={400}
                height={400}
                className={cn(
                  "w-full h-full object-cover transition-all duration-700 ease-out p-8 relative z-10",
                  "group-hover:scale-105 group-hover:rotate-1",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
                priority
              />

              {!product.images[0] && (
                <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm z-10">
                  No Image
                </span>
              )}

              {/* Enhanced Badges with Better Design */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                {hasDiscount && (
                  <>
                    <Badge className="bg-linear-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg font-bold px-3 py-1.5 text-xs animate-pulse-slow">
                      🔥 {discountPercentage}% OFF
                    </Badge>
                    <Badge className="bg-linear-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg font-bold px-3 py-1.5 text-xs">
                      Save {formatCurrency(product.price - product.discountedPrice!, currency)}
                    </Badge>
                  </>
                )}
                {product.featured && (
                  <Badge className="bg-linear-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg font-bold px-3 py-1.5 flex items-center gap-1 text-xs">
                    <Sparkles className="h-3 w-3" />
                    Featured
                  </Badge>
                )}
                {product.stock < 10 && product.stock > 0 && (
                  <Badge className="bg-linear-to-r from-orange-500 to-pink-500 text-white border-0 shadow-lg font-bold px-3 py-1.5 flex items-center gap-1 animate-pulse text-xs">
                    <TrendingUp className="h-3 w-3" />
                    Hot Deal
                  </Badge>
                )}
              </div>

              {/* Enhanced Wishlist Button */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute top-4 right-4 backdrop-blur-md hover:scale-110 rounded-full transition-all duration-300 z-20 shadow-lg border",
                  isWishlisted
                    ? "bg-red-500 hover:bg-red-600 border-red-400 opacity-100 scale-100"
                    : "bg-white/95 dark:bg-zinc-900/95 hover:bg-white dark:hover:bg-zinc-900 border-gray-200 dark:border-zinc-700 opacity-0 group-hover:opacity-100 scale-95"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  setIsWishlisted(!isWishlisted);
                }}
              >
                <Heart
                  className={cn(
                    "h-4 w-4 transition-all duration-300",
                    isWishlisted
                      ? "fill-white text-white scale-110"
                      : "text-gray-700 dark:text-gray-300"
                  )}
                />
              </Button>
            </div>
          </Link>
        </CardHeader>

        <CardContent className="p-5 relative z-10 flex-1 flex flex-col">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 min-h-7 mb-3">
            {product.categories && product.categories.length > 0 && (
              <>
                {product.categories.slice(0, 2).map((category, index) => (
                  <span
                    key={index}
                    className="text-xs px-3 py-1 rounded-full bg-linear-to-r from-purple-100 via-pink-100 to-orange-100 dark:from-purple-900/40 dark:via-pink-900/40 dark:to-orange-900/40 text-purple-800 dark:text-purple-200 font-semibold shadow-sm"
                  >
                    {category}
                  </span>
                ))}
              </>
            )}
          </div>

          {/* Product Name with Improved Typography */}
          <Link href={`/products/${product.id}`}>
            <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-900 dark:text-white hover:text-gradient-primary transition-all duration-300 cursor-pointer leading-snug min-h-14">
              {product.name}
            </h3>
          </Link>

          {/* Enhanced Price Section with Better Hierarchy */}
          <div className="space-y-2 mb-4">
            <div className="flex items-baseline gap-2 min-h-10">
              <p className="text-3xl font-black text-gradient-success">
                {formatCurrency(currentPrice, currency)}
              </p>
              {hasDiscount && (
                <p className="text-base text-gray-400 dark:text-gray-500 line-through font-semibold">
                  {formatCurrency(product.price, currency)}
                </p>
              )}
            </div>

            {/* Stock Status - Fixed height with better visual design */}
            <div className="min-h-6">
              {product.stock < 10 && product.stock > 0 && (
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                  <p className="text-xs font-bold">Only {product.stock} left!</p>
                </div>
              )}
              {product.stock === 0 && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <p className="text-xs font-bold">Out of stock</p>
                </div>
              )}
              {product.stock >= 10 && (
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <p className="text-xs font-bold">In stock</p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Action Buttons - Push to bottom */}
          <div className="mt-auto">
            {cartItem ? (
              <div className="flex items-center gap-2 w-full">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 bg-transparent border-2 border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all duration-300 rounded-xl"
                  onClick={() => handleQuantityChange(cartItem.quantity - 1)}
                >
                  <Minus className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </Button>

                <div className="flex-1 text-center py-3 px-2 bg-linear-to-r from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-orange-950/30 rounded-xl border border-purple-200 dark:border-purple-800/50">
                  <span className="text-lg font-bold text-purple-700 dark:text-purple-300">
                    {cartItem.quantity}
                  </span>
                </div>

                <Button
                  size="icon"
                  className="h-11 w-11 bg-linear-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group/add"
                  onClick={() => handleQuantityChange(cartItem.quantity + 1)}
                >
                  <Plus className="h-4 w-4 transition-transform group-hover/add:scale-110" />
                </Button>
              </div>
            ) : (
              <Button
                className={cn(
                  "w-full relative overflow-hidden text-white border-0 rounded-xl py-6 font-bold shadow-lg transform transition-all duration-300 group/btn text-sm",
                  product.stock === 0
                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-linear-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98]"
                )}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {/* Button Shine Effect */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>

                <div className="relative flex items-center justify-center gap-2">
                  <ShoppingCart
                    className={cn(
                      "h-5 w-5 transition-transform duration-300",
                      product.stock > 0 && "group-hover/btn:rotate-12 group-hover/btn:scale-110"
                    )}
                  />
                  <span className="text-base font-extrabold tracking-wide">
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </span>
                </div>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
