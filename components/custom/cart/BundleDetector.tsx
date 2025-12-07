"use client";

import { useEffect, useState } from "react";
import { BundleOfferCard } from "./BundleOfferCard";
import { Bundle, getApplicableBundles } from "@/lib/bundles";
import { useAppContext } from "@/contexts/AppContext";

export function BundleDetector() {
  const { cart, currency } = useAppContext();
  const [applicableBundles, setApplicableBundles] = useState<Bundle[]>([]);
  const [appliedBundleId, setAppliedBundleId] = useState<string | null>(null);

  useEffect(() => {
    // Get all bundles that can be applied to current cart
    const bundles = getApplicableBundles(cart.items, cart.bundles);
    setApplicableBundles(bundles);

    // Check if we have any applied bundle
    if (cart.appliedBundles && cart.appliedBundles.length > 0) {
      setAppliedBundleId(cart.appliedBundles[0].bundleId);
    } else {
      setAppliedBundleId(null);
    }
  }, [cart.items, cart.bundles, cart.appliedBundles]);

  const handleApplyBundle = (bundleId: string) => {
    // Set the applied bundle ID
    setAppliedBundleId(bundleId);
    // Trigger bundle calculation in cart
    // This will be reflected through cart.appliedBundles
  };

  const handleCancelBundle = () => {
    setAppliedBundleId(null);
    // Clear applied bundles
  };

  if (applicableBundles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-purple-300 to-transparent dark:via-purple-800"></div>
        <h2 className="text-xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          🎁 Bundle Offers Available
        </h2>
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-pink-300 to-transparent dark:via-pink-800"></div>
      </div>

      {applicableBundles.map((bundle) => {
        // Calculate bundle details
        const pricing = cart.appliedBundles?.find((ab) => ab.bundleId === bundle.id);
        const isApplied = appliedBundleId === bundle.id;

        if (!pricing) {
          // Create a minimal pricing object from bundle data
          const bundleDiscount = {
            bundleId: bundle.id,
            bundleName: bundle.name,
            bundleType: bundle.bundleType,
            normalPrice: bundle.normalPrice,
            offerPrice: bundle.offerPrice,
            savings: bundle.savings,
            requiredItems: bundle.items
              .filter((item) => item.isRequired)
              .map((item) => item.productId),
            appliedItems: bundle.items.map((item) => item.productId),
          };

          return (
            <BundleOfferCard
              key={bundle.id}
              bundle={bundleDiscount}
              onApply={() => handleApplyBundle(bundle.id)}
              onCancel={isApplied ? handleCancelBundle : undefined}
              isApplied={isApplied}
              currency={currency}
            />
          );
        }

        return (
          <BundleOfferCard
            key={bundle.id}
            bundle={pricing}
            onApply={() => handleApplyBundle(bundle.id)}
            onCancel={isApplied ? handleCancelBundle : undefined}
            isApplied={isApplied}
            currency={currency}
          />
        );
      })}
    </div>
  );
}
