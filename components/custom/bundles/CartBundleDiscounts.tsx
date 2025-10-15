"use client";

import React from 'react';
import { Gift } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BundleDiscount, formatCurrency } from '@/lib/bundles';

interface CartBundleDiscountsProps {
    appliedDiscounts: BundleDiscount[];
    totalDiscount: number;
    currency?: string;
}

export function CartBundleDiscounts({
    appliedDiscounts,
    totalDiscount,
    currency = 'INR'
}: CartBundleDiscountsProps) {
    if (appliedDiscounts.length === 0) {
        return null;
    }

    return (
        <Card className="border-green-200 bg-green-50/50">
            <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                    <Gift className="h-4 w-4 text-green-600" />
                    <h3 className="font-medium text-green-800">Bundle Discounts Applied</h3>
                </div>

                <div className="space-y-2">
                    {appliedDiscounts.map((discount) => (
                        <div key={discount.bundleId} className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs bg-white">
                                    {discount.bundleName}
                                </Badge>
                            </div>
                            <div className="text-green-600 font-medium">
                                -{formatCurrency(discount.discount, currency)}
                            </div>
                        </div>
                    ))}

                    <div className="border-t pt-2 mt-2">
                        <div className="flex items-center justify-between font-semibold text-green-700">
                            <span>Total Bundle Savings:</span>
                            <span>-{formatCurrency(totalDiscount, currency)}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

interface CartTotalWithBundlesProps {
    subtotal: number;
    bundleDiscount: number;
    finalTotal: number;
    currency?: string;
}

export function CartTotalWithBundles({
    subtotal,
    bundleDiscount,
    finalTotal,
    currency = 'INR'
}: CartTotalWithBundlesProps) {
    return (
        <div className="space-y-2 p-4 bg-muted/20 rounded-lg">
            <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal, currency)}</span>
            </div>

            {bundleDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                    <span>Bundle Discount:</span>
                    <span>-{formatCurrency(bundleDiscount, currency)}</span>
                </div>
            )}

            <div className="border-t pt-2">
                <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>{formatCurrency(finalTotal, currency)}</span>
                </div>
            </div>

            {bundleDiscount > 0 && (
                <div className="text-xs text-green-600 text-center">
                    🎉 You saved {formatCurrency(bundleDiscount, currency)} with bundle offers!
                </div>
            )}
        </div>
    );
}