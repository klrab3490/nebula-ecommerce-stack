"use client";

import { useState, useEffect } from "react";
import HeroSlider from "@/components/custom/HeroSlider";
import { ProductCard } from "@/components/custom/ProductCard";
import FeaturedProducts from "@/components/custom/FeaturedProducts";
import ProductCategories from "@/components/custom/ProductCategories";
import CustomerTestimonials from "@/components/custom/CustomerTestimonials";

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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          // Get latest 8 products (non-featured for general display)
          const generalProducts = data.products
            .filter((product: Product) => !product.featured && product.stock > 0)
            .slice(0, 8);
          setProducts(generalProducts);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  return (
    <div className="font-sans flex flex-col min-h-screen">
      {/* Hero Slider */}
      <section className="relative overflow-hidden">
        <HeroSlider />
      </section>

      {/* Trust Indicators Section */}
      <section className="py-12 bg-linear-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-900 border-y border-orange-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 p-4 bg-white/80 dark:bg-zinc-800/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="shrink-0 w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Free Shipping</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">On orders over ₹500</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/80 dark:bg-zinc-800/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="shrink-0 w-12 h-12 rounded-full bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">100% Authentic</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Quality guaranteed</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/80 dark:bg-zinc-800/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="shrink-0 w-12 h-12 rounded-full bg-linear-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <span className="text-2xl">↻</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Easy Returns</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">30-day return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/80 dark:bg-zinc-800/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="shrink-0 w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Secure Payment</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">100% protected</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section>
        <ProductCategories />
      </section>

      {/* Enhanced Our Products Section */}
      <section className="py-20 relative bg-linear-to-b from-white via-orange-50/30 to-white dark:from-background dark:via-zinc-900/50 dark:to-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full">
                ✨ HANDPICKED COLLECTION
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-gradient-primary">
              Our Premium Products
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
              Discover our carefully curated selection of premium quality products designed to
              enhance your lifestyle
            </p>
            <div className="w-24 h-1 bg-linear-to-r from-purple-500 via-pink-500 to-orange-500 mx-auto mt-6 rounded-full"></div>
          </div>
          {/* Loading State with Premium Design */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
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

          {/* Products Grid */}
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
                No Products Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Check back soon for our latest collection!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products with Sale Timer */}
      <section>
        <FeaturedProducts />
      </section>

      {/* Customer Testimonials */}
      <section>
        <CustomerTestimonials />
      </section>
    </div>
  );
}
