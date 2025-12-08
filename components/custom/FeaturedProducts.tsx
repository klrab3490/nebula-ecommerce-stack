"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { ProductCard } from "@/components/custom/ProductCard";

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
`;

interface Product {
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

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface FeaturedProductsProps {
  daysFromNow?: number;
  onAddToCart?: (productId: string) => void;
  onReadMore?: (productId: string) => void;
}

export default function FeaturedProducts({
  daysFromNow = 7,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAddToCart,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onReadMore,
}: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Fetch featured products from API
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          // Filter only featured products
          const featuredProducts = data.products.filter((product: Product) => product.featured);
          setProducts(featuredProducts);
        }
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysFromNow);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [daysFromNow]);

  const timeUnits = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Mins" },
    { value: timeLeft.seconds, label: "Secs" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <style jsx>{shimmerKeyframes}</style>
      {/* Enhanced Sale Timer Section with Glass Morphism */}
      <div className="relative mb-16 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-red-500/20 via-orange-500/20 to-pink-500/20 dark:from-red-500/10 dark:via-orange-500/10 dark:to-pink-500/10 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
        <div className="relative bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Clock
                  className="text-red-500 dark:text-red-400 w-8 h-8 animate-pulse"
                  aria-hidden="true"
                />
                <div className="absolute -inset-1 bg-red-500/20 rounded-full animate-ping"></div>
              </div>
              <h2 className="font-bold text-2xl tracking-wide bg-linear-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
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
                  <div className="absolute -inset-0.5 bg-linear-to-r from-red-500 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                  <div className="relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/30 dark:border-zinc-700/50 rounded-2xl px-6 py-4 text-center min-w-[85px] shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <div className="font-black text-3xl tabular-nums bg-linear-to-b from-red-600 to-red-800 dark:from-red-400 dark:to-red-600 bg-clip-text text-transparent drop-shadow-sm">
                      {String(unit.value).padStart(2, "0")}
                    </div>
                    <div className="text-red-500/80 dark:text-red-400/80 text-sm uppercase font-bold tracking-widest mt-1">
                      {unit.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="text-center mb-12">
        <div className="inline-block mb-4">
          <span className="text-sm font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-4 py-2 rounded-full">
            ⚡ FEATURED COLLECTION
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black mb-4 text-gradient-primary">
          Featured Products
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
          Discover our handpicked selection of premium products at unbeatable prices
        </p>
        <div className="w-24 h-1 bg-linear-to-r from-purple-500 via-pink-500 to-orange-500 mx-auto mt-6 rounded-full"></div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-card rounded-2xl p-5 shadow-premium animate-pulse"
            >
              <div className="aspect-square bg-linear-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-xl mb-4"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-5 rounded-lg mb-3 w-3/4"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded-lg mb-3 w-full"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-10 rounded-xl"></div>
            </div>
          ))}
        </div>
      )}

      {/* Products Grid - Using Shared ProductCard */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {/* No Products State */}
      {!loading && products.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-linear-to-br from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-5xl">📦</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            No Featured Products Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Check back soon for amazing deals and featured items!
          </p>
        </div>
      )}
    </div>
  );
}
