"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from '@/lib/currency';
import { Heart, ShoppingCart, Sparkles, TrendingUp } from "lucide-react"
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProductCard {
    id: string
    name: string
    description: string
    price: number
    discountedPrice?: number
    sku: string
    stock: number
    images: string[]
    categories: string[]
    featured: boolean
    createdAt: Date
    updatedAt: Date
}

interface ProductCardProps {
    product: ProductCard
}

export function ProductCard({ product }: ProductCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)
    const { addItem, currency } = useAppContext();

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.discountedPrice || product.price,
            image: product.images[0] || "/placeholder.svg",
        })
    }

    const currentPrice = product.discountedPrice || product.price
    const hasDiscount = product.discountedPrice && product.discountedPrice < product.price
    const discountPercentage = hasDiscount
        ? Math.round(((product.price - product.discountedPrice!) / product.price) * 100)
        : 0

    return (
        <div className="group relative">
            {/* Animated Glow Effect */}
            <div className="absolute -inset-1 bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-all duration-700 animate-pulse"></div>

            {/* Main Card */}
            <Card className="relative bg-white dark:bg-zinc-900 backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/30 transition-all duration-500 hover:-translate-y-3 border-2 border-white/20 dark:border-zinc-700/50 overflow-hidden group-hover:border-purple-500/30">

                {/* Animated Shimmer Effect */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"></div>

                <CardHeader className="p-0 relative">
                    <Link href={`/products/${product.id}`} tabIndex={-1} aria-label={`View details for ${product.name}`}>
                        <div className="relative aspect-square overflow-hidden bg-linear-to-br from-gray-100 via-gray-50 to-white dark:from-zinc-800 dark:via-zinc-850 dark:to-zinc-900">

                            {/* Decorative Background Pattern */}
                            <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-50"></div>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>

                            <Image
                                src={product.images[0] || "/placeholder.svg"}
                                alt={product.name}
                                width={400}
                                height={400}
                                className={cn(
                                    "w-full h-full object-cover transition-all duration-700 ease-out p-6 relative z-10",
                                    "group-hover:scale-110 group-hover:rotate-2",
                                    imageLoaded ? "opacity-100" : "opacity-0"
                                )}
                                onLoad={() => setImageLoaded(true)}
                                priority
                            />

                            {!product.images[0] && (
                                <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm z-10">No Image</span>
                            )}

                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                                {hasDiscount && (
                                    <Badge className="bg-linear-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg font-bold px-3 py-1">
                                        -{discountPercentage}% OFF
                                    </Badge>
                                )}
                                {product.featured && (
                                    <Badge className="bg-linear-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-lg font-bold px-3 py-1 flex items-center gap-1">
                                        <Sparkles className="h-3 w-3" />
                                        Featured
                                    </Badge>
                                )}
                                {product.stock < 10 && product.stock > 0 && (
                                    <Badge className="bg-linear-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg font-bold px-3 py-1 flex items-center gap-1 animate-pulse">
                                        <TrendingUp className="h-3 w-3" />
                                        Hot
                                    </Badge>
                                )}
                            </div>

                            {/* Enhanced Wishlist Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "absolute top-4 right-4 backdrop-blur-md hover:scale-110 rounded-full transition-all duration-300 z-20 shadow-xl border-2",
                                    isWishlisted
                                        ? "bg-red-500/90 hover:bg-red-600 border-red-400 opacity-100"
                                        : "bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black border-white/50 dark:border-zinc-700 opacity-0 group-hover:opacity-100"
                                )}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsWishlisted(!isWishlisted);
                                }}
                            >
                                <Heart className={cn(
                                    "h-5 w-5 transition-all duration-300",
                                    isWishlisted
                                        ? "fill-white text-white scale-110"
                                        : "text-gray-600 dark:text-gray-300"
                                )} />
                            </Button>
                        </div>
                    </Link>
                </CardHeader>

                <CardContent className="p-6 relative z-10 space-y-4">
                    {/* Category Pills */}
                    {product.categories && product.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {product.categories.slice(0, 2).map((category, index) => (
                                <span
                                    key={index}
                                    className="text-xs px-3 py-1 rounded-full bg-linear-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 font-medium"
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Product Name */}
                    <Link href={`/products/${product.id}`}>
                        <h3 className="font-bold text-xl mb-2 line-clamp-2 text-gray-900 dark:text-white hover:bg-linear-to-r hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 hover:bg-clip-text hover:text-transparent transition-all duration-300 cursor-pointer leading-tight">
                            {product.name}
                        </h3>
                    </Link>

                    {/* Enhanced Price Section */}
                    <div className="space-y-2">
                        <div className="flex items-baseline gap-3">
                            <p className="text-3xl font-black bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                                {formatCurrency(currentPrice, currency)}
                            </p>
                            {hasDiscount && (
                                <p className="text-lg text-gray-400 dark:text-gray-500 line-through font-medium">
                                    {formatCurrency(product.price, currency)}
                                </p>
                            )}
                        </div>

                        {/* Stock Status */}
                        {product.stock < 10 && product.stock > 0 && (
                            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                                <p className="text-sm font-semibold">Only {product.stock} left in stock!</p>
                            </div>
                        )}
                        {product.stock === 0 && (
                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <p className="text-sm font-semibold">Out of stock</p>
                            </div>
                        )}
                        {product.stock >= 10 && (
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <p className="text-sm font-semibold">In stock</p>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Action Button */}
                    <Button
                        className={cn(
                            "w-full relative overflow-hidden text-white border-0 rounded-xl py-6 font-bold shadow-xl transform transition-all duration-300 group/btn",
                            product.stock === 0
                                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                                : "bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-[1.03] active:scale-[0.98]"
                        )}
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                    >
                        {/* Button Shine Effect */}
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>

                        <div className="relative flex items-center justify-center gap-3">
                            <ShoppingCart className={cn(
                                "h-5 w-5 transition-transform duration-300",
                                product.stock > 0 && "group-hover/btn:rotate-12 group-hover/btn:scale-110"
                            )} />
                            <span className="text-base">
                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </span>
                        </div>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}