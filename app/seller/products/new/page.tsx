"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductFormData {
  name: string;        // Product name
  description: string; // Product description  
  price: string;       // Price (converted to Float)
  sku: string;         // Unique SKU
  stock: string;       // Stock quantity (converted to Int)
  images: string[];    // Array of image URLs
  categories: string[]; // Array of category names
}

const PREDEFINED_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Beauty & Health",
  "Sports & Outdoors",
  "Books",
  "Toys & Games",
  "Food & Beverages",
  "Automotive",
  "Other"
];

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    sku: "",
    stock: "",
    images: [],
    categories: []
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
          sku: formData.sku.trim(),
          stock: parseInt(formData.stock),
          images: formData.images,
          categories: formData.categories,
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Add New Product</h1>
        <p className="text-muted-foreground">
          Create a new product listing for your store
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Essential product details that customers will see
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Product Name *
                </label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="sku" className="text-sm font-medium">
                  SKU *
                </label>
                <Input
                  id="sku"
                  placeholder="Enter unique SKU"
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  className={errors.sku ? "border-red-500" : ""}
                />
                {errors.sku && (
                  <p className="text-sm text-red-500">{errors.sku}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description *
              </label>
              <textarea
                id="description"
                placeholder="Enter product description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className={`flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 ${errors.description ? "border-red-500" : ""
                  }`}
                rows={5}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
            <CardDescription>
              Set your product pricing and manage inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Price ($) *
                </label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="stock" className="text-sm font-medium">
                  Stock Quantity *
                </label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  className={errors.stock ? "border-red-500" : ""}
                />
                {errors.stock && (
                  <p className="text-sm text-red-500">{errors.stock}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>
              Add images to showcase your product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter image URL"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
              />
              <Button type="button" onClick={addImage} variant="outline">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            {formData.images.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Added Images:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <span className="text-sm truncate">{image}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Select categories for your product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Quick Select:</h4>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addCategory(category)}
                    disabled={formData.categories.includes(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Enter custom category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addCategory(newCategory), setNewCategory(""))
                }
              />
              <Button
                type="button"
                onClick={() => {
                  addCategory(newCategory);
                  setNewCategory("");
                }}
                variant="outline"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            {formData.categories.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Selected Categories:</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.categories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      <span>{category}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCategory(index)}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.categories && (
              <p className="text-sm text-red-500">{errors.categories}</p>
            )}
          </CardContent>
        </Card>

        {/* Submit Section */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Product...
              </>
            ) : (
              "Create Product"
            )}
          </Button>
        </div>

        {errors.submit && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}
      </form>
    </div>
  );
}
