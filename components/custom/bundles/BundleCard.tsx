"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import { Bundle, formatCurrency } from "@/lib/bundles";
import { Package, Tag, Clock, Gift, Plus, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BundleCardProps {
  bundle: Bundle;
}

export function BundleCard({ bundle }: BundleCardProps) {
  const { currency = "INR", addItem, cart, updateQuantity, removeItem } = useAppContext();

  // Check if any bundle item is already in cart (for simplicity, we'll track first item)
  const bundleCartItem =
    bundle.items.length > 0 && bundle.items[0].product
      ? cart.items.find((item) => item.id === bundle.items[0].product!.id)
      : undefined;

  const handleAddBundle = () => {
    // Add all required products to cart
    bundle.items
      .filter((item) => item.isRequired && item.product)
      .forEach((bundleItem) => {
        if (!bundleItem.product) return;
        addItem({
          id: bundleItem.product.id,
          name: bundleItem.product.name,
          price: bundleItem.product.discountedPrice || bundleItem.product.price,
          image: bundleItem.product.images[0] || "",
          quantity: bundleItem.quantity,
        });
      });
  };

  const totalOriginalPrice = bundle.items.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + (item.product.discountedPrice || item.product.price) * item.quantity;
  }, 0);

  const calculateBundlePrice = () => {
    // Use the pre-calculated offerPrice from the bundle
    return bundle.offerPrice;
  };

  const bundlePrice = calculateBundlePrice();
  const savings = bundle.savings;

  const getDiscountText = () => {
    switch (bundle.bundleType) {
      case "combo":
        return `COMBO OFFER`;
      case "fixed_discount":
        return `SAVE ${formatCurrency(savings, currency)}`;
      case "bogo":
        return `BUY ONE GET ONE`;
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
            {bundle.items
              .filter((item) => item.product)
              .map((bundleItem) => (
                <div key={bundleItem.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span
                      className={bundleItem.isRequired ? "font-medium" : "text-muted-foreground"}
                    >
                      {bundleItem.product!.name}
                    </span>
                    {!bundleItem.isRequired && (
                      <Badge variant="outline" className="text-xs">
                        Optional
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">
                      Qty: {bundleItem.quantity}
                    </span>
                    <div className="font-medium">
                      {formatCurrency(
                        (bundleItem.product!.discountedPrice || bundleItem.product!.price) *
                          bundleItem.quantity,
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
            <span>
              Valid until:{" "}
              {new Date(bundle.validUntil).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </span>
          </div>
        )}

        {/* Add to Cart Button */}
        {bundleCartItem ? (
          <div className="flex items-center gap-2 w-full">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 bg-transparent border-2 border-primary hover:bg-primary/10 transition-all duration-300"
              onClick={() => {
                // Update all bundle items
                bundle.items
                  .filter((item) => item.isRequired && item.product)
                  .forEach((bundleItem) => {
                    if (!bundleItem.product) return;
                    updateQuantity(bundleItem.product.id, bundleCartItem.quantity - 1);
                  });
              }}
            >
              <Minus className="h-3 w-3 text-primary" />
            </Button>

            <div className="flex-1 text-center py-2 px-2 bg-primary/5 rounded-xl border border-primary/20">
              <span className="text-sm font-bold text-primary">{bundleCartItem.quantity}</span>
            </div>

            <Button
              size="icon"
              className="h-10 w-10 bg-primary hover:bg-primary/90 text-white border-0 rounded-xl shadow-lg transition-all duration-300 group/add"
              onClick={() => {
                // Update all bundle items
                bundle.items
                  .filter((item) => item.isRequired && item.product)
                  .forEach((bundleItem) => {
                    if (!bundleItem.product) return;
                    updateQuantity(bundleItem.product.id, bundleCartItem.quantity + 1);
                  });
              }}
            >
              <Plus className="h-3 w-3 transition-transform group-hover/add:scale-110" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleAddBundle}
            className="w-full"
            disabled={isExpired || !bundle.isActive}
          >
            {isExpired ? "Offer Expired" : "Add Bundle to Cart"}
          </Button>
        )}
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
