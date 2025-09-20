"use client";

import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function CartSummary() {
    const { cart, clearCart, currency } = useAppContext();
    const { total, itemCount } = cart;

    const shipping = total > 50 ? 0 : 9.99
    const tax = total * 0.08
    const finalTotal = total + shipping + tax

    return (
        <Card className="sticky top-4">
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>{(currency || "$")}{total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `${currency || "$"}${shipping.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{(currency || "$")}{tax.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{(currency || "$")}{finalTotal.toFixed(2)}</span>
                </div>

                {total < 50 && (
                    <p className="text-xs text-muted-foreground">Add {(currency || "$")}{(50 - total).toFixed(2)} more for free shipping</p>
                )}
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" size="lg" disabled={itemCount === 0}>
                    Proceed to Checkout
                </Button>

                <Button variant="outline" className="w-full bg-transparent" onClick={clearCart} disabled={itemCount === 0}>
                    Clear Cart
                </Button>
            </CardFooter>
        </Card>
    )
}
