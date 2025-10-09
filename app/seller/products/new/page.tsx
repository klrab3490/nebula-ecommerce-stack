"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrencySymbol } from "@/lib/currency";

interface ProductFormData {
  name: string;        // Product name
  description: string; // Product description  
  price: string;       // Price (converted to Float)
  discountedPrice: string; // Discounted price for featured products
  sku: string;         // Unique SKU
  stock: string;       // Stock quantity (converted to Int)
  images: string[];    // Array of image URLs
  categories: string[]; // Array of category names
  featured: boolean;   // Whether product is featured
}

const PREDEFINED_CATEGORIES = [
  "Hair Oils",
  "Shampoo",
  "Indigo Powder",
  "Eyebrow Oil",
  "Henna"
];

export default function AddProductPage() {
  const router = useRouter();
  const currencySymbol = getCurrencySymbol();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    discountedPrice: "",
    sku: "",
    stock: "",
    images: [],
    categories: [],
    featured: false
  });

  const [newImageUrl, setNewImageUrl] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    }

    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    // Validate discounted price for featured products
    if (formData.featured) {
      if (!formData.discountedPrice || isNaN(Number(formData.discountedPrice)) || Number(formData.discountedPrice) <= 0) {
        newErrors.discountedPrice = "Valid discounted price is required for featured products";
      } else if (Number(formData.discountedPrice) >= Number(formData.price)) {
        newErrors.discountedPrice = "Discounted price must be less than the original price";
      }
    }

    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required";
    }

    if (!formData.stock || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = "Valid stock quantity is required";
    }

    if (formData.categories.length === 0) {
      newErrors.categories = "At least one category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const addImage = () => {
    if (newImageUrl.trim() && !formData.images.includes(newImageUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }));
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addCategory = (category: string) => {
    if (category && !formData.categories.includes(category)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, category]
      }));
    }
  };

  const removeCategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: parseFloat(formData.price),
          discountedPrice: formData.featured && formData.discountedPrice ? parseFloat(formData.discountedPrice) : null,
          sku: formData.sku.trim(),
          stock: parseInt(formData.stock),
          images: formData.images,
          categories: formData.categories,
          featured: formData.featured,
        }),
      });

      if (response.ok) {
        router.push("/seller/products");
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.error || "Failed to create product" });
      }
    } catch (error) {
      console.error("Error creating product:", error);
      setErrors({ submit: "Failed to create product. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Add New Product
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create a compelling product listing that showcases your items and attracts customers to your store
          </p>
        </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Basic Information</CardTitle>
                <CardDescription className="text-sm">
                  Essential product details that customers will see
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  placeholder="e.g., Premium Wireless Headphones"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`h-12 text-base transition-all duration-200 ${errors.name 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                    : "border-slate-200 focus:border-primary focus:ring-primary/20 hover:border-slate-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <label htmlFor="sku" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  SKU <span className="text-red-500">*</span>
                </label>
                <Input
                  id="sku"
                  placeholder="e.g., PWH-001"
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  className={`h-12 text-base transition-all duration-200 ${errors.sku 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                    : "border-slate-200 focus:border-primary focus:ring-primary/20 hover:border-slate-300"
                  }`}
                />
                {errors.sku && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.sku}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="description" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                placeholder="Describe your product features, benefits, and what makes it special..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className={`flex min-h-[140px] w-full rounded-lg border bg-white dark:bg-slate-800 px-4 py-3 text-base shadow-sm placeholder:text-slate-400 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${errors.description 
                  ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200" 
                  : "border-slate-200 focus-visible:border-primary focus-visible:ring-primary/20 hover:border-slate-300"
                }`}
                rows={6}
              />
              <div className="flex justify-between items-center">
                {errors.description ? (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.description}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">Write a compelling description to attract customers</p>
                )}
                <span className="text-xs text-slate-400">{formData.description.length}/500</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Inventory */}
        <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 font-bold text-lg">$</span>
              </div>
              <div>
                <CardTitle className="text-xl">Pricing & Inventory</CardTitle>
                <CardDescription className="text-sm">
                  Set your product pricing and manage inventory
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`grid grid-cols-1 gap-8 ${formData.featured ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
              <div className="space-y-3">
                <label htmlFor="price" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  Original Price ({currencySymbol}) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">{currencySymbol}</span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className={`h-12 pl-8 text-base transition-all duration-200 ${errors.price 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                      : "border-slate-200 focus:border-primary focus:ring-primary/20 hover:border-slate-300"
                    }`}
                  />
                </div>
                {errors.price && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.price}
                  </p>
                )}
              </div>

              {formData.featured && (
                <div className="space-y-3">
                  <label htmlFor="discountedPrice" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    Discounted Price ({currencySymbol}) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">{currencySymbol}</span>
                    <Input
                      id="discountedPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.discountedPrice}
                      onChange={(e) => handleInputChange("discountedPrice", e.target.value)}
                      className={`h-12 pl-8 text-base transition-all duration-200 ${errors.discountedPrice 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                        : "border-slate-200 focus:border-primary focus:ring-primary/20 hover:border-slate-300"
                      }`}
                    />
                  </div>
                  {errors.discountedPrice && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.discountedPrice}
                    </p>
                  )}
                  {formData.price && formData.discountedPrice && Number(formData.discountedPrice) < Number(formData.price) && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <span>💰</span>
                      {Math.round(((Number(formData.price) - Number(formData.discountedPrice)) / Number(formData.price)) * 100)}% discount
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <label htmlFor="stock" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  placeholder="Available quantity"
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  className={`h-12 text-base transition-all duration-200 ${errors.stock 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                    : "border-slate-200 focus:border-primary focus:ring-primary/20 hover:border-slate-300"
                  }`}
                />
                {errors.stock && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.stock}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center">
                      <span className="text-amber-600 dark:text-amber-400 text-xl">⭐</span>
                    </div>
                    <label htmlFor="featured" className="text-base font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                      Featured Product
                    </label>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 ml-11">
                    Featured products are highlighted on the homepage and require a discounted price
                  </p>
                </div>
                <div className="flex-shrink-0 ml-6">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      formData.featured 
                        ? 'bg-primary' 
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                        formData.featured 
                          ? 'translate-x-7' 
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Images */}
        <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 text-xl">📸</span>
              </div>
              <div>
                <CardTitle className="text-xl">Product Images</CardTitle>
                <CardDescription className="text-sm">
                  Add high-quality images to showcase your product
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-3">
              <Input
                placeholder="Paste image URL here..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                className="h-12 text-base transition-all duration-200 border-slate-200 focus:border-primary focus:ring-primary/20 hover:border-slate-300"
              />
              <Button 
                type="button" 
                onClick={addImage} 
                variant="outline"
                className="h-12 px-6 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                Add Image
              </Button>
            </div>

            {formData.images.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Product Images ({formData.images.length})
                  </h4>
                  <span className="text-xs text-slate-500">Click to remove</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-slate-500 text-xl">🖼️</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                            Image {index + 1}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{image}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-slate-500 text-2xl">📷</span>
                </div>
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">No images added yet</h3>
                <p className="text-xs text-slate-500 mb-4">Add image URLs to showcase your product</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Categories */}
        <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 dark:text-indigo-400 text-xl">🏷️</span>
              </div>
              <div>
                <CardTitle className="text-xl">Categories</CardTitle>
                <CardDescription className="text-sm">
                  Select categories to help customers find your product
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Popular Categories</h4>
                <span className="text-xs text-slate-500">Click to add</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PREDEFINED_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => addCategory(category)}
                    disabled={formData.categories.includes(category)}
                    className={`p-3 text-left rounded-lg border-2 transition-all duration-200 ${
                      formData.categories.includes(category)
                        ? 'border-primary bg-primary/10 text-primary cursor-not-allowed'
                        : 'border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{category}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {formData.categories.includes(category) ? 'Added' : 'Click to add'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Custom Category</h4>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter custom category name..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addCategory(newCategory), setNewCategory(""))
                  }
                  className="h-12 text-base transition-all duration-200 border-slate-200 focus:border-primary focus:ring-primary/20 hover:border-slate-300"
                />
                <Button
                  type="button"
                  onClick={() => {
                    addCategory(newCategory);
                    setNewCategory("");
                  }}
                  variant="outline"
                  className="h-12 px-6 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>

            {formData.categories.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Selected Categories ({formData.categories.length})
                  </h4>
                  <span className="text-xs text-slate-500">Click × to remove</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {formData.categories.map((category, index) => (
                    <div
                      key={index}
                      className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary rounded-full text-sm font-medium border border-primary/20 hover:border-primary/40 transition-all duration-200"
                    >
                      <span>{category}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCategory(index)}
                        className="h-5 w-5 p-0 hover:bg-primary/20 rounded-full opacity-70 group-hover:opacity-100 transition-all duration-200"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-slate-500 text-xl">🏷️</span>
                </div>
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">No categories selected</h3>
                <p className="text-xs text-slate-500">Select at least one category for your product</p>
              </div>
            )}

            {errors.categories && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <X className="h-3 w-3" />
                {errors.categories}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Submit Section */}
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-700">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="w-full sm:w-auto h-12 px-8 text-base border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 transition-all duration-200"
          >
            Cancel
          </Button>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:w-auto h-12 px-8 text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Creating Product...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Create Product
              </>
            )}
          </Button>
        </div>

        {errors.submit && (
          <div className="p-6 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-xl shadow-sm">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{errors.submit}</p>
          </div>
        )}
      </form>
      </div>
    </div>
  );
}
