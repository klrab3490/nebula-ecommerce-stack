"use client"

import { useState, useEffect } from "react"
import HeroSlider from "@/components/custom/HeroSlider"
import { ProductCard } from "@/components/custom/ProductCard"
import FeaturedProducts from "@/components/custom/FeaturedProducts"
import ProductCategories from "@/components/custom/ProductCategories"
import CustomerTestimonials from "@/components/custom/CustomerTestimonials"

interface Product {
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

export default function Home() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products')
                if (response.ok) {
                    const data = await response.json()
                    // Get latest 8 products (non-featured for general display)
                    const generalProducts = data.products
                        .filter((product: Product) => !product.featured && product.stock > 0)
                        .slice(0, 8)
                    setProducts(generalProducts)
                }
            } catch (error) {
                console.error('Failed to fetch products:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])
    return (
        <div className="font-sans flex flex-col min-h-screen">
            {/* Hero Slider */}
            <section className="relative overflow-hidden">
                <HeroSlider />
            </section>

            {/* Product Categories */}
            <section>
                <ProductCategories />
            </section>

            {/* Enhanced Our Products Section */}
            <section className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-black mb-4 bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                            🛒 Our Premium Collection
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                            Handpicked products designed to enhance your lifestyle with quality and innovation
                        </p>
                        <div className="w-24 h-1 bg-linear-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
                    </div>
                    {/* Loading State */}
                    {loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {[...Array(8)].map((_, index) => (
                                <div key={index} className="bg-white/90 dark:bg-zinc-900/90 rounded-2xl p-6 shadow-xl animate-pulse">
                                    <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                                    <div className="bg-gray-200 dark:bg-gray-700 h-6 rounded mb-2"></div>
                                    <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-4 w-3/4"></div>
                                    <div className="bg-gray-200 dark:bg-gray-700 h-12 rounded"></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Products Grid */}
                    {!loading && products.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {products.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* No Products State */}
                    {!loading && products.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-slate-500 text-4xl">📦</span>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No Products Available</h3>
                            <p className="text-slate-600 dark:text-slate-400">Check back later for our latest products!</p>
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
