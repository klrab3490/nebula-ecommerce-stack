"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import { formatDate } from "@/lib/utils";
import { Bundle, formatCurrency } from "@/lib/bundles";
import { Package, Tag, Clock, Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BundleCardProps {
  bundle: Bundle;
}

export function BundleCard({ bundle }: BundleCardProps) {
  const { currency = "INR", addItem } = useAppContext();

  const handleAddBundle = () => {
    // Add all required products to cart
    bundle.BundleProduct.filter((bp) => bp.isRequired).forEach((bundleProduct) => {
      addItem({
        id: bundleProduct.product.id,
        name: bundleProduct.product.name,
        price: bundleProduct.product.discountedPrice || bundleProduct.product.price,
        image: bundleProduct.product.images[0] || "",
        quantity: bundleProduct.quantity,
      });
    });
  };

  const totalOriginalPrice = bundle.BundleProduct.reduce(
    (sum, bp) => sum + (bp.product.discountedPrice || bp.product.price) * bp.quantity,
    0
  );

  const calculateBundlePrice = () => {
    switch (bundle.discountType) {
      case "percentage":
        return totalOriginalPrice - (totalOriginalPrice * bundle.discountValue) / 100;
      case "fixed":
        return Math.max(0, totalOriginalPrice - bundle.discountValue);
      case "buy_x_get_y":
        // Simplified calculation for display
        return totalOriginalPrice * 0.8; // Example: 20% off for buy X get Y
      default:
        return totalOriginalPrice;
    }
  };

  const bundlePrice = calculateBundlePrice();
  const savings = totalOriginalPrice - bundlePrice;

  const getDiscountText = () => {
    switch (bundle.discountType) {
      case "percentage":
        return `${bundle.discountValue}% OFF`;
      case "fixed":
        return `${formatCurrency(bundle.discountValue, currency)} OFF`;
      case "buy_x_get_y":
        return `Buy ${bundle.minQuantity} Get ${bundle.discountValue} Free`;
      default:
        return "Special Offer";
    }
  };

  const isExpired = bundle.validUntil && new Date() > new Date(bundle.validUntil);

  return (
    <Card className="w-full max-w-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Gift className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">{bundle.name}</CardTitle>
          </div>
          <Badge variant={isExpired ? "secondary" : "default"} className="text-xs">
            {getDiscountText()}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{bundle.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Products in Bundle */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-medium">
            <Package className="h-4 w-4" />
            <span>Bundle Contains:</span>
          </div>
          <div className="space-y-1">
            {bundle.BundleProduct.map((bundleProduct) => (
              <div key={bundleProduct.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span
                    className={bundleProduct.isRequired ? "font-medium" : "text-muted-foreground"}
                  >
                    {bundleProduct.product.name}
                  </span>
                  {!bundleProduct.isRequired && (
                    <Badge variant="outline" className="text-xs">
                      Optional
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground">
                    Qty: {bundleProduct.quantity}
                  </span>
                  <div className="font-medium">
                    {formatCurrency(
                      (bundleProduct.product.discountedPrice || bundleProduct.product.price) *
                        bundleProduct.quantity,
                      currency
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span>Original Price:</span>
            <span className="line-through text-muted-foreground">
              {formatCurrency(totalOriginalPrice, currency)}
            </span>
          </div>
          <div className="flex items-center justify-between font-semibold">
            <span>Bundle Price:</span>
            <span className="text-primary">{formatCurrency(bundlePrice, currency)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-green-600">
            <span>You Save:</span>
            <span className="font-medium">{formatCurrency(savings, currency)}</span>
          </div>
        </div>

        {/* Validity */}
        {bundle.validUntil && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Valid until: {formatDate(bundle.validUntil)}</span>
          </div>
        )}

        {/* Minimum Quantity */}
        {bundle.minQuantity > 1 && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Tag className="h-3 w-3" />
            <span>Minimum quantity: {bundle.minQuantity}</span>
          </div>
        )}

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddBundle}
          className="w-full"
          disabled={isExpired || !bundle.isActive}
        >
          {isExpired ? "Offer Expired" : "Add Bundle to Cart"}
        </Button>
      </CardContent>
    </Card>
  );
}

interface BundleListProps {
  bundles: Bundle[];
  className?: string;
}

export function BundleList({ bundles, className }: BundleListProps) {
  const activeBundles = bundles.filter(
    (bundle) => bundle.isActive && (!bundle.validUntil || new Date() <= new Date(bundle.validUntil))
  );

  if (activeBundles.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No active bundle offers available at the moment.</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${className}`}>
      {activeBundles.map((bundle) => (
        <BundleCard key={bundle.id} bundle={bundle} />
      ))}
    </div>
  );
}
