"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/custom/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

export default function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const router = useRouter();
  const clientSearchParams = useSearchParams();

  // Initialize activeCategory from URL search params like ?category=Hair%20Oils
  const urlCategory = clientSearchParams?.get("category") || "All";
  const [activeCategory, setActiveCategory] = useState<string>(urlCategory);

  // Keep state synced with URL changes (like back/forward navigation)
  useEffect(() => {
    if (urlCategory && urlCategory !== activeCategory) {
      setActiveCategory(urlCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCategory]);

  // Update the URL when the user selects a category
  const updateCategoryInUrl = (value: string) => {
    try {
      const params = new URLSearchParams(clientSearchParams?.toString() || "");

      // Remove Next/React debug/internal query keys if accidentally present
      // (e.g. keys like 'status','value','reason','_children','_debugChunk','_debugInfo')
      const internalKeys = ["status", "value", "reason", "_children", "_debugChunk", "_debugInfo"];
      for (const k of internalKeys) params.delete(k);
      // also drop any keys starting with underscore
      for (const [k] of Array.from(params.entries())) {
        if (k.startsWith("_")) params.delete(k);
      }

      if (!value || value === "All") {
        params.delete("category");
      } else {
        params.set("category", value);
      }

      router.replace(`/products${params.toString() ? `?${params.toString()}` : ""}`);
    } catch {}
  };

  // When the user changes category via UI
  const handleCategoryChange = (value: string) => {
    setActiveCategory(value);
    updateCategoryInUrl(value);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const [sort, setSort] = useState("popular");

  // Get unique categories from products
  const categories = useMemo(() => {
    const allCategories = products.flatMap((product) => product.categories);
    return ["All", ...Array.from(new Set(allCategories))];
  }, [products]);

  const filtered = useMemo(() => {
    let items = products.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()));

    if (activeCategory !== "All") {
      items = items.filter((p) => p.categories.includes(activeCategory));
    }

    switch (sort) {
      case "price-asc":
        items = [...items].sort(
          (a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price)
        );
        break;
      case "price-desc":
        items = [...items].sort(
          (a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price)
        );
        break;
      case "name":
        items = [...items].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        items = [...items].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        break;
    }

    return items;
  }, [products, query, activeCategory, sort]);

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Modern Background */}
        <div className="absolute inset-0 bg-linear-to-br from-purple-50/80 via-pink-50/60 to-blue-50/80 dark:from-purple-950/20 dark:via-pink-950/10 dark:to-blue-950/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-300/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-black mb-4 bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                🛍️ All Products
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl font-medium">
                Explore our complete collection of premium beauty and wellness products
              </p>
              <div className="w-24 h-1 bg-linear-to-r from-purple-500 to-pink-500 mx-auto md:mx-0 mt-4 rounded-full"></div>
            </div>

            <div className="w-full md:w-auto">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="pl-12 pr-4 h-14 w-full md:w-96 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-zinc-700/50 rounded-2xl text-lg shadow-xl focus:shadow-2xl transition-all duration-300"
                    aria-label="Search products"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4 bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-2xl px-6 py-4">
            <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Showing {filtered.length} premium items
            </span>
          </div>

          <div className="mt-8">
            <Tabs defaultValue="All" value={activeCategory} onValueChange={handleCategoryChange}>
              <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-2xl p-2">
                <TabsList className="flex flex-wrap gap-2 bg-transparent">
                  {categories.map((cat) => (
                    <TabsTrigger
                      key={cat}
                      value={cat}
                      className="px-6 py-3 rounded-xl data-[state=active]:bg-linear-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white font-bold transition-all duration-300"
                    >
                      {cat === "All" ? "🔥 All" : cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value={activeCategory}>
                <div className="flex items-center justify-end mt-6">
                  <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-xl px-4 py-2 flex items-center gap-3">
                    <label className="text-sm font-medium text-muted-foreground">Sort by</label>
                    <select
                      className="bg-transparent border-0 text-sm font-medium focus:outline-none cursor-pointer"
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      aria-label="Sort products"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="newest">Newest First</option>
                      <option value="name">Name (A–Z)</option>
                      <option value="price-asc">Price (Low to High)</option>
                      <option value="price-desc">Price (High to Low)</option>
                    </select>
                  </div>
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
                    {[...Array(12)].map((_, index) => (
                      <div
                        key={index}
                        className="bg-white/90 dark:bg-zinc-900/90 rounded-2xl p-6 shadow-xl animate-pulse"
                      >
                        <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                        <div className="bg-gray-200 dark:bg-gray-700 h-6 rounded mb-2"></div>
                        <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-4 w-3/4"></div>
                        <div className="bg-gray-200 dark:bg-gray-700 h-12 rounded"></div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Products Grid */}
                {!loading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
                    {filtered.map((p, index) => (
                      <div
                        key={p.id}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <ProductCard product={p} />
                      </div>
                    ))}
                  </div>
                )}

                {!loading && filtered.length === 0 && (
                  <div className="text-center py-20">
                    <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-2xl p-12 inline-block">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-xl font-bold text-foreground mb-2">No products found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
}
