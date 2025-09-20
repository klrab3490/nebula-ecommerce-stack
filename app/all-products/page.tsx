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
      <section className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 border-b">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">All Products</h1>
              <p className="text-muted-foreground mt-2">Browse our full catalog and find what suits you best.</p>
            </div>

            <div className="w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="pl-10 pr-4 h-10 w-full md:w-80 bg-background/50"
                  aria-label="Search products"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Showing {filtered.length} items</span>
          </div>

          <div className="mt-6">
            <Tabs defaultValue="All" value={activeCategory} onValueChange={(v) => setActiveCategory(v as "All" | Product["category"])}>
              <TabsList className="flex flex-wrap gap-2">
                {(["All", "Hair", "Skin", "Accessories"] as const).map(cat => (
                  <TabsTrigger key={cat} value={cat} className="px-3 py-1.5">
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value={activeCategory}>
                <div className="flex items-center justify-end mt-4">
                  <label className="text-sm text-muted-foreground mr-2">Sort by</label>
                  <select
                    className="h-9 rounded-md border bg-transparent px-3 text-sm"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                  {filtered.map((p) => (
                    <ProductCard key={p.id} product={{ id: p.id, name: p.name, price: p.price, image: p.image, alt: p.alt }} />
                  ))}
                </div>

                {filtered.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    No products match your search.
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
