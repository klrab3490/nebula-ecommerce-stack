"use client";

import { Bundle } from "@/lib/bundles";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/bundles";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Gift, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
}

interface BundleFormData {
  name: string;
  description: string;
  discountType: "percentage" | "fixed" | "buy_x_get_y";
  discountValue: number;
  minQuantity: number;
  maxQuantity?: number;
  validUntil?: string;
  products: {
    productId: string;
    quantity: number;
    isRequired: boolean;
  }[];
}

const initialFormData: BundleFormData = {
  name: "",
  description: "",
  discountType: "percentage",
  discountValue: 0,
  minQuantity: 1,
  products: [],
};

export function BundleManagement() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);
  const [formData, setFormData] = useState<BundleFormData>(initialFormData);

  useEffect(() => {
    fetchBundles();
    fetchProducts();
  }, []);

  const fetchBundles = async () => {
    try {
      const response = await fetch("/api/bundles");
      if (response.ok) {
        const data = await response.json();
        setBundles(data.bundles || []);
      }
    } catch (error) {
      console.error("Error fetching bundles:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingBundle ? `/api/bundles/${editingBundle.id}` : "/api/bundles";
      const method = editingBundle ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchBundles();
        setIsDialogOpen(false);
        setEditingBundle(null);
        setFormData(initialFormData);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save bundle");
      }
    } catch (error) {
      console.error("Error saving bundle:", error);
      alert("Failed to save bundle");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bundle: Bundle) => {
    setEditingBundle(bundle);
    setFormData({
      name: bundle.name,
      description: bundle.description,
      discountType: bundle.discountType as "percentage" | "fixed" | "buy_x_get_y",
      discountValue: bundle.discountValue,
      minQuantity: bundle.minQuantity,
      maxQuantity: bundle.maxQuantity || undefined,
      validUntil: bundle.validUntil
        ? new Date(bundle.validUntil).toISOString().split("T")[0]
        : undefined,
      products: bundle.BundleProduct.map((bp) => ({
        productId: bp.productId,
        quantity: bp.quantity,
        isRequired: bp.isRequired,
      })),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (bundleId: string) => {
    if (!confirm("Are you sure you want to delete this bundle?")) return;

    try {
      const response = await fetch(`/api/bundles/${bundleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchBundles();
      } else {
        alert("Failed to delete bundle");
      }
    } catch (error) {
      console.error("Error deleting bundle:", error);
      alert("Failed to delete bundle");
    }
  };

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { productId: "", quantity: 1, isRequired: true }],
    }));
  };

  const removeProduct = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const updateProduct = (index: number, field: string, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((product, i) =>
        i === index ? { ...product, [field]: value } : product
      ),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bundle Management</h2>
          <p className="text-muted-foreground">Create and manage product bundle offers</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingBundle(null);
                setFormData(initialFormData);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Bundle
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBundle ? "Edit Bundle" : "Create New Bundle"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Bundle Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="discountType">Discount Type</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value: string) =>
                      setFormData((prev) => ({
                        ...prev,
                        discountType: value as "percentage" | "fixed" | "buy_x_get_y",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Off</SelectItem>
                      <SelectItem value="fixed">Fixed Amount Off</SelectItem>
                      <SelectItem value="buy_x_get_y">Buy X Get Y</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="discountValue">
                    {formData.discountType === "percentage"
                      ? "Discount %"
                      : formData.discountType === "fixed"
                        ? "Discount Amount"
                        : "Free Items"}
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        discountValue: Number(e.target.value),
                      }))
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="minQuantity">Min Quantity</Label>
                  <Input
                    id="minQuantity"
                    type="number"
                    value={formData.minQuantity}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        minQuantity: Number(e.target.value),
                      }))
                    }
                    min="1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="maxQuantity">Max Quantity (Optional)</Label>
                  <Input
                    id="maxQuantity"
                    type="number"
                    value={formData.maxQuantity || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxQuantity: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                    min="1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="validUntil">Valid Until (Optional)</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={formData.validUntil || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      validUntil: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Bundle Products</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addProduct}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Product
                  </Button>
                </div>

                {formData.products.map((product, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded">
                    <Select
                      value={product.productId}
                      onValueChange={(value: string) => updateProduct(index, "productId", value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select Product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name} - {formatCurrency(p.discountedPrice || p.price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => updateProduct(index, "quantity", Number(e.target.value))}
                      min="1"
                      className="w-20"
                      placeholder="Qty"
                    />

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={product.isRequired}
                        onCheckedChange={(checked: boolean) =>
                          updateProduct(index, "isRequired", checked)
                        }
                      />
                      <Label className="text-xs">Required</Label>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeProduct(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Saving..." : "Save Bundle"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {bundles.map((bundle) => (
          <Card key={bundle.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Gift className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{bundle.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{bundle.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant={bundle.isActive ? "default" : "secondary"}>
                    {bundle.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(bundle)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(bundle.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Discount:</strong>{" "}
                  {bundle.discountType === "percentage"
                    ? `${bundle.discountValue}%`
                    : bundle.discountType === "fixed"
                      ? formatCurrency(bundle.discountValue)
                      : `Buy ${bundle.minQuantity} Get ${bundle.discountValue}`}
                </div>
                <div>
                  <strong>Min Quantity:</strong> {bundle.minQuantity}
                </div>
                <div>
                  <strong>Products:</strong> {bundle.BundleProduct.length}
                </div>
                <div>
                  <strong>Valid Until:</strong>{" "}
                  {bundle.validUntil ? formatDate(bundle.validUntil) : "No expiry"}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {bundles.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No bundles created yet.</p>
              <p className="text-sm text-muted-foreground">
                Create your first bundle to start offering deals!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
