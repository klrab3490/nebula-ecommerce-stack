"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Clock, Star, ShoppingCart, Eye } from "lucide-react"

interface Product {
  id: number
  name: string
  originalPrice: number
  salePrice: number
  discount: number
  image: string
  rating: number
  buttonText?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface FeaturedProductsProps {
  products?: Product[]
  daysFromNow?: number
  onAddToCart?: (productId: number) => void
  onReadMore?: (productId: number) => void
}

const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Rose Mary Hair Oil (100 ML)",
    originalPrice: 550,
    salePrice: 420,
    discount: 26,
    image: "/rose-mary-hair-oil-bottle-green-label.png",
    rating: 4,
  },
  {
    id: 2,
    name: "Herbal Face Pack (100 gm)",
    originalPrice: 550,
    salePrice: 420,
    discount: 24,
    image: "/herbal-face-pack-jar-black-container.png",
    rating: 5,
    buttonText: "Read More",
  },
  {
    id: 3,
    name: "Nikantha Anti-dandruff Oil (100ml)",
    originalPrice: 600,
    salePrice: 499,
    discount: 17,
    image: "/anti-dandruff-oil-bottle-blue-label.png",
    rating: 4,
  },
  {
    id: 4,
    name: "Beetroot Lip Balm (12gm)",
    originalPrice: 450,
    salePrice: 399,
    discount: 11,
    image: "/beetroot-lip-balm-round-black-container.png",
    rating: 3,
  },
]

export default function FeaturedProducts({
  products = featuredProducts,
  daysFromNow = 7,
  onAddToCart,
  onReadMore,
}: FeaturedProductsProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + daysFromNow)

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance < 0) {
        clearInterval(timer)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(timer)
  }, [daysFromNow])

  const renderStarRating = (rating: number, maxRating = 5) => (
    <div className="flex items-center gap-1" role="img" aria-label={`${rating} out of ${maxRating} stars`}>
      {Array.from({ length: maxRating }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  )

  const timeUnits = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Mins" },
    { value: timeLeft.seconds, label: "Secs" },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Clock className="text-red-500 dark:text-red-400 w-6 h-6" aria-hidden="true" />
            <span className="text-red-600 dark:text-red-300 font-semibold text-lg">Hurry up ! Sale end in:</span>
            <div className="flex gap-3">
              {timeUnits.map((unit) => (
                <div
                  key={unit.label}
                  className="bg-white dark:bg-zinc-800 border-2 border-red-200 dark:border-red-700 rounded-xl px-4 py-3 text-center min-w-[70px] shadow-sm"
                >
                  <div className="text-red-600 dark:text-red-400 font-bold text-2xl tabular-nums">
                    {String(unit.value).padStart(2, "0")}
                  </div>
                  <div className="text-red-400 dark:text-red-300 text-xs uppercase font-medium">{unit.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const isReadMore = product.buttonText === "Read More"

          const handleButtonClick = () => {
            if (isReadMore && onReadMore) {
              onReadMore(product.id)
            } else if (onAddToCart) {
              onAddToCart(product.id)
            }
          }

          return (
            <div
              key={product.id}
              className="group bg-card rounded-xl shadow-sm hover:shadow-lg overflow-hidden relative border border-border transition-all duration-300 hover:-translate-y-1"
            >
              {/* Discount Badge */}
              <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg z-10">
                -{product.discount}%
              </div>

              <div className="p-6">
                {/* Product Image */}
                <div className="relative mb-4 bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg?height=200&width=200&query=product"}
                    alt={product.name}
                    className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
                    width={200}
                    height={200}
                  />
                </div>

                {/* Product Info */}
                <h3 className="font-semibold text-foreground mb-3 line-clamp-2 leading-tight">{product.name}</h3>

                {/* Rating */}
                <div className="mb-3">{renderStarRating(product.rating)}</div>

                {/* Pricing */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-muted-foreground line-through text-sm">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xl font-bold text-foreground">₹{product.salePrice.toLocaleString()}</span>
                </div>

                {/* Action Button */}
                <Button
                  onClick={handleButtonClick}
                  className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border transition-colors"
                  size="lg"
                >
                  {isReadMore ? (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Read More
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add To Cart
                    </>
                  )}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
