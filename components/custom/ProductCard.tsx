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
        <Card className="w-full max-w-sm mx-auto group hover:shadow-lg transition-shadow py-0">
            <CardHeader className="p-0">
                <Link href={`/products/${product.id}`} tabIndex={-1} aria-label={`View details for ${product.name}`}>
                    <div className="relative aspect-square overflow-hidden rounded-t-lg cursor-pointer bg-gray-100">
                        <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.alt || product.name}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            priority
                        />
                        {product.image ? null : (
                            <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">No Image</span>
                        )}
                    </div>
                </Link>
            </CardHeader>

            <CardContent className="p-4">
                <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                        {product.name}
                    </h3>
                </Link>

                {/* Price */}
                <p className="text-2xl font-bold text-primary mb-4">{(currency || "$")}{product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button className="flex-1" onClick={handleAddToCart}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setIsWishlisted(!isWishlisted)}>
                        <Heart className={cn("h-4 w-4", isWishlisted && "fill-red-500 text-red-500")} />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
