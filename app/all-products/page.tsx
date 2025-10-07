"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/custom/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  alt: string;
  category: "Hair" | "Skin" | "Accessories";
};

const allProducts: Product[] = [
  { id: "1", name: "Rose Mary Hair Oil (100 ML)", price: 420, image: "/rose-mary-hair-oil-bottle-green-label.png", alt: "Rose Mary Hair Oil", category: "Hair" },
  { id: "2", name: "Herbal Face Pack (100 gm)", price: 420, image: "/herbal-face-pack-jar-black-container.png", alt: "Herbal Face Pack", category: "Skin" },
  { id: "3", name: "Nikantha Anti-dandruff Oil (100ml)", price: 499, image: "/anti-dandruff-oil-bottle-blue-label.png", alt: "Anti-dandruff Oil", category: "Hair" },
  { id: "4", name: "Beetroot Lip Balm (12gm)", price: 399, image: "/beetroot-lip-balm-round-black-container.png", alt: "Beetroot Lip Balm", category: "Skin" },
  { id: "5", name: "Premium Wireless Headphones", price: 199.99, image: "/premium-wireless-headphones-front.png", alt: "Premium Wireless Headphones", category: "Accessories" },
  { id: "6", name: "Smart Fitness Watch", price: 299.99, image: "/smart-fitness-watch.png", alt: "Smart Fitness Watch", category: "Accessories" },
  { id: "7", name: "Bluetooth Speaker", price: 89.99, image: "/bluetooth-speaker.png", alt: "Bluetooth Speaker", category: "Accessories" },
  { id: "8", name: "USB-C Hub", price: 59.99, image: "/usb-c-hub.png", alt: "USB-C Hub", category: "Accessories" },
];

export default function AllProductsPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | Product["category"]>("All");
  const [sort, setSort] = useState("popular");

  const filtered = useMemo(() => {
    let items = allProducts.filter(p =>
      p.name.toLowerCase().includes(query.trim().toLowerCase())
    );
    if (activeCategory !== "All") items = items.filter(p => p.category === activeCategory);

    switch (sort) {
      case "price-asc":
        items = [...items].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        items = [...items].sort((a, b) => b.price - a.price);
        break;
      case "name":
        items = [...items].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return items;
  }, [query, activeCategory, sort]);

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Modern Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-blue-50/80 dark:from-purple-950/20 dark:via-pink-950/10 dark:to-blue-950/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-300/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                🛍️ All Products
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl font-medium">
                Explore our complete collection of premium beauty and wellness products
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto md:mx-0 mt-4 rounded-full"></div>
            </div>

            <div className="w-full md:w-auto">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
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
            <span className="text-sm font-medium text-muted-foreground">Showing {filtered.length} premium items</span>
          </div>

          <div className="mt-8">
            <Tabs defaultValue="All" value={activeCategory} onValueChange={(v) => setActiveCategory(v as "All" | Product["category"])}>
              <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-2xl p-2">
                <TabsList className="flex flex-wrap gap-2 bg-transparent">
                  {(["All", "Hair", "Skin", "Accessories"] as const).map(cat => (
                    <TabsTrigger 
                      key={cat} 
                      value={cat} 
                      className="px-6 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white font-bold transition-all duration-300"
                    >
                      {cat === "All" ? "🔥 All" : cat === "Hair" ? "💇 Hair" : cat === "Skin" ? "✨ Skin" : "🎧 Accessories"}
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
                      <option value="name">Name (A–Z)</option>
                      <option value="price-asc">Price (Low to High)</option>
                      <option value="price-desc">Price (High to Low)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
                  {filtered.map((p, index) => (
                    <div 
                      key={p.id} 
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <ProductCard product={{ id: p.id, name: p.name, price: p.price, image: p.image, alt: p.alt }} />
                    </div>
                  ))}
                </div>

                {filtered.length === 0 && (
                  <div className="text-center py-20">
                    <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-2xl p-12 inline-block">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-xl font-bold text-foreground mb-2">No products found</h3>
                      <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
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
