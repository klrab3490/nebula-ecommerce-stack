"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Edit, ArrowLeft, Loader2, Plus, X } from "lucide-react";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  discountedPrice: string;
  sku: string;
  stock: string;
  images: string[];
  categories: string[];
  faqs?: { question: string; answer: string }[];
  specifications?: {
    quantity?: string;
    ingredients?: string;
    howToUse?: string;
    benefits?: string;
  };
  featured: boolean;
}

const PREDEFINED_CATEGORIES = ["Makeup", "Face Care", "Hair Care"];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams() as { id?: string };
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    discountedPrice: "",
    sku: "",
    stock: "",
    images: [],
    categories: [],
    faqs: [],
    specifications: {
      quantity: "",
      ingredients: "",
      howToUse: "",
      benefits: "",
    },
    featured: false,
  });

  const [newImageUrl, setNewImageUrl] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newFAQQuestion, setNewFAQQuestion] = useState("");
  const [newFAQAnswer, setNewFAQAnswer] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load product");
        const p = data.product;
        setFormData({
          name: p.name || "",
          description: p.description || "",
          price: p.price?.toString() || "",
          discountedPrice: p.discountedPrice ? String(p.discountedPrice) : "",
          sku: p.sku || "",
          stock: String(p.stock ?? ""),
          images: p.images || [],
          categories: p.categories || [],
          faqs: Array.isArray(p.faq) ? p.faq : [],
          specifications: p.specifications || {
            quantity: "",
            ingredients: "",
            howToUse: "",
            benefits: "",
          },
          featured: Boolean(p.featured),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim()) newErrors.description = "Product description is required";
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (!formData.stock || isNaN(Number(formData.stock)) || Number(formData.stock) < 0)
      newErrors.stock = "Valid stock quantity is required";
    if (formData.featured) {
      if (
        !formData.discountedPrice ||
        isNaN(Number(formData.discountedPrice)) ||
        Number(formData.discountedPrice) <= 0
      ) {
        newErrors.discountedPrice = "Valid discounted price is required for featured products";
      } else if (Number(formData.discountedPrice) >= Number(formData.price)) {
        newErrors.discountedPrice = "Discounted price must be less than the original price";
      }
    }
    if (formData.categories.length === 0)
      newErrors.categories = "At least one category is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProductFormData, value: string | string[] | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }) as ProductFormData);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const addImage = () => {
    if (newImageUrl.trim() && !formData.images.includes(newImageUrl.trim())) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, newImageUrl.trim()] }));
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const addCategory = (category: string) => {
    if (category && !formData.categories.includes(category)) {
      setFormData((prev) => ({ ...prev, categories: [...prev.categories, category] }));
      setNewCategory("");
    }
  };

  const addFAQ = (question: string, answer: string) => {
    if (!question?.trim() || !answer?.trim()) return;
    setFormData((prev) => ({
      ...prev,
      faqs: [...(prev.faqs || []), { question: question.trim(), answer: answer.trim() }],
    }));
    setNewFAQQuestion("");
    setNewFAQAnswer("");
  };

  const removeFAQ = (index: number) => {
    setFormData((prev) => ({ ...prev, faqs: (prev.faqs || []).filter((_, i) => i !== index) }));
  };

  const updateFAQ = (index: number, field: "question" | "answer", value: string) => {
    setFormData((prev) => ({
      ...prev,
      faqs: (prev.faqs || []).map((f, i) => (i === index ? { ...f, [field]: value } : f)),
    }));
  };

  const removeCategory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: parseFloat(formData.price),
          discountedPrice:
            formData.featured && formData.discountedPrice
              ? parseFloat(formData.discountedPrice)
              : null,
          sku: formData.sku.trim(),
          stock: parseInt(formData.stock || "0", 10),
          images: formData.images,
          categories: formData.categories,
          faqs: formData.faqs || [],
          specifications: formData.specifications,
          featured: formData.featured,
        }),
      });

      if (res.ok) {
        router.push("/seller/products");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update product");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-12 text-center">Loading product...</div>;
  if (error) return <div className="py-12 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <h1 className="text-3xl font-bold">Edit Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Basic Information</CardTitle>
                  <CardDescription className="text-sm">
                    Essential product details that customers will see
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold">Product Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <X className="h-3 w-3" /> {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold">SKU</label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    className={errors.sku ? "border-red-500" : ""}
                  />
                  {errors.sku && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <X className="h-3 w-3" /> {errors.sku}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-sm font-semibold">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className={`flex min-h-[140px] w-full rounded-lg border px-4 py-3 ${errors.description ? "border-red-500" : ""}`}
                    rows={6}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <X className="h-3 w-3" /> {errors.description}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">$</span>
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
              <div
                className={`grid grid-cols-1 gap-6 ${formData.featured ? "md:grid-cols-3" : "md:grid-cols-2"}`}
              >
                <div className="space-y-3">
                  <label className="text-sm font-semibold">Original Price</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className={errors.price ? "border-red-500" : ""}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <X className="h-3 w-3" /> {errors.price}
                    </p>
                  )}
                </div>

                {formData.featured && (
                  <div className="space-y-3">
                    <label className="text-sm font-semibold">Discounted Price</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.discountedPrice}
                      onChange={(e) => handleInputChange("discountedPrice", e.target.value)}
                      className={errors.discountedPrice ? "border-red-500" : ""}
                    />
                    {errors.discountedPrice && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <X className="h-3 w-3" /> {errors.discountedPrice}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <label className="text-sm font-semibold">Stock Quantity</label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    className={errors.stock ? "border-red-500" : ""}
                  />
                  {errors.stock && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <X className="h-3 w-3" /> {errors.stock}
                    </p>
                  )}
                </div>

                <div className="md:col-span-1">
                  <div className="mt-4 p-4 bg-amber-50 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Featured Product</p>
                        <p className="text-xs text-muted-foreground">
                          Featured products require a discounted price
                        </p>
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => handleInputChange("featured", !formData.featured)}
                          className={`relative inline-flex h-8 w-14 items-center rounded-full ${formData.featured ? "bg-primary" : "bg-slate-200"}`}
                        >
                          <span
                            className={`inline-block h-6 w-6 rounded-full bg-white transform ${formData.featured ? "translate-x-7" : "translate-x-1"}`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  📸
                </div>
                <div>
                  <CardTitle className="text-xl">Product Images</CardTitle>
                  <CardDescription className="text-sm">
                    Add high-quality images to showcase your product
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  placeholder="Paste image URL here..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                />
                <Button type="button" variant="outline" onClick={addImage}>
                  <Plus className="h-4 w-4" /> Add Image
                </Button>
              </div>

              {formData.images.length > 0 ? (
                <div className="mt-4 grid gap-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded">
                      <div className="truncate">{img}</div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(idx)}
                        className="text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-dashed border rounded">
                  No images added yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  🏷️
                </div>
                <div>
                  <CardTitle className="text-xl">Categories</CardTitle>
                  <CardDescription className="text-sm">
                    Select categories to help customers find your product
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PREDEFINED_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => addCategory(c)}
                    disabled={formData.categories.includes(c)}
                    className={`p-3 rounded border ${formData.categories.includes(c) ? "bg-primary/10 text-primary" : ""}`}
                  >
                    <div className="font-medium">{c}</div>
                    <div className="text-xs">
                      {formData.categories.includes(c) ? "Added" : "Click to add"}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 flex gap-3">
                <Input
                  placeholder="Custom category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addCategory(newCategory))
                  }
                />
                <Button type="button" variant="outline" onClick={() => addCategory(newCategory)}>
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>

              {formData.categories.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {formData.categories.map((c, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary"
                    >
                      <span>{c}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCategory(idx)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {errors.categories && (
                <p className="text-sm text-red-500 mt-2">{errors.categories}</p>
              )}
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  📋
                </div>
                <div>
                  <CardTitle className="text-xl">Product Specifications</CardTitle>
                  <CardDescription className="text-sm">
                    Add detailed specifications like quantity, ingredients, usage instructions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-semibold">Quantity / Size</label>
                <Input
                  placeholder="e.g., 100ml, 50g, 200ml"
                  value={formData.specifications?.quantity || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      specifications: { ...prev.specifications, quantity: e.target.value },
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Specify the product size or quantity
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold">Ingredients</label>
                <textarea
                  placeholder="List all ingredients, one per line or separated by commas"
                  value={formData.specifications?.ingredients || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      specifications: { ...prev.specifications, ingredients: e.target.value },
                    }))
                  }
                  className="flex min-h-[100px] w-full rounded-lg border px-4 py-3"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  List the product ingredients or composition
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold">How to Use</label>
                <textarea
                  placeholder="Provide step-by-step usage instructions"
                  value={formData.specifications?.howToUse || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      specifications: { ...prev.specifications, howToUse: e.target.value },
                    }))
                  }
                  className="flex min-h-[100px] w-full rounded-lg border px-4 py-3"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Explain how customers should use the product
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold">Benefits</label>
                <textarea
                  placeholder="List the key benefits and advantages of this product"
                  value={formData.specifications?.benefits || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      specifications: { ...prev.specifications, benefits: e.target.value },
                    }))
                  }
                  className="flex min-h-[100px] w-full rounded-lg border px-4 py-3"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Highlight what makes this product beneficial
                </p>
              </div>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                  ❓
                </div>
                <div>
                  <CardTitle className="text-xl">Product FAQs</CardTitle>
                  <CardDescription className="text-sm">
                    Manage frequently asked questions for this product
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Question"
                    value={newFAQQuestion}
                    onChange={(e) => setNewFAQQuestion(e.target.value)}
                  />
                  <Input
                    placeholder="Answer"
                    value={newFAQAnswer}
                    onChange={(e) => setNewFAQAnswer(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addFAQ(newFAQQuestion, newFAQAnswer))
                    }
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addFAQ(newFAQQuestion, newFAQAnswer)}
                  >
                    <Plus className="h-4 w-4" /> Add FAQ
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Add short Q&A pairs to address common customer concerns
                  </p>
                </div>
              </div>

              {formData.faqs && formData.faqs.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {formData.faqs.map((faq, idx) => (
                    <div key={idx} className="p-3 border rounded">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <Input
                            value={faq.question}
                            onChange={(e) => updateFAQ(idx, "question", e.target.value)}
                            className="mb-2"
                          />
                          <Input
                            value={faq.answer}
                            onChange={(e) => updateFAQ(idx, "answer", e.target.value)}
                          />
                        </div>
                        <div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFAQ(idx)}
                            className="text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border-dashed border rounded">
                  No FAQs added yet
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between items-center pt-6 border-t">
            <Button variant="outline" onClick={() => router.push(`/seller/products/${id}`)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" /> Save Changes
                </>
              )}
            </Button>
          </div>

          {error && <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>}
        </form>
      </div>
    </div>
  );
}
