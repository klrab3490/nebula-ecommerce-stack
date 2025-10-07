"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Clock, Star, ShoppingCart, Eye } from "lucide-react"

// Custom animations styles
const shimmerKeyframes = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes glow {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }
  .animate-shimmer {
    animation: shimmer 3s infinite;
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  .animate-glow {
    animation: glow 2s ease-in-out infinite;
  }
`

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
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of ${maxRating} stars`}>
      {Array.from({ length: maxRating }, (_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 transition-all duration-300 ${
            i < rating 
              ? "text-amber-400 fill-amber-400 hover:text-amber-300 hover:fill-amber-300 drop-shadow-sm transform hover:scale-110" 
              : "text-gray-300 dark:text-gray-600 hover:text-gray-400"
          }`}
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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <style jsx>{shimmerKeyframes}</style>
      {/* Enhanced Sale Timer Section with Glass Morphism */}
      <div className="relative mb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-orange-500/20 to-pink-500/20 dark:from-red-500/10 dark:via-orange-500/10 dark:to-pink-500/10 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
        <div className="relative bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Clock className="text-red-500 dark:text-red-400 w-8 h-8 animate-pulse" aria-hidden="true" />
                <div className="absolute -inset-1 bg-red-500/20 rounded-full animate-ping"></div>
              </div>
              <h2 className="font-bold text-2xl tracking-wide bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
                ⚡ FLASH SALE ENDS IN ⚡
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {timeUnits.map((unit, index) => (
                <div
                  key={unit.label}
                  className="relative group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                  <div className="relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/30 dark:border-zinc-700/50 rounded-2xl px-6 py-4 text-center min-w-[85px] shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <div className="font-black text-3xl tabular-nums bg-gradient-to-b from-red-600 to-red-800 dark:from-red-400 dark:to-red-600 bg-clip-text text-transparent drop-shadow-sm">
                      {String(unit.value).padStart(2, "0")}
                    </div>
                    <div className="text-red-500/80 dark:text-red-400/80 text-sm uppercase font-bold tracking-widest mt-1">{unit.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
          🔥 Featured Products
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
          Discover our handpicked selection of premium products at unbeatable prices
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Enhanced Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product, index) => {
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
              className="group relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-500 animate-pulse"></div>
              
              {/* Main Card */}
              <div className="relative bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-white/20 dark:border-zinc-700/50 overflow-hidden">
                
                {/* Discount Badge with Animation */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-sm animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      <span className="drop-shadow-sm">-{product.discount}%</span>
                    </div>
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

                <div className="p-7">
                  {/* Product Image with Enhanced Effects */}
                  <div className="relative mb-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl overflow-hidden shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
                    <Image
                      src={product.image || "/placeholder.svg?height=200&width=200&query=product"}
                      alt={product.name}
                      className="w-full h-52 object-contain group-hover:scale-110 transition-all duration-700 ease-out p-4 relative z-10"
                      width={200}
                      height={200}
                    />
                  </div>

                  {/* Product Info with Better Typography */}
                  <h3 className="font-bold text-lg text-foreground mb-4 line-clamp-2 leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                    {product.name}
                  </h3>

                  {/* Enhanced Rating */}
                  <div className="mb-4 flex items-center gap-2">
                    {renderStarRating(product.rating)}
                    <span className="text-sm font-medium text-muted-foreground/80">({product.rating}.0)</span>
                  </div>

                  {/* Enhanced Pricing with Better Visual Hierarchy */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground line-through text-base font-medium">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                      <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-lg text-xs font-bold">
                        SAVE ₹{(product.originalPrice - product.salePrice).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <span className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                      ₹{product.salePrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Enhanced Action Button */}
                  <Button
                    onClick={handleButtonClick}
                    className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 rounded-xl py-6 font-bold text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 group/btn"
                    size="lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center gap-2">
                      {isReadMore ? (
                        <>
                          <Eye className="w-5 h-5" />
                          <span>Read More</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          <span>Add To Cart</span>
                        </>
                      )}
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
