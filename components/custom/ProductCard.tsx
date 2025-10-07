"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardHeader, CardContent } from "@/components/ui/card"

interface ProductCard {
    id: string
    name: string
    price: number
    image: string
    alt: string
}

interface ProductCardProps {
    product: ProductCard
}

export function ProductCard({ product }: ProductCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false)
    const { addItem, currency } = useAppContext();

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
        })
    }

    return (
        <div className="group relative overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
            
            {/* Main Card */}
            <Card className="relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20 dark:border-zinc-700/50 overflow-hidden group-hover:bg-white/95 dark:group-hover:bg-zinc-900/95">
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                
                <CardHeader className="p-0 relative">
                    <Link href={`/products/${product.id}`} tabIndex={-1} aria-label={`View details for ${product.name}`}>
                        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5"></div>
                            <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.alt || product.name}
                                width={400}
                                height={400}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out p-4 relative z-10"
                                priority
                            />
                            {product.image ? null : (
                                <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm z-10">No Image</span>
                            )}
                            
                            {/* Wishlist Button Overlay */}
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute top-4 right-4 bg-white/80 dark:bg-black/80 backdrop-blur-sm hover:bg-white dark:hover:bg-black rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 shadow-lg"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsWishlisted(!isWishlisted);
                                }}
                            >
                                <Heart className={cn("h-4 w-4 transition-colors", isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-300")} />
                            </Button>
                        </div>
                    </Link>
                </CardHeader>

                <CardContent className="p-6 relative z-10">
                    <Link href={`/products/${product.id}`}>
                        <h3 className="font-bold text-lg mb-3 line-clamp-2 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text hover:text-transparent transition-all duration-300 cursor-pointer">
                            {product.name}
                        </h3>
                    </Link>

                    {/* Enhanced Price */}
                    <div className="mb-4">
                        <p className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                            {(currency || "$")}{product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>

                    {/* Enhanced Action Button */}
                    <Button 
                        className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 rounded-xl py-6 font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 group/btn"
                        onClick={handleAddToCart}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            <span>Add to Cart</span>
                        </div>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
