"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Gift, TrendingDown } from "lucide-react";
import { AppliedBundle } from "@/lib/bundles";

interface BundleOfferCardProps {
  bundle: AppliedBundle;
  onApply: () => void;
  onCancel?: () => void;
  isApplied?: boolean;
  currency?: string;
}

export function BundleOfferCard({
  bundle,
  onApply,
  onCancel,
  isApplied = false,
  currency = "₹",
}: BundleOfferCardProps) {
  const discountPercentage = Math.round(
    ((bundle.normalPrice - bundle.offerPrice) / bundle.normalPrice) * 100
  );

  return (
    <Card className="relative overflow-hidden bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800 p-6">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-300/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-300/10 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Header with badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-br from-purple-500 to-pink-500 p-3 rounded-lg">
              <Gift className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">{bundle.bundleName}</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {bundle.bundleType.replace("_", " ")}
              </p>
            </div>
          </div>
          <Badge className="bg-linear-to-r from-purple-600 to-pink-600 text-white border-0">
            Save {discountPercentage}%
          </Badge>
        </div>

        {/* Price breakdown */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between p-3 bg-white/40 dark:bg-black/20 backdrop-blur-sm rounded-lg border border-white/20 dark:border-white/10">
            <span className="text-sm font-medium text-muted-foreground">MRP Total</span>
            <span className="text-lg font-bold text-foreground line-through opacity-60">
              {currency}
              {bundle.normalPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/40 dark:bg-black/20 backdrop-blur-sm rounded-lg border border-white/20 dark:border-white/10">
            <span className="text-sm font-medium text-muted-foreground">Bundle Price</span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {currency}
              {bundle.offerPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                You Save
              </span>
            </div>
            <span className="text-lg font-bold text-green-700 dark:text-green-300">
              {currency}
              {bundle.savings.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Required items info */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {bundle.requiredItems.length} required item
              {bundle.requiredItems.length !== 1 ? "s" : ""} in this bundle. Removing any required
              item will cancel the bundle offer.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          {isApplied ? (
            <>
              <Button
                className="flex-1 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
                disabled
              >
                ✓ Bundle Applied
              </Button>
              {onCancel && (
                <Button variant="outline" className="flex-1" onClick={onCancel}>
                  Remove Bundle
                </Button>
              )}
            </>
          ) : (
            <Button
              className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 font-semibold"
              onClick={onApply}
            >
              Apply Bundle Offer
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
