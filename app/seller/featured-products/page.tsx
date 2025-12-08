"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCurrencySymbol } from "@/lib/currency";
import { Search, Star, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export default function FeaturedProductsPage() {
  const currencySymbol = getCurrencySymbol();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/products");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch products");
        }

        // Sort with featured products first
        const sortedProducts = (data.products || []).sort(
          (a: Product, b: Product) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        );

        setProducts(sortedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categories.some((category) =>
        category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  const handleToggleFeatured = async (product: Product) => {
    const newFeaturedStatus = !product.featured;

    setUpdatingIds((prev) => new Set([...prev, product.id]));

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: newFeaturedStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update product");
      }

      // Update local state
      setProducts((prevProducts) =>
        prevProducts
          .map((p) => (p.id === product.id ? { ...p, featured: newFeaturedStatus } : p))
          .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
      );

      setSuccessMessage(
        `Product "${product.name}" ${newFeaturedStatus ? "added to" : "removed from"} featured.`
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update";
      setError(errorMsg);
      console.error("Error updating product:", err);
    } finally {
      setUpdatingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }
  };

  const featuredCount = products.filter((p) => p.featured).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Featured Products</h1>
        <p className="text-muted-foreground mt-2">
          Manage which products are displayed as featured on the homepage
        </p>
      </div>

      {/* Stats Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Featured</p>
              <p className="text-2xl font-bold text-yellow-600">{featuredCount}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Not Featured</p>
              <p className="text-2xl font-bold">{products.length - featuredCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 flex items-center gap-2">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700 flex items-center gap-2">
          <CheckCircle2 size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Search size={20} className="text-muted-foreground" />
            <Input
              placeholder="Search by name, SKU, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Click the star icon to toggle featured status</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-muted-foreground" size={32} />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center">Stock</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      className={product.featured ? "bg-yellow-50/50" : ""}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.images[0] && (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{product.sku}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {product.categories.map((cat) => (
                            <Badge key={cat} variant="outline" className="text-xs">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <div className="flex flex-col items-end">
                          <span>
                            {currencySymbol}
                            {product.price.toFixed(2)}
                          </span>
                          {product.discountedPrice && (
                            <span className="text-xs text-green-600 line-through">
                              {currencySymbol}
                              {product.discountedPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {product.stock > 0 ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {product.stock} units
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700">
                            Out of stock
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {product.featured ? (
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                            <Star size={14} className="mr-1" fill="currentColor" />
                            Featured
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-600">
                            Regular
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          onClick={() => handleToggleFeatured(product)}
                          disabled={updatingIds.has(product.id)}
                          className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title={product.featured ? "Remove from featured" : "Add to featured"}
                        >
                          {updatingIds.has(product.id) ? (
                            <Loader2 size={18} className="animate-spin text-muted-foreground" />
                          ) : product.featured ? (
                            <Star size={18} className="text-yellow-500" fill="currentColor" />
                          ) : (
                            <Star size={18} className="text-gray-400" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            💡 <strong>Tip:</strong> Click on the star icon next to any product to toggle its
            featured status. Featured products will be displayed prominently on the homepage.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
